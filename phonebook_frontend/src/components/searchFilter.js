import React from 'react'

const SearchFilter = ({filter, filterHandler}) => {
    return(
        <div>
            filter shown with 
            <input 
                value={ filter } 
                onChange={ filterHandler } 
            />
        </div>
    );
}

export default SearchFilter