const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/dist', express.static('dist'))

app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`demo-validator started on http://localhost:${port}`)
});
