import React from 'react'

const Jobs = ({ jobs, loading, userID }) => {
    if(loading) {
        return <h2>Loading...</h2>
    }

    return(
        <ul id='listings' className='list-group mb-4'>
            {jobs.map(({properties},index) => (
                <li>
                    <div key={index} className="card m-0 h-auto w-100">
                        <div className="card-body py-auto">
                            <h6 className="card-title">{properties.position}</h6>
                            <h6>{properties.company_name}</h6>
                            <p className="card-text">{properties.description}</p>
                            <p>Skills required: {properties.skills.map( ({ name }) => name).join(', ')} | Posted on: {properties.created_at.split("T")[0]}</p>
                            {/* <p>Posted on: {properties.created_at.split("T")[0]}</p> */}
                            <a href={`/applicants/users/${userID}/${properties.id}/job_applications/new`} className="btn btn-primary">Apply Now</a>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default Jobs

