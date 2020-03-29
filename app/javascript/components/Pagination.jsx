import React, { useState } from 'react'

const Pagination = ({ jobsPerPage, totalJobs, paginate }) => {
    const pageNumbers = []

    for(let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
        pageNumbers.push(i)
    }

    return(
        <nav aria-label="job-listing-pages">
            <ul className='pagination flex-wrap'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <button onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination