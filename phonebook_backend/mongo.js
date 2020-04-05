const mongoose = require('mongoose')


const connectToDB = () => {
    const password = process.argv[2]
    const url = `mongodb+srv://emil:${password}@cluster0-oeitt.mongodb.net/phonebook-app?retryWrites=true&w=majority`
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })
    return new mongoose.model('Person', personSchema)
}

const displayAll = () => {
    const Person = connectToDB()
    Person
        .find({})
        .then(results => {
            results.forEach(person => console.log(person))
        })
        .catch(err => console.log(`error when finding: ${err}`))
        .finally(() => mongoose.connection.close())
}

const createNewPerson = () => {
    const Person = connectToDB()
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    newPerson
        .save(newPerson)
        .then(result => console.log('new person saved!'))
        .catch(err => console.log(`error when saving: ${err}`))
        .finally(() => mongoose.connection.close())
}

const argvLength = process.argv.length 

switch(argvLength) {
    case 0: case 1: case 2:
        console.log('You must enter your database password')
        process.exit(1)
        break;
    case 3:
        displayAll()
        break;
    case 4:
        console.log('You need to enter both name and number if you want to create a new person')
        process.exit(1)
        break;
    case 5:
        createNewPerson()
        break;
    default:
        console.log('Too many parameters')
}