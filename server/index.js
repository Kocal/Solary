const express = require('express');
const auth = require('http-auth');

const port = process.env.PORT || 3000;
const basic = auth.basic({
  realm: 'Authentification nécessaire',
  file: `${__dirname}/.htpasswd`,
});

const app = express();
app.set('view engine', 'ejs');

app.get('/', auth.connect(basic), (req, res) => {
  res.render('home', {
    user: req.user,
  });
});

app.get('/logout', auth.connect(basic), (req, res) => {
  res.status(401);
  res.end('Disconnected.');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
