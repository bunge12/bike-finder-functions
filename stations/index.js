const { default: axios } = require("axios");

const distance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
};

const findNearestStations = (stations, status, filters) => {
  const closestStations = stations
    .map((station) => {
      const stationStatus = status.find(
        (status) => status.station_id === station.station_id
      );
      return {
        ...station,
        ...stationStatus,
        distance: distance(
          filters.lat,
          filters.lng,
          station.lat,
          station.lon,
          "K"
        ),
      };
    })
    .sort((a, b) => {
      return a.distance - b.distance;
    })
    .filter((station) => {
      if (filters.item === "bikes") {
        return station.num_bikes_available_types.mechanical > filters.quantity;
      }
      if (filters.item === "e-bikes") {
        return station.num_bikes_available_types.ebike > filters.quantity;
      }
    })
    .slice(0, filters.stations);

  return closestStations;
};

module.exports = async function (context, req) {
  try {
    if (!req.body) throw new Error("no request body found");
    const status = (
      await axios.get(
        "https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_status"
      )
    ).data.data.stations;
    const stations = (
      await axios.get(
        "https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information"
      )
    ).data.data.stations;
    const result = findNearestStations(stations, status, req.body);
    if (result.length === 0) {
      context.res = {
        status: 204,
      };
    }
    context.res = {
      status: 200,
      body: result,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error.message,
    };
  }
};
