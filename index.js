const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/proxy', (req, res) => {
    const { url } = req.body;
    if (!url) {
        res.status(400).send('URL parameter is required.');
        return;
    }

    const url = url.startsWith('http') ? url : 'http://' + url;

    const options = {
        target: url,
        changeOrigin: true,
        pathRewrite: {
            [`^/proxy`]: '',
        },
    };

    const proxyMiddleware = createProxyMiddleware(options);
    proxyMiddleware(req, res, (err) => {
        if (err) {
            console.error('Proxy Error:', err);
            res.status(500).send('Proxy Error');
        }
    });
});

app.get('/output', (req, res) => {
    const { url } = req.query;
    if (!url) {
        res.status(400).send('no.');
        return;
    }

    res.render('output', { url });
});

app.listen(port, () => {
    console.log(`Simple Proxy startedon 8080`);
});
