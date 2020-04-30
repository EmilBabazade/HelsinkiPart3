require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

mongoose.set('useFindAndModify', false)

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
    Person.find().then(results => {
      const personCount = results.length
      const now = new Date()
      res.send(`
          <p>Phonebook has info for ${personCount} </p>
          <p>${now}</p>
      `)
    })
    
})

// get one person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person.toJSON())
      }
      res.status(404).end()
    })
    .catch(err => {
      // console.log(`error is ${err} ALSO ${typeof err}`)
      next(err)
    })
})

//TODO implement delete one
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(deletedPerson => {
      console.log(`deleted: ${deletedPerson}`)
      res.status(204).end()
    })
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

// update a person
app.put('/api/persons/:id', (req, res, next) => {
  const bodyContent = req.body

  const person = {
    name: bodyContent.name,
    number: bodyContent.number
  }
  
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(err => next(err))
})

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

const unknownEndpoint = (req, res) => {
  res.status(404).json({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err)

  if(err.name === 'CastError' && err.path === '_id'){
    return res.status(400).send({ err: 'malformatted id' })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)