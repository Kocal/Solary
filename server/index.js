const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
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
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'solary admin',
  store: new MemoryStore({
    checkPeriod: 86400000,
  }),
  cookie: { maxAge: 60000 },
}));
app.use(flash());
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
  ws.send(JSON.stringify({
    type: 'INFO',
    data: {
      message: 'Connected to WebSocket server.',
    },
  }));
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
  const errors = [];
  const notificationTitle = (req.body['notification[title]'] || '').trim();
  const notificationMessage = (req.body['notification[message]'] || '').trim();

  if (notificationTitle === '') {
    errors.push('Le titre de notification est vide');
  }

  if (notificationMessage === '') {
    errors.push('Le message de notification est vide');
  }

  if (errors.length === 0) {
    wss.broadcast(JSON.stringify({
      type: 'NOTIFICATION',
      data: {
        title: notificationTitle,
        message: notificationMessage,
      },
    }));

    req.flash('send_notification_success', 'La notification a bien été envoyée !');
  } else {
    errors.forEach(error => req.flash('send_notification_error', error));
  }

  res.redirect('/');
});

app.get('/logout', auth.connect(basic), (req, res) => {
  res.status(401);
  res.end('Disconnected.');
});

httpsServer.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
