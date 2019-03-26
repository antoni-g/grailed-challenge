const express = require('express');
const React = require('react');
const renderToString = require('react-dom/server');
// logging output
const log = require('debug')('react_ssr');
const routes = require('./routes/routes.js');

const app = express();

const port = (process.env.PORT || 3000);
app.listen(port, () => {
  log(`App listening on port ${port}`);
});
