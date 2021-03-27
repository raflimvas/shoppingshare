const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(`${__dirname}/dist/ngShoppingShare`));

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/dist/ngShoppingShare/index.html`);
});

app.listen(process.env.PORT || 8080);
