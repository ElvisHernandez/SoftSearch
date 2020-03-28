import React, { useState } from 'react'


const HomePageForm = ({ skills }) => {
    const [search, setSearch] = useState('')


    return(
        <>
            <form action="/search" method="post" >
                <input className="form_input" type="text" value={search} placeholder="Set a Location" onChange={e => {setSearch(e.target.value)}}/>
                <input className='banner_input-button' type="submit" value="SEARCH JOBS" />
            </form>

            <div className="search-item">
                {skills.map(({ name }) => <button className="btn btn-md u-btn-outline-primary g-mr-10 g-mb-15">{name}</button>)}
            </div>
        </>
    )
}

export default HomePageForm