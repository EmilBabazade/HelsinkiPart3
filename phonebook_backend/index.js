const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

//TODO: implement morgan middleware for logging

morgan.token('body', (req, res) => JSON.stringify(req.body) )

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//TODO set list of numbers
let persons = [
    {
      "name": "kamil",
      "number": "98",
      "id": 3
    },
    {
      "name": "enef",
      "number": "12",
      "id": 4
    },
    {
      "name": "emil",
      "number": "123",
      "id": 5
    },
    {
      "name": "gud",
      "number": "1234",
      "id": 6
    },
    {
      "name": "fefe",
      "number": "01231",
      "id": 7
    }
]

//TODO implement get all
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//TODO implement info page
app.get('/info', (req, res) => {
    const numOfPersons = persons.length
    const now = new Date()
    res.send(`
        <p>Phonebook has info for ${numOfPersons} </p>
        <p>${now}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
//TODO find person with id
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)
    if(person) {
        res.json(person)
    } else {
//TODO if nothing send back 404 with error message
        res.status(404).json({
            error: `person with id ${id} does not exist`
        })
    }
})

//TODO implement delete one
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(n => n.id !== id)
  res.status(204).end()
})

//TODO implement uniqe id
const generateUniqeId = () => {
  const generateRandomId = () => Math.floor(Math.random() * Math.floor(999))
  let id = generateRandomId()
  while( persons.find(p => p.id === id) ) {
    id = generateRandomId()
  }
  return id
}

//TODO implement new person validation
const validateNewPerson = (person) => {
  const nameIsNotUniqe = persons.find(p => 
    p.name.toLowerCase().trim() === person.name.toLowerCase().trim()
  )
  const numberIsNotUniqe = persons.find(p => p.number === person.number )

  if(nameIsNotUniqe){
    throw `name ${person.name} already in phonebook`
  } 

  if(numberIsNotUniqe){
    throw `number ${person.number} already in phonebook`
  }
}

//TODO implement create
app.post('/api/persons/', (req, res) => {
  //generate uniqe id
  let id = generateUniqeId()
  //rest of the person properities in request body
  console.log(req.body)
  console.log(req)
  if(req.body){
    const newPerson = {
      name: req.body.name,
      number: req.body.number,
      id: id
    }
    try{
      validateNewPerson(newPerson)
    } catch(error) {
      res.status(400).json({error})
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
  } else {
    res.status(400).json({
      error: 'person details (request body) missing'
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)