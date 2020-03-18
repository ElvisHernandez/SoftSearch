import React, { useState, useEffect } from 'react'
import axios from 'axios'
import JobPic from '../../assets/images/job.png'
import SearchPin from '../../assets/images/search.png'
import { 
    filterGeoJsonPoints,
    geoJsonMarkers, onLoad,
    geoLocationOptions,flyToProps
} from './mapFunctions'


const Map = ({API_KEY, coords, jobs}) => {
    const [filteredJobs, setFilteredJobs] = useState([])
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')    
    const [map, setMap] = useState({})

    const usCenter = [-98.5795,39.8283] // center of the united states

    const style = {
        width: "100rem",
        height: "600px"
    }

    // async function geoCoder() {
    //     const response = await axios(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${API_KEY}`)
    //     console.log(response.data.features[0].geometry.coordinates)
    //     return (response.data.features[0].geometry.coordinates)
    // } 


    function createMap(mapOptions) {
        const map = new mapboxgl.Map(mapOptions)
        
        map.addControl(
            new mapboxgl.GeolocateControl(geoLocationOptions)
        )

        setMap( map )
    }


    useEffect(() => {
        mapboxgl.accessToken = API_KEY;

        const options = {
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: coords,
            zoom: 6
            }

        createMap(options)
    },[])


    useEffect(() => {
        if(Object.entries(map).length === 0) return


        const filteredPoints = filterGeoJsonPoints(coords,geoJsonMarkers(jobs))

        setFilteredJobs(filteredPoints)
        
        // console.log(geoJsonMarkers)


        onLoad(map,coords,filteredPoints,JobPic,SearchPin)

        // if(query) {
        //     map.flyTo({
        //         center: geoCoder(), 
        //         ...flyToProps
        //     })
        // }


        // return () => {
        //     map.remove()
        // }

    },[map])

    useEffect(() => {
        if(!query) return

        const geoCoder = async () => {
            const response = await axios(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${API_KEY}`)

            map.flyTo({
                center: response.data.features[0].geometry.coordinates, 
                ...flyToProps
            })

            return (response.data.features[0].geometry.coordinates)
        } 

        geoCoder()



        
    },[query])



    function onChange(event) {
        console.log(event.target.value)
        setSearch(event.target.value)
    }

    function onSubmit(event) {
        event.preventDefault()
        console.log(`This is the query!!!!!!!!!! ${query}`)
        setQuery(search)
    }
    return(
        <>
            <form style={{marginBottom:'5rem'}} action='/search' method='GET' onSubmit={onSubmit}>
                <input type="text" name={query} onChange={onChange}/>
                {/* <input type="submit" name="q" value={query || "Search Now"}/> */}
            </form>

            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <div>
                    {filteredJobs.map( ({properties},index) => {
                        return(
                            <div key={index}>
                                <h1>{properties.position}</h1>
                                <p>{properties.date}</p>
                                <p>{properties.description}</p>
                            </div>
                        )
                    })}
                </div>
                <div id='map' style={style}></div>

            </div>
        </>
    )
}

export default Map