const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 3000;

// Security and performance middlewares
const VALIDATOR_API_ORIGIN = process.env.VALIDATOR_API_URL || 'https://127.0.0.1:8001';
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            // 'unsafe-inline' : styles injected by style-loader and swagger-ui
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", VALIDATOR_API_ORIGIN],
        },
    },
}));
app.use(compression());

app.use(express.static('public'));
app.use('/dist', express.static('dist'));

// Proxy the Swagger/OpenAPI spec (and the sibling JSON schema files it references via
// relative $refs, e.g. "./schema/validator-arguments.json") to avoid CORS issues when the
// API is on another origin. `symfony server:start` may serve the local validator-api over
// HTTPS with a self-signed certificate (when TLS is enabled via `symfony server:ca:install`),
// so the upstream request must not verify it, and we follow the http->https redirect Symfony
// can issue.
const SPEC_TARGET = process.env.VALIDATOR_SPECS_URL || `${VALIDATOR_API_ORIGIN}/api/validator-api.yml`;
const insecureAgent = new https.Agent({ rejectUnauthorized: false });

function proxyUpstream(url, res, redirectsLeft = 1) {
    const target = new URL(url);
    const client = target.protocol === 'https:' ? https : http;
    const options = target.protocol === 'https:' ? { agent: insecureAgent } : {};

    client.get(target, options, (upstream) => {
        if ([301, 302, 307, 308].includes(upstream.statusCode) && upstream.headers.location && redirectsLeft > 0) {
            upstream.resume();
            proxyUpstream(new URL(upstream.headers.location, target).toString(), res, redirectsLeft - 1);
            return;
        }
        res.status(upstream.statusCode);
        res.set('Content-Type', upstream.headers['content-type'] || 'application/octet-stream');
        upstream.pipe(res);
    }).on('error', (err) => {
        console.error('Error proxying', url, err);
        res.status(502).send('Failed to fetch upstream resource');
    });
}

// Same paths as validator-api, so that the specification URL displayed by swagger-ui is the usual one
app.get('/api/validator-api.yml', (req, res) => {
    proxyUpstream(SPEC_TARGET, res);
});

// Relative $refs inside the spec (e.g. "./schema/validator-arguments.json") resolve here.
app.get('/api/schema/*subpath', (req, res) => {
    const subpath = req.params.subpath.join('/');
    proxyUpstream(`${VALIDATOR_API_ORIGIN}/api/schema/${subpath}`, res);
});

// Proxy the API and the OIDC login routes of validator-api : the browser only sees this origin, so that the
// session cookie set by validator-api (users logged in with OIDC) is sent with the API requests, as when the
// client is served by validator-api. X-Forwarded-* let validator-api generate its URLs (ex : OIDC redirect URI
// http://localhost:3000/login_check) for this origin (127.0.0.1 is in its TRUSTED_PROXIES).
// ("/api" alone is the documentation page of this application ; "_wdt" and "_profiler" : Symfony debug toolbar in dev)
const PROXIED_PATHS = /^\/(api\/|login$|login_check$|logout$|_dev\/login$|_wdt\/|_profiler\/)/;
const HOP_BY_HOP_HEADERS = ['connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade', 'host'];

app.use(function (req, res, next) {
    if (!PROXIED_PATHS.test(req.path)) return next();

    const target = new URL(req.originalUrl, VALIDATOR_API_ORIGIN);
    const client = target.protocol === 'https:' ? https : http;
    const headers = Object.assign({}, req.headers);
    HOP_BY_HOP_HEADERS.forEach((name) => delete headers[name]);
    const host = req.headers.host || `localhost:${port}`;
    Object.assign(headers, {
        'x-forwarded-for': req.socket.remoteAddress,
        'x-forwarded-host': host,
        'x-forwarded-proto': req.protocol,
        'x-forwarded-port': host.includes(':') ? host.split(':').pop() : (req.protocol === 'https' ? '443' : '80'),
    });
    const options = { method: req.method, headers };
    if (target.protocol === 'https:') {
        options.agent = insecureAgent;
    }

    const upstreamRequest = client.request(target, options, (upstream) => {
        res.status(upstream.statusCode);
        Object.entries(upstream.headers).forEach(([name, value]) => {
            if (!HOP_BY_HOP_HEADERS.includes(name)) {
                res.setHeader(name, value);
            }
        });
        upstream.pipe(res);
    });
    upstreamRequest.on('error', (err) => {
        console.error('Error proxying', target.toString(), err);
        if (!res.headersSent) {
            res.status(502).send('Failed to reach validator-api');
        }
    });
    req.pipe(upstreamRequest);
});

// Serve the SPA index for any non-static GET route without using route patterns
app.use(function (req, res, next) {
    if (req.method !== 'GET') return next();
    const accept = req.headers.accept || '';
    if (!accept.includes('text/html')) return next();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`demo-validator started on http://localhost:${port}`);
});
