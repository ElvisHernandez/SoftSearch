import React, { useEffect } from 'react'
import axios from 'axios'

const Jobs = ({ jobs, loading, currentUser, activeFavorites, setActiveFavorites }) => {

    if(loading) {
        return <h2>Loading...</h2>
    }

    useEffect(() => {
        if(!currentUser) return;
        axios(`/applicants/users/${currentUser.id}/all_favorites`)
        .then(({ data: { userFavorites } }) => {
            const favoritesIds = userFavorites.map(({ job_id }) =>  job_id )
            setActiveFavorites(favoritesIds)
        })
        .catch(err => console.log(err))
    },[])

    function handleClick(e,jobId) {
        if (e.target.id === 'unfav') {
            axios.post(`/applicants/users/${currentUser.id}/favorites`,{ jobId })
            .then( ({ data }) => {
                if (data) {
                    setActiveFavorites([...activeFavorites,jobId])
                }
            }).catch(err => console.log(err))

        } else {
            axios.delete(`/applicants/users/${currentUser.id}/favorites`, {
                params: { jobId }
            }).then( ({ data }) => {
                const newActiveFavorites = activeFavorites.filter( fav => fav !== jobId)
                setActiveFavorites(newActiveFavorites)
            }).catch(err => console.log(err))
        }
    }

    return(
        <ul id='listings' className='list-group mb-4'>
            {jobs.map(({ properties },index) => (
                <div key={index} className="card m-0 h-auto w-100">
                    <div className="card-body py-auto">
                        <h6 className="card-title">{properties.position}</h6>
                        <h6>{properties.company_name}</h6>
                        <p className="card-text">{properties.description}</p>
                        <p>Skills required: {properties.skills.map( ({ name }) => name).join(', ')} | Posted on: {properties.created_at.split("T")[0]}</p>
                        {currentUser && !currentUser.employer &&
                            <>
                                <a style={{backgroundColor:'rgb(47, 120, 243)'}} href={`/applicants/users/${currentUser.id}/${properties.id}/job_applications/new`} 
                                className="btn btn-primary">Apply Now</a>

                                <button id={activeFavorites.includes(properties.id) ? "fav":"unfav"} name={properties.id} style={{backgroundColor:'rgb(47, 120, 243)',marginLeft:'1rem'}} 
                                className="btn btn-primary" onClick={ e => handleClick(e,properties.id)}>Favorite</button>
                            </>
                        }
                    </div>
                </div>
            ))}
        </ul>
    )
}

export default Jobs

