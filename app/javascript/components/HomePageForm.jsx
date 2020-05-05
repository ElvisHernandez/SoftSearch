import React, { useState, useEffect } from "react";

const HomePageForm = ({ skills }) => {
  const [search, setSearch] = useState("");
  const [activeSkills, setActiveSkills] = useState([]);

  function handleClick(e) {
    const currentSkill = e.target.value;

    if (e.target.id === "") {
      setActiveSkills([...activeSkills, currentSkill]);
    } else {
      const newActiveSkills = activeSkills.filter(
        (skill) => skill !== currentSkill
      );
      setActiveSkills(newActiveSkills);
    }
  }

  return (
    <>
      <form action="/search" method="post">
        <input
          className="form_input"
          type="text"
          name="q"
          value={search}
          placeholder="Set a Location"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <input type="hidden" name="skills" value={activeSkills} />
        <input
          className="banner_input-button"
          type="submit"
          value="SEARCH JOBS"
        />
      </form>

      <div className="search-item">
        {skills.map(({ name }, index) => (
          <button
            key={index}
            id={activeSkills.includes(name) ? "active" : ""}
            className="btn btn-md u-btn-outline-primary g-mr-10 g-mb-15"
            onClick={handleClick}
            value={name}
          >
            {activeSkills.includes(name) ? "- " : "+ "}
            {name}
          </button>
        ))}
      </div>
    </>
  );
};

export default HomePageForm;
