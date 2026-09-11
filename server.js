const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 3000;

// Security and performance middlewares
const VALIDATOR_API_ORIGIN = process.env.VALIDATOR_API_URL || 'http://localhost:8000';
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
            connectSrc: ["'self'", 'http://localhost:8000', 'https://localhost:8000'],
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

app.get('/proxy/spec', (req, res) => {
    proxyUpstream(SPEC_TARGET, res);
});

// Relative $refs inside the spec resolve against this proxy's own URL, landing here.
app.get('/proxy/*subpath', (req, res) => {
    const subpath = req.params.subpath.join('/');
    proxyUpstream(`${VALIDATOR_API_ORIGIN}/api/${subpath}`, res);
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
