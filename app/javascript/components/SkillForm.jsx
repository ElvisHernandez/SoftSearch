import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SkillForm = ({ userId, allSkills }) => {
    const [ search, setSearch ] = useState('')
    const [ query, setQuery ] = useState('')
    const [ skills, setSkills ] = useState(allSkills)

    // console.log(skills)
    useEffect(() => {
        if (!query) return
        axios.post(`/employers/admins/${userId}/add_skill`, {
            skill: query
          })
          .then( ({ data: { skills } }) => setSkills(skills))
          .catch(err => console.log(err));
    },[query])


    function handleClick(e) {
        // e.preventDefault()
        const formattedSearch = search.charAt(0).toUpperCase() + search.slice(1)
        setQuery(formattedSearch)
        console.log(formattedSearch)
    }

    return(
        <div className="container-login">
            <div className="wrap-login post-page">
                <h1 className="subtitles-login-page">Post a Job Listing</h1>

                <form action="" className="subheading-subtitles-posting" >

                    <label htmlFor="company_name">Company:</label>
                    <input type="text" name="company_name" className="form-control"/>

                    <label htmlFor="position">Position:</label>
                    <input type="text" name="position" className="form-control"/>

                    <label htmlFor="Description">Description:</label>
                    <input type="text" name="Description" className="form-control"/>

                    <label htmlFor="Adress:">Address</label>
                    <input type="text" name="Address" className="form-control"/>



                    <div className="skills-checkboxes">
                        <h2 className="smallsubtitle">Choose Required Skill(s)</h2>

                        {skills.map(({ name },index) => (
                            <span key={index} >
                                <input type="checkbox" value={name} />
                                <label style={{marginRight:'1rem'}} htmlFor={name}>{name}</label>
                            </span>
                        ))}
                    </div>

                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <input name="newSkill" type="text" style={{height:'2.5rem'}} className="form-control w-50" onChange={e => setSearch(e.target.value)} />
                        <input style={{backgroundColor:'#2F78F3', height:'2.5rem'}} type="button" value="+ SKILL" className='banner_input-button' onClick={handleClick} />
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

export default SkillForm
