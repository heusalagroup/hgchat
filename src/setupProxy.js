const { createProxyMiddleware } = require('http-proxy-middleware');

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_PROXY_API_URL   ? process.env.REACT_APP_PROXY_API_URL   : 'http://localhost:8080';

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: REACT_APP_BACKEND_API_URL,
            changeOrigin: true,
            autoRewrite: true,
            protocolRewrite: 'http',
            pathRewrite: {
                ['^/api'] : ''
            },
        })
    );
};
