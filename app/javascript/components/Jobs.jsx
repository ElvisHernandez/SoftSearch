import React from 'react'

const Jobs = ({ jobs, loading, userID }) => {
    if(loading) {
        return <h2>Loading...</h2>
    }

    return(
        <ul id='listings' className='list-group mb-4'>
            {jobs.map(({properties},index) => (
                <div key={index} className="card m-0 w-100">
                    {/* {console.log(properties.id)} */}

                    <div className="card-body">
                        <h5 className="card-title">{properties.position}</h5>
                        <p className="card-text">{properties.description}</p>
                        <a href={`/applicants/users/${userID}/${properties.id}/job_applications/new`} className="btn btn-primary">Apply Now</a>
                    </div>
                </div>
            ))}
        </ul>
    )
}

export default Jobs

