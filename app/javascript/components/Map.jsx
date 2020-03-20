import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Jobs from './Jobs'
import Pagination from './Pagination'
import JobPic from '../../assets/images/job.png'
import SearchPin from '../../assets/images/search.png'
import { 
    allJobsOption,
    pointFeature, options,
    geoJsonMarkers, onLoad,
    geoLocationOptions
} from './mapFunctions'

const style = {
    width: "100rem",
    height: "600px"
}

const Map = ({API_KEY, jobs, all_skills}) => {
    const [filteredJobs, setFilteredJobs] = useState([])
    const [apiJobs, setApiJobs] = useState([])
    const [map, setMap] = useState({})
    const [filteredSkills, setFilteredSkills] = useState([])
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')    
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [jobsPerPage] = useState(10)
    
    const geoJSON = geoJsonMarkers(jobs.job_data)
    // get current jobs 
    const indexOfLastJob = currentPage * jobsPerPage
    const indexOfFirstJob = indexOfLastJob - jobsPerPage
    const currentJobs = filteredJobs.slice(indexOfFirstJob,indexOfLastJob)
    const paginate = pageNumber => setCurrentPage(pageNumber)

    useEffect(() => {
        mapboxgl.accessToken = API_KEY;

        if(jobs.coords[0] === -98.5795 && jobs.coords[1] === 39.8283) {
            createMap(allJobsOption)
        } else {
            createMap(options(jobs.coords))
        }
        return () => {
            map.remove()
        }
    },[])

    useEffect(() => {
        if(!query) return
        fetchJobData()
    },[query])

    useEffect(() => {
        if(!filteredJobs.length) return
        setLoading(false)
    },[filteredJobs])

    // useEffect(() => {
    //     if(!filteredSkills.length) return
    //     console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        
    //     map.getSource('markers').setData({
    //         type: 'FeatureCollection',
    //         features: filteredSkills
    //     })
    // },[filteredSkills])

    useEffect(() => {
        if(apiJobs.job_data) {
            const filteredPoints = geoJsonMarkers(apiJobs.job_data)

            console.log(apiJobs.job_data)
            console.log(geoJsonMarkers(apiJobs.job_data))
            console.log(filteredPoints.features)
            
            setLoading(true)
            setFilteredJobs(filteredPoints.features)
            map.getSource('markers').setData(filteredPoints)
            map.getSource('search').setData(pointFeature(apiJobs.coords))
            map.flyTo({center: apiJobs.coords, speed: 0.5,
                zoom: (query === "GET_ALL" ? 4 : 6 )})
        }
    },[apiJobs])

    function createMap(mapOptions) {
        const map = new mapboxgl.Map(mapOptions)
        const filteredPoints = geoJSON.features
        setLoading(true)
        setFilteredJobs(filteredPoints)
        onLoad(map,jobs.coords,filteredPoints,JobPic,SearchPin)
        map.addControl(new mapboxgl.GeolocateControl(geoLocationOptions))
        map.addControl(new MapboxDirections({accessToken: API_KEY}),'top-left');
        map.on('click','markers', e => console.log(e.features[0].properties))
        setMap( map )
    }

    function skillFilter({ target }) {
        if(target.value == 1) {
            target.value = 0
        } else {
            target.value = 1
            const skillToFilter = target.name
            // const someArray = filteredJobs.filter( ({ properties: { skills }}) => (
            //     skills.some( ({ name }) => name == skillToFilter)
            // ))
            // console.log(someArray)
            // console.log(apiJobs)

            axios.post('/map/filter', {
                skillToFilter,
                filteredJobs,
                coords: jobs.coords
            }).then( res => {
                console.log(res)
            }).catch( err => {
                console.log(err)
            })
        }
    }

    const fetchJobData = async () => {
        const request = await axios.get(`/map/jobs.json?location=${query}`)
        setApiJobs(request.data)
    } 
    return(
        <>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}> 
                <form style={{marginBottom:'1rem'}}  onSubmit={e => { e.preventDefault()
                                                                      setQuery(search)  }}>
                    <input type="text" name={query} onChange={e => setSearch(e.target.value)}/>
                    <input type="submit"/>
                </form>
                <button style={{marginBottom:'5rem'}} onClick={() => setQuery('GET_ALL')}>SEE ALL JOBS</button>
            </div>
            <div>
                {all_skills.map( ({name},index) => (
                    <button name={name} value={0} key={index} onClick={skillFilter}>{name}</button>
                ))}
            </div>
                <div id='map' style={style}></div>
                <Jobs jobs={currentJobs} loading={loading} />
                <Pagination jobsPerPage={jobsPerPage} totalJobs={filteredJobs.length} paginate={paginate} />
        </>
    )
}

export default Map