require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

//TODO: implement morgan middleware for logging

morgan.token('body', (req, res) => JSON.stringify(req.body) )

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//TODO implement get all
app.get('/api/persons', (req, res) => {
    Person
      .find()
      .then(persons => {
        res.json(persons.map(person => person.toJSON()))
      })
      .catch(err => res.status(404).json({
        error: `error when fetching all persons: ${err}`
      }))
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
  if(req.body){
    const newPerson = new Person({
      name: req.body.name,
      number: req.body.number
    })
    newPerson
      .save()
      .then(savedPerson => res.json(savedPerson.toJSON()))
      .catch(err => console.log(`error when creating new person: ${err}`))
  } else {
    res.status(400).json({
      error: 'person details (request body) missing'
    })
  }
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`server running on port ${PORT}`)