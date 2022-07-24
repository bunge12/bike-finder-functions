const { default: axios } = require("axios");

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
  } catch (error) {
    context.res = {
      status: 500,
      body: error.message,
    };
  }
};
