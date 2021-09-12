const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (_, res) => {
    res.sendFile(`${__dirname}/public/views/index.html`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});