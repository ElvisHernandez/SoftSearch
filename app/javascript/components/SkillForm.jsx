import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SkillForm = ({ userId }) => {
    const [ search, setSearch ] = useState('')
    const [ query, setQuery ] = useState('')

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

        <form action="#" onSubmit={handleSubmit} >
            <input name="newSkill" type="text" onChange={e => setSearch(e.target.value)} />
            <input type="submit" value="+SKILL"/>
        </form>

    )
}

export default SkillForm
