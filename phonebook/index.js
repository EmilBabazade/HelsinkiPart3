const express = require('express')

const app = express()

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


const PORT = 3000
app.listen(PORT)
console.log(`server running on port ${PORT}`)