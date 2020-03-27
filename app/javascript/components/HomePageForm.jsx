import React, { useState } from 'react'


const HomePageForm = () => {
    const [search, setSearch] = useState('')


    return(
        <form action="/search" method="post" >
            <input className="form_input" type="text" value={search} onChange={e => {setSearch(e.target.value)}}/>
            <input className='banner_input-button' type="submit" value="SEARCH JOBS" />
        </form>
    )
}

export default HomePageForm