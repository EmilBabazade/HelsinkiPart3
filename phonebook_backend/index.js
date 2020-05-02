require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')


//  to get rid of mongoose deprication warnings
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

mongoose.set('useFindAndModify', false)

// TODO: implement morgan middleware for logging

// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//  TODO implement get all
app.get('/api/persons', (req, res) => {
  Person
    .find()
    .then((persons) => {
      res.json(persons.map((person) => person.toJSON()))
    })
    .catch((err) => res.status(404).json({
      error: `error when fetching all persons: ${err}`,
    }))
})

//  TODO implement info page
app.get('/info', (req, res) => {
  Person.find().then((results) => {
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
    .then((person) => {
      if (person) {
        res.json(person.toJSON())
      }
      res.status(404).end()
    })
    .catch((err) => {
      // console.log(`error is ${err} ALSO ${typeof err}`)
      next(err)
    })
})

// TODO implement delete one
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then((deletedPerson) => {
      console.log(`deleted: ${deletedPerson}`)
      res.status(204).end()
    })
})

// update a person
app.put('/api/persons/:id', (req, res, next) => {
  const bodyContent = req.body

  const person = {
    name: bodyContent.name,
    number: bodyContent.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
  })
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON())
    })
    .catch((err) => next(err))
})

// TODO implement create
app.post('/api/persons/', (req, res, next) => {
  const {
    body,
  } = req
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => res.json(savedAndFormattedPerson))
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({
    error: 'unknown endpoint',
  })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err)

  // if(err.name === 'CastError' && err.path === '_id'){
  if (err.name === 'CastError') {
    return res.status(400).send({
      error: 'malformatted id',
    })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({
      error: err.message,
    })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)
