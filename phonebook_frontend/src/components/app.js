import React, { useState, useEffect } from 'react'
import AddNew from './addNewPerson'
import ListAll from './listAllPeople'
import SearchFilter from './searchFilter'
import personsService from '../services/persons'
import Notification from './notification'
import '../index.css'

const App = () => {
  // TODO...?: put these in one object ..?
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newPhoneNumber, setNewPhoneNumber ] = useState( 0 )
  const [ filteredPersons, SetFilteredPersons ] = useState( persons )
  const [ filter, filterSetter ] = useState( '' )
  const [ notification, setNotification] = useState('')

  const getAllPersons = () => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons( initialPersons )
        SetFilteredPersons( initialPersons )
      })
  }

  // get all data from db.json
  useEffect(getAllPersons, [])

  // this is just a helper function
  const validatePerson = ( newPerson, persons ) => {
    // check if empty
    if( newPerson.name && !isNaN( !newPerson.number ) ){
    // check if name or number already exists
    var nameIsInPersons = persons.some( person => person.name === newPerson.name );
    var phonenNumberIsInPersons = persons.some( person => person.number === newPerson.number );
    if( nameIsInPersons ){
        throw {
        phoneBookException: true,
        userText: `${ newPerson.name } is already in phone book`
        }
    } else if( phonenNumberIsInPersons ) {
        var originalOwner = persons.reduce( ( name, person ) => {
            if( person.number === newPerson.number ) {
                return person.name
            } 
            return name
        }, '' )
            throw {
            phoneBookException: true,
            userText: `Number ${ newPerson.number } belongs to ${ originalOwner }`
        }
    }
    // update the states
    } else {
        throw {
            phoneBookException: true,
            userText: 'None of the fields can be empty!' 
        } 
    }
    
  }

  const addPerson = ( event ) => {
    //not submitting anywhere
    event.preventDefault()
    let newPerson = { name: newName, number: newPhoneNumber }
    try {
        validatePerson( newPerson, persons )
        personsService
          .create(newPerson)
          .then(createdPerson => {
            setPersons( persons.concat( newPerson ) )
            setNewName( '' )
            setNewPhoneNumber( 0 )
          })
          .then(() => {
            setNotification(`Added ${newPerson.name}`)
            setTimeout(() => {setNotification(null)}, 5000)
          })
          .catch(error => {
            console.log(`there was an error when creating person: ${error}`)
          })
    } catch (error) {
        if( error.phoneBookException ) { // is a custom exception made in this project
            alert( error.userText )
        } else { // is an internal exception
            throw error
        }
    }
  }

  const changePhoneNumber = event => setNewPhoneNumber(event.target.value)
  const changeName = event => setNewName(event.target.value)

  const filterPersons = (event) => {
    let newFilter = event.target.value 
    filterSetter( newFilter )
    if( newFilter ){
        let newFilteredPersons = filteredPersons.filter( 
            person => person
                .name
                .toLowerCase()
                .startsWith( newFilter.toLowerCase() )
        )
      SetFilteredPersons( newFilteredPersons )
    } else {
      SetFilteredPersons( persons )
    }
  }
  
  const deletePerson = (person) => {
    return () => {
      let okToDelete = window.confirm(`Delete ${person.name} ?`) 
      if(okToDelete){
        personsService
        .exterminate(person.id)
        .then(getAllPersons)
        .catch(error => {
          console.log(`can not delete: ${error}`)
          alert('You have already deleted that person')
        })
      }
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <SearchFilter 
        filter={filter}
        filterHandler={filterPersons}
      />
      <AddNew 
        addPersonHandler={addPerson}
        name={newName}
        nameChangeHandler={changeName}
        numberChangeHandler={changePhoneNumber}
        phoneNumber={newPhoneNumber}
      />
      <ListAll 
        persons={Boolean(filter) ? filteredPersons : persons} 
        deleteHandler={deletePerson}  
      />
    </div>
  )
}

export default App