const express = require('express')
const bodyParser = require('body-parser')


const app = express()
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customer');
const port = 3000
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/api/users', usersRouter);
app.use('/api/customers', customersRouter);
app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })


    

})



app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}`)

})
