const stopIDData = require('../utilities/stationStopID.js');

module.exports = {
  name: 'line',
  description: 'Returns all the stations in a given line',
  usage: '[line]',
  time: 2,
  execute(message, args) {
    let line = args[0];
    let stationsArr = [];

    for(let i = 0; i < stopIDData.stationStopID.length; i += 1) {
      if(line === stopIDData.stationStopID[i][0]) {
        for(let j = 0; j < stopIDData.stationStopID[i].length - 1; j += 1) {
          stationsArr.push(stopIDData.stationStopID[i][1 + j][0]);
        }
      }
    }
    //check whether it is a letter or number before using in code message

    let resp = `${line} Train Stations\n------------------\n${stationsArr.join('\n')}`

    message.channel.send({
      content: `${resp}`,
      code: 'string'
    });
  }
};
