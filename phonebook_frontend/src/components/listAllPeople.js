import React from 'react'

const ListAll = ({ persons, deleteHandler }) => {
    return(
        <div>
            <h2>Numbers</h2>
            <ul>
                { persons.map( person => {
                    return(
                        <li key={ person.id + person.name + person.number }>
                            { person.name } { person.number }
                            <button onClick={deleteHandler(person)}>delete</button>
                        </li>
                    )
                } ) }
            </ul>
        </div>
    );
}

export default ListAll