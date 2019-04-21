require('isomorphic-fetch');
const express = require('express');
const analysis = require('./analysis');
const app = express();
const port = 1337;

module.exports = app;

app.use('/analysis', analysis);
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
