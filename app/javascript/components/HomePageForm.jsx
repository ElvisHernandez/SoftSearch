import React, { useState, useEffect } from 'react'


const HomePageForm = ({ skills }) => {
    const [search, setSearch] = useState('')
    const [activeSkills, setActiveSkills] = useState([])

    function handleClick(e) {
        const currentSkill = e.target.value

        console.log(currentSkill)

        if (e.target.id === "") {
            setActiveSkills([...activeSkills, currentSkill])
        } else {
            const newActiveSkills = activeSkills.filter( skill => skill !== currentSkill)
            setActiveSkills(newActiveSkills)
        }
    }

    useEffect(() => {
        console.log(activeSkills)
    },[activeSkills])

    return(
        <>
            <form action="/search" method="post" >
                <input className="form_input" type="text" value={search} placeholder="Set a Location" onChange={e => {setSearch(e.target.value)}}/>
                <input className='banner_input-button' type="submit" value="SEARCH JOBS" />
            </form>

            <div className="search-item">
                {skills.map(({ name }) => <button id={activeSkills.includes(name) ? "active":""} className="btn btn-md u-btn-outline-primary g-mr-10 g-mb-15"
                 onClick={handleClick} value={name}>{name}</button>)}
            </div>
        </>
    )
}

export default HomePageForm