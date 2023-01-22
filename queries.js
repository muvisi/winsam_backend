const uuid = require('uuid')
const Pool = require('pg').Pool
const pool = new Pool({
// const { v4: uuidv4 } = require('uuid')
  user: 'mwangangi',
  host: 'localhost',
  database: 'rongai_test',
  password: 'samuel1997',
  port: 5432,
})


const getUsers = (request, response) => {
  pool.query('SELECT * FROM accounts_accountmodel ORDER BY date_joined ASC', (error, results) => {
    if (error) {
      throw error
      
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  // const id="eba32942-7739-49f0-827c-9371140c756c"
  // console.log("my ID",id)
  const id = "eba32942-7739-49f0-827c-9371140c756c"

  pool.query('SELECT * FROM accounts_accountmodel WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })

}
const createUser = (request, response) => {
  const date=new Date()
  const uniqueRandomID = uuid.v4()
  const { name='satoshi', email='satoshi@gmail.com',phone=0747511073,password="qwertyuiop",date_joined=date } = request.body

  pool.query('INSERT INTO accounts_accountmodel  (id,first_name, email,phone,password,date_joined) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [uniqueRandomID,name, email,phone,password,date_joined], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}
const updateUser = (request, response) => {
  // const id = parseInt(request.params.id)

  // const id = "eba32942-7739-49f0-827c-9371140c756c"
  const { first_name='Jaspy', last_name='satech',id = 'eba32942-7739-49f0-827c-9371140c756c' } = request.body

  pool.query(
    'UPDATE accounts_accountmodel SET first_name = $1, last_name = $2 WHERE id = $3',
    [first_name, last_name, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}
const deleteUser = (request, response) => {
  // const id = parseInt(request.params.id)
   const id = "eba32942-7739-49f0-827c-9371140c756c"

  pool.query('DELETE FROM accounts_accountmodel WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}