import React from "react";
import { geoJsonMarkers } from "./mapFunctions";

const MapSearch = ({
  search,
  setSearch,
  setQuery,
  currentSkills,
  mapRef,
  visibleSkills,
  setVisibleSkills,
  apiJobs,
  jobs,
  setFilteredJobs,
}) => {
  function skillFilter({ target }) {
    const [newVisibility, newVisibleSkills] = visibleSkills.includes(
      target.name
    )
      ? ["none", visibleSkills.filter((skill) => skill !== target.name)]
      : ["visible", [...visibleSkills, target.name]];
    mapRef.current.setLayoutProperty(target.name, "visibility", newVisibility);
    setVisibleSkills(newVisibleSkills);

    const filteredPoints = apiJobs.job_data
      ? geoJsonMarkers(apiJobs.job_data[0]).features
      : geoJsonMarkers(jobs.job_data[0]).features;

    const currentVisibleJobs = filteredPoints.filter(
      ({ properties: { skills } }) =>
        skills.some(({ name }) => newVisibleSkills.includes(name))
    );
    setFilteredJobs(currentVisibleJobs);
  }

  function showNoSkills() {
    visibleSkills.forEach((skill) => {
      mapRef.current.setLayoutProperty(skill, "visibility", "none");
    });
    setVisibleSkills([]);
    setFilteredJobs([]);
  }
  function showAllSkills() {
    currentSkills.forEach((skill) => {
      mapRef.current.setLayoutProperty(skill, "visibility", "visible");
    });
    setVisibleSkills(currentSkills);
    const filteredPoints = apiJobs.job_data
      ? geoJsonMarkers(apiJobs.job_data[0]).features
      : geoJsonMarkers(jobs.job_data[0]).features;
    setFilteredJobs(filteredPoints);
  }
  return (
    <>
      <form
        id="map-search-bar"
        className="form-inline mr-auto"
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "1rem",
          left: "0",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search);
        }}
      >
        <div>
          <input
            id="map-search-input"
            className="form-control mr-sm-2"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input className="banner_input-button" type="submit" />
        </div>
        <div>
          <button
            className="banner_input-button"
            onClick={() => setQuery("GET_ALL")}
          >
            SEE ALL JOBS
          </button>
          {currentSkills.length ? (
            <>
              <button className="banner_input-button" onClick={showAllSkills}>
                Show all skills
              </button>
              <button className="banner_input-button" onClick={showNoSkills}>
                Show no skills
              </button>
            </>
          ) : null}
        </div>
      </form>
      <div id="skills" style={{ position: "sticky", top: "0", zIndex: "1" }}>
        <div>
          {currentSkills.map((name, index) => (
            <button
              id="skill-button"
              className={`btn btn-md u-btn-outline-primary g-mr-10 g-mb-15 
                        ${
                          visibleSkills.includes(name) ? "active" : "inactive"
                        }`}
              name={name}
              key={index}
              onClick={skillFilter}
            >
              {visibleSkills.includes(name) ? "- " : "+ "}
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MapSearch;
