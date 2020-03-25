import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CheckboxContainer from './CheckboxContainer'

const SkillForm = ({ userId, allSkills }) => {
    const [ search, setSearch ] = useState('')
    const [ query, setQuery ] = useState('')
    const [ skills, setSkills ] = useState(allSkills)

    console.log(skills)
    useEffect(() => {
        if (!query) return
        axios.post(`/employers/admins/${userId}/add_skill`, {
            skill: query
          })
          .then( res => console.log(res))
          .catch(err => console.log(err));
    },[query])


    function handleSubmit(e) {
        e.preventDefault()
        const formattedSearch = search.charAt(0).toUpperCase() + search.slice(1)
        setQuery(formattedSearch)
    }

    return(
        <div>
            <form action="">
                {skills.map( ({ name },index) => (
                    <>
                        <input key={index} type="checkbox" value={name} />
                        <label style={{marginRight:'1rem'}} htmlFor={name}>{name}</label>
                    </>
                ))}
            </form>
            <form action="#" onSubmit={handleSubmit} >
                <input name="newSkill" type="text" onChange={e => setSearch(e.target.value)} />
                <input type="submit" value="+SKILL"/>
            </form>
        </div>

    )
}

export default SkillForm
