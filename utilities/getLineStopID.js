const stopIDData = require('../utilities/stationStopID.js');

module.exports = function getStopID(line, station) { //finds the right station using args and returns station codes
  let stopIDs = [];

  for(let i = 0; i < stopIDData.stationStopID.length; i += 1) {
    if(line === stopIDData.stationStopID[i][0]) {
      for(let j = 0; j < stopIDData.stationStopID[i].length - 1; j += 1) {
        if(station === stopIDData.stationStopID[i][1 + j][0]) {
          stopIDs.push(stopIDData.stationStopID[i][1 + j][1]);
          stopIDs.push(stopIDData.stationStopID[i][1 + j][2]);
        }
      }
    }
  }

  return stopIDs;
};
