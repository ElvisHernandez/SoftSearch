import React from 'react'
import axios from 'axios'

const Jobs = ({ jobs, loading, currentUser }) => {

    if(loading) {
        return <h2>Loading...</h2>
    }

    function handleClick(e,jobId) {
        e.persist()

        if (e.target.id === 'unfav') {
            axios.post(`/applicants/users/${currentUser.id}/favorites`,{ jobId })
            .then( ({ data }) => {
                if (data) {
                    e.target.id = 'fav'
                }
            })
            .catch(err => console.log(err))
            
        } else {
            axios.delete(`/applicants/users/${currentUser.id}/favorites`, {
                params: { jobId }
            }).then( ({ data }) => {
                console.log(data)
                e.target.id = 'unfav'
            })
            .catch(err => console.log(err))
        }
    }

    return(
        <ul id='listings' className='list-group mb-4'>
            {jobs.map(({properties},index) => (
                <div key={index} className="card m-0 h-auto w-100">
                    <div className="card-body py-auto">
                        <h6 className="card-title">{properties.position}</h6>
                        <h6>{properties.company_name}</h6>
                        <p className="card-text">{properties.description}</p>
                        <p>Skills required: {properties.skills.map( ({ name }) => name).join(', ')} | Posted on: {properties.created_at.split("T")[0]}</p>
                        <a style={{backgroundColor:'rgb(47, 120, 243)'}}href={`/applicants/users/${currentUser.id}/${properties.id}/job_applications/new`} 
                        className="btn btn-primary">Apply Now</a>
                        <button id="unfav" style={{backgroundColor:'rgb(47, 120, 243)',marginLeft:'1rem'}} 
                        className="btn btn-primary" onClick={ e => handleClick(e,properties.id)}>Favorite</button>
                    </div>
                </div>
            ))}
        </ul>
    )
}

export default Jobs

