import React, { useState, useEffect } from 'react'
import axios from 'axios'

const JobForm = ({ userId, allSkills }) => {
    const [ search, setSearch ] = useState('')
    const [ query, setQuery ] = useState('')
    const [ skills, setSkills ] = useState(allSkills)

    useEffect(() => {
        if (!query) return
        axios.post(`/employers/admins/${userId}/add_skill`, {
            skill: query
          })
          .then( ({ data: { skills } }) => setSkills(skills))
          .catch(err => console.log(err));
    },[query])


    function handleClick(e) {
        const formattedSearch = search.charAt(0).toUpperCase() + search.slice(1)
        setQuery(formattedSearch)
        console.log(formattedSearch)
    }

    return(
        <div className="container-login">
            <div className="wrap-login post-page">
                <h1 className="subtitles-login-page">Post a Job Listing</h1>

                <form action={`/employers/admins/${userId}/jobs`} method="post" className="subheading-subtitles-posting" >

                    <label htmlFor="company_name">Company:</label>
                    <input type="text" name="company_name" className="form-control"/>

                    <label htmlFor="position">Position:</label>
                    <input type="text" name="position" className="form-control"/>

                    <label htmlFor="description">Description:</label>
                    <input type="text" name="description" className="form-control"/>

                    <label htmlFor="adress:">Address (format: street address, city, state)</label>
                    <input type="text" name="address" className="form-control"/>

                    <div className="skills-checkboxes">
                        <h2 className="smallsubtitle">Choose Required Skill(s)</h2>

                        {skills.map(({ name, id },index) => (
                            <span key={index} >
                                <input type="checkbox" name='skills[]' value={id} />
                                <label style={{marginRight:'1rem'}} htmlFor={id}>{name}</label>
                            </span>
                        ))}
                    </div>

                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <input name="newSkill" type="text" style={{height:'2.5rem'}} 
                        className="form-control w-50" onChange={e => setSearch(e.target.value)} />

                        <input style={{backgroundColor:'#2F78F3', height:'2.5rem'}} type="button" 
                        value="+ SKILL" className='banner_input-button' onClick={handleClick} />
                    </div>

                    <br/>
                    <div className="container-login100-form-btn">
                        <div className="wrap-login100-form-btn">
                            <div className="login100-form-bgbtn"></div>
                            <button className="login100-form-btn">
                                <input type="submit" className='login100-form-btn'/>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default JobForm
