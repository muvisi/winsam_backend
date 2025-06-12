const express = require('express')
const bodyParser = require('body-parser')


const app = express()
const usersRouter = require('./routes/users');
const port = 3000
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/api/users', usersRouter);
app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })


    

})



app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}`)

})
