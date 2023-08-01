const express = require('express');
const app = express();
const userRouter = require('./routers/user');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);

module.exports = app;
