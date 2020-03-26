import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Jobs from './Jobs'
import Pagination from './Pagination'

import JobPic from '../../assets/images/job.png'
import SearchPin from '../../assets/images/search.png'
import { 
    allJobsOption,
    pointFeature, options,
    geoJsonMarkers,
    geoLocationOptions,
    createLayers,
    SEARCH_LAYER
} from './mapFunctions'

const style = {
    width: "60vw",
    height: "1090px",
    borderRadius: '10px'
}

const Map = ({ API_KEY, jobs, all_skills, currentUser }) => {
    const [filteredJobs, setFilteredJobs] = useState([])
    const [apiJobs, setApiJobs] = useState([])
    const [visibleSkills, setVisibleSkills] = useState(Object.keys(jobs.job_data[1]))
    const [currentSkills, setCurrentSkills] = useState(Object.keys(jobs.job_data[1]))  // array of current skills in jobs
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')    
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [jobsPerPage] = useState(5)
    const mapRef = useRef()

    // get current jobs 
    const indexOfLastJob = currentPage * jobsPerPage
    const indexOfFirstJob = indexOfLastJob - jobsPerPage
    const currentJobs = filteredJobs.slice(indexOfFirstJob,indexOfLastJob)
    const paginate = pageNumber => setCurrentPage(pageNumber)


    useEffect(() => {
        if(!query) return
        fetchJobData()
    },[query])

    useEffect(() => {
        if(!filteredJobs.length) return
        setLoading(false)
    },[filteredJobs])


    useEffect(() => {
        mapboxgl.accessToken = API_KEY;
        if(jobs.coords[0] === -98.5795 && jobs.coords[1] === 39.8283) {
            createMap(allJobsOption)
        } else {
            createMap(options(jobs.coords))
        }
        return () => { 
            mapRef.current.remove()
        }
    },[])

    useEffect(() => {
        if(apiJobs.job_data) {
            setCurrentPage(1)
            setVisibleSkills(Object.keys(apiJobs.job_data[1]))
            const filteredPoints = geoJsonMarkers(apiJobs.job_data[0])
            setCurrentSkills(Object.keys(apiJobs.job_data[1]))
            setLoading(true)
            setFilteredJobs(filteredPoints.features)
            createLayers(mapRef.current,apiJobs.job_data[1],all_skills)
            mapRef.current.getSource('search').setData(pointFeature(apiJobs.coords)) 
            mapRef.current.flyTo({center: apiJobs.coords, speed: 0.5,
                zoom: (query === "GET_ALL" || query === "" ? 4 : 6 )})
        }
    },[apiJobs])

    function createMap(mapOptions) {
        mapRef.current = new mapboxgl.Map(mapOptions)
        // mapRef.current = map
        const filteredPoints = geoJsonMarkers(jobs.job_data[0]).features   
        setLoading(true)
        setFilteredJobs(filteredPoints)
        mapRef.current.on('load', () => {
            mapRef.current.loadImage(JobPic, (error, image) => {
                if (error) throw error
                mapRef.current.addImage('JobPic', image)
            })
            createLayers(mapRef.current,jobs.job_data[1],all_skills)
            mapRef.current.loadImage(SearchPin, (error, image) => {
                if (error) throw error
                mapRef.current.addImage('SearchPin', image)
            })
            mapRef.current.addSource('search', {type: 'geojson', data:    {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: jobs.coords
                },
                properties: {foo: 'bar'}
            }})
            mapRef.current.addLayer(SEARCH_LAYER)
    
        })
        mapRef.current.addControl(new mapboxgl.GeolocateControl(geoLocationOptions))
        mapRef.current.addControl(new MapboxDirections({accessToken: API_KEY}),'top-left')
        // map.on('click','markers', e => console.log(e.features[0].properties))
    }

    function skillFilter({ target }) {
        const [ newVisibility, newVisibleSkills ] = visibleSkills.includes(target.name) ?
        ['none', visibleSkills.filter( skill => skill !== target.name)] :
        ['visible', [...visibleSkills, target.name]]
        mapRef.current.setLayoutProperty(target.name, 'visibility', newVisibility)
        setVisibleSkills(newVisibleSkills)
        
        const filteredPoints = (apiJobs.job_data ? 
            geoJsonMarkers(apiJobs.job_data[0]).features :
            geoJsonMarkers(jobs.job_data[0]).features) 
        const currentVisibleJobs = filteredPoints.filter( 
            ({ properties: { skills } }) => ( skills.some( ({ name }) => (
                newVisibleSkills.includes(name)))))
        setFilteredJobs(currentVisibleJobs)
    }

    function showNoSkills() {
        visibleSkills.forEach( skill => {
            mapRef.current.setLayoutProperty(skill, 'visibility', 'none')
        })
        setVisibleSkills([])
        setFilteredJobs([])
    }  

    function showAllSkills() {
        currentSkills.forEach( skill => {
            mapRef.current.setLayoutProperty(skill, 'visibility', 'visible')
        })
        setVisibleSkills(currentSkills)
        const filteredPoints = (apiJobs.job_data ? 
        geoJsonMarkers(apiJobs.job_data[0]).features :
        geoJsonMarkers(jobs.job_data[0]).features) 
        setFilteredJobs(filteredPoints)
    }

    const fetchJobData = async () => {
        const response = await axios.get(`/map/jobs.json?location=${query}`)
        setApiJobs(response.data)
    } 

    return(
        <>                        
            <form id="map-search-bar" className="form-inline mr-auto" style={{display:'flex',justifyContent:'space-around',
            alignItems:'center',marginBottom:'1rem',left:'0'}}  onSubmit={e => { e.preventDefault()
                                                                        setQuery(search)  }}>
                <div>                                                                            
                    <input id="map-search-input" className="form-control mr-sm-2" type="text" name={query} onChange={e => setSearch(e.target.value)}/>
                    <input className='banner_input-button' type="submit"/>
                </div>
                <div>
                    <button className='banner_input-button'  onClick={() => setQuery('GET_ALL')}>SEE ALL JOBS</button>
                    {currentSkills.length ? (
                        <>
                            <button className='banner_input-button' onClick={showAllSkills}>Show all skills</button>
                            <button className='banner_input-button' onClick={showNoSkills}>Show no skills</button>
                        </>  ) : null
                    }
                </div>
            </form>
            <div id="skills" style={{position:'sticky',top:'0', zIndex:'1'}}>
                <div>
                    {currentSkills.map( (name,index) => (
                        <button id="skill-button" className={`btn btn-md u-btn-outline-primary g-mr-10 g-mb-15 
                        ${visibleSkills.includes(name) ? 'active':"inactive"}`} 
                        name={name} key={index} onClick={skillFilter}>{visibleSkills.includes(name) ? '- ':"+ "}{name}</button>))
                    }
                </div>
            </div>

            <div id='map-and-listings'>
                
                <div id="listings-and-page-numbers">
                    <Jobs currentUser={currentUser} jobs={currentJobs} loading={loading} />
                </div>
                <div id='map' style={style}></div>
            </div>
            <div style={{  }}>
                <Pagination jobsPerPage={jobsPerPage} totalJobs={filteredJobs.length} paginate={paginate} />
            </div>
        </>
    )
}

export default Map
