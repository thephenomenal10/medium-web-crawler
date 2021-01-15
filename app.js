const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const nocache = require('nocache');
const bodyParser = require('body-parser');
const blogRouter = require('./router/blogRouter');
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(nocache());
app.use(cors({ origin: '*' }));

app.use('/', express.static('./public/'));
app.use('/api/v1/medium', blogRouter);

module.exports = app;
