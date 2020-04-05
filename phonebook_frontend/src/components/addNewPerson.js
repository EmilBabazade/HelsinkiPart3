import React from 'react'

const AddNew = ({
    name, 
    phoneNumber, 
    nameChangeHandler,
    numberChangeHandler,
    addPersonHandler
}) => {
    return(
        <div>
            <form>
                <div>
                    <h2>add a new</h2>
                    name: <input value={ name } onChange={ nameChangeHandler } />
                    <br/>
                    number: <input value={ phoneNumber } onChange={ numberChangeHandler } />
                </div>
                <div>
                    <button type="submit" onClick={ addPersonHandler }>add</button>
                </div>
            </form>
        </div>
    );
}

export default AddNew