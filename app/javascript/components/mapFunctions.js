export const usCenter = [-98.5795, 39.8283]; // center of the united states

export const flyToProps = { speed: 0.3, zoom: 14, bearing: 20, pitch: 20 };

export const popupRenderer = (props = {}) => `
  <div>
    <h5>${props.position}</h5>
    <p>${props.description}</p>
  </div>
`;

export const geoLocationOptions = {
  positionOptions: {
    enableHighAccuracy: false,
  },
  trackUserLocation: false,
  showAccuracyCircle: false,
  fitBoundsOptions: {
    maxZoom: 6,
  },
};

export const allJobsOption = {
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: usCenter,
  zoom: 4,
};

export const options = (center) => {
  return {
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center,
    zoom: 6,
  };
};

export const MARKER_LAYER = {
  id: "markers",
  type: "symbol",
  source: "markers",
  layout: {
    "icon-image": "JobPic",
    "icon-size": 0.25,
    "icon-allow-overlap": true,
  },
};

export const SEARCH_LAYER = {
  id: "search",
  type: "symbol",
  source: "search",
  layout: {
    "icon-image": "SearchPin",
    "icon-size": 0.5,
    "icon-allow-overlap": true,
  },
};

export function pointFeature(point) {
  if (!point.longitude) {
    point = {
      longitude: point[0],
      latitude: point[1],
    };
  }
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
    properties: { ...point },
  };
}

export function geoJsonMarkers(jobJson) {
  let features;
  if (!jobJson.length || !jobJson[0].job) {
    features = jobJson.map((job) => pointFeature(job));
  } else {
    features = jobJson.map(({ job, skills }) => {
      job = { ...job, skills };
      return pointFeature(job);
    });
  }
  return {
    type: "FeatureCollection",
    features,
  };
}

export function createLayers(MAP, jobObject, allSkills) {
  allSkills.map(({ name }) => {
    if (MAP.getLayer(`${name}`)) {
      MAP.removeLayer(`${name}`);
    }
    if (MAP.getSource(`${name}`)) {
      MAP.removeSource(`${name}`);
    }
  });
  const currentSkills = Object.keys(jobObject);
  const jobsPerSkillArray = Object.values(jobObject);
  const geoJsonArray = jobsPerSkillArray.map((jobs) => {
    return geoJsonMarkers(jobs);
  });
  geoJsonArray.map((geoJson, index) => {
    MAP.addSource(`${currentSkills[index]}`, {
      type: "geojson",
      data: geoJson,
    });
    MAP.addLayer({
      id: `${currentSkills[index]}`,
      type: "symbol",
      source: `${currentSkills[index]}`,
      layout: {
        "icon-image": "JobPic",
        "icon-size": 0.25,
        "icon-allow-overlap": true,
        visibility: "visible",
      },
    });
  });
}
