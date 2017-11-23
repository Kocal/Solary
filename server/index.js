const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const fs = require('fs');
const auth = require('http-auth');
const https = require('https');
const WebSocketServer = require('uws').Server;
const config = require('./config.js');

const port = process.env.PORT || 3000;

// Express
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');

const httpsServer = https.createServer({
  cert: fs.readFileSync(config.cert),
  key: fs.readFileSync(config.key),
}, app);

// WebSocket
const wss = new WebSocketServer({
  server: httpsServer,
  path: '/',
});

wss.on('connection', (ws) => {
  ws.send('Connected to WebSocket server.');
});

// Auth
const basic = auth.basic({
  realm: 'Authentification nécessaire',
  file: `${__dirname}/.htpasswd`,
});

// App
app.get('/', auth.connect(basic), csrfProtection, (req, res) => {
  res.render('home', {
    user: req.user,
    csrfToken: req.csrfToken(),
  });
});

app.post('/send_notification', parseForm, csrfProtection, (req, res) => {
  res.redirect('/');
});

app.get('/logout', auth.connect(basic), (req, res) => {
  res.status(401);
  res.end('Disconnected.');
});

httpsServer.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
