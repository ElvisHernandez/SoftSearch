import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Jobs from "./Jobs";
import Pagination from "./Pagination";
import MapSearch from "./MapSearch";
import JobPic from "../../assets/images/job.png";
import SearchPin from "../../assets/images/search.png";
import {
  allJobsOption,
  pointFeature,
  options,
  geoJsonMarkers,
  geoLocationOptions,
  createLayers,
  SEARCH_LAYER,
  flyToProps,
  popupRenderer,
} from "./mapFunctions";

const style = {
  width: "100%",
  minHeight: "100vh",
  height: "100%",
  borderRadius: "10px",
};

const Map = ({ API_KEY, jobs, all_skills, currentUser, activeSkills }) => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [apiJobs, setApiJobs] = useState([]);
  const [visibleSkills, setVisibleSkills] = useState(
    Object.keys(jobs.job_data[1])
  );
  const [currentSkills, setCurrentSkills] = useState(
    Object.keys(jobs.job_data[1])
  ); // array of current skills in jobs
  const [activeFavorites, setActiveFavorites] = useState([]);

  const mapRef = useRef();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  // get current jobs
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (!query) return;
    fetchJobData();
    setSearch("");
  }, [query]);

  useEffect(() => {
    if (!filteredJobs.length) return;
    setLoading(false);
    if (!currentUser) return;
  }, [filteredJobs]);

  useEffect(() => {
    mapboxgl.accessToken = API_KEY;
    if (jobs.coords[0] === -98.5795 && jobs.coords[1] === 39.8283) {
      createMap(allJobsOption);
    } else {
      createMap(options(jobs.coords));
    }
    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (apiJobs.job_data) {
      setCurrentPage(1);
      setVisibleSkills(Object.keys(apiJobs.job_data[1]));
      const filteredPoints = geoJsonMarkers(apiJobs.job_data[0]);
      setCurrentSkills(Object.keys(apiJobs.job_data[1]));
      setLoading(true);
      setFilteredJobs(filteredPoints.features);
      createLayers(mapRef.current, apiJobs.job_data[1], all_skills);
      mapRef.current.getSource("search").setData(pointFeature(apiJobs.coords));
      mapRef.current.flyTo({
        center: apiJobs.coords,
        speed: 0.5,
        zoom: query === "GET_ALL" || query === "" ? 4 : 6,
      });
    }
  }, [apiJobs]);

  function createMap(mapOptions) {
    mapRef.current = new mapboxgl.Map(mapOptions);
    const filteredPoints = geoJsonMarkers(jobs.job_data[0]).features;
    setLoading(true);
    setFilteredJobs(filteredPoints);
    mapRef.current.on("load", () => {
      mapRef.current.loadImage(JobPic, (error, image) => {
        if (error) throw error;
        mapRef.current.addImage("JobPic", image);
      });
      createLayers(mapRef.current, jobs.job_data[1], all_skills);
      mapRef.current.loadImage(SearchPin, (error, image) => {
        if (error) throw error;
        mapRef.current.addImage("SearchPin", image);
      });
      mapRef.current.addSource("search", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: jobs.coords,
          },
          properties: { foo: "bar" },
        },
      });
      mapRef.current.addLayer(SEARCH_LAYER);

      if (activeSkills.length) {
        visibleSkills.forEach((skill) => {
          mapRef.current.setLayoutProperty(skill, "visibility", "none");
        });
        setVisibleSkills(activeSkills);

        activeSkills.forEach((skill) => {
          if (!currentSkills.includes(skill)) return;
          mapRef.current.setLayoutProperty(skill, "visibility", "visible");
        });

        const currentVisibleJobs = filteredPoints.filter(
          ({ properties: { skills } }) =>
            skills.some(({ name }) => activeSkills.includes(name))
        );
        setFilteredJobs(currentVisibleJobs);
      }
    });
    mapRef.current.addControl(
      new mapboxgl.GeolocateControl(geoLocationOptions)
    );
    mapRef.current.addControl(
      new MapboxDirections({ accessToken: API_KEY }),
      "top-left"
    );
    for (let i = 0; i < all_skills.length; i++) {
      const { name } = all_skills[i];
      mapRef.current.on("click", `${name}`, handleClick);
    }
  }

  function handleClick(e) {
    const { properties } = e.features[0];
    const coordinates = [properties.longitude, properties.latitude];

    mapRef.current.flyTo({ center: coordinates, ...flyToProps });
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupRenderer(properties))
      .addTo(mapRef.current);
  }

  const fetchJobData = async () => {
    const response = await axios.get(`/map/jobs.json?location=${query}`);
    setApiJobs(response.data);
  };

  return (
    <>
      <MapSearch
        search={search}
        setSearch={setSearch}
        setQuery={setQuery}
        currentSkills={currentSkills}
        mapRef={mapRef}
        visibleSkills={visibleSkills}
        setVisibleSkills={setVisibleSkills}
        apiJobs={apiJobs}
        jobs={jobs}
        setFilteredJobs={setFilteredJobs}
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-5 px-0">
            <Jobs
              currentUser={currentUser}
              jobs={currentJobs}
              loading={loading}
              activeFavorites={activeFavorites}
              setActiveFavorites={setActiveFavorites}
            />
          </div>

          <div className="col-7 px-0">
            <div id="map" style={style}></div>
          </div>
        </div>

        <div className="row">
          <Pagination
            jobsPerPage={jobsPerPage}
            totalJobs={filteredJobs.length}
            paginate={paginate}
          />
        </div>
      </div>
    </>
  );
};

export default Map;
