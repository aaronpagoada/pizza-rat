const Discord = require('discord.js');
const https = require('https');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const getLineAPI = require('../utilities/LineAPI.js');
const getStopID = require('../utilities/getLineStopID');
const stopIDData = require('../utilities/stationStopID.js');
const { mtakey } = require('./../config.json');

module.exports = {
  name: 'time',
  description: 'Return next three train times in a given direction',
  usage: '[line] [station]',
  cooldown: 5,
  execute(message, args) {
    let line = args.shift(); // Gets train line
    let station = args.join(' '); // Gets station
    let stopIDs = getStopID(line, station); //Gets station codes
    let lineAPI = getLineAPI(line); // Gets line feed api using line arg

    let nextArrivalsN = []; // Two empty arrays to be filled with the next three arrivals in both directions 
    let nextArrivalsS = []; // They will populate the embed

    function timeConvert (time) { // Courtesy of https://stackoverflow.com/users/125685/hbp
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]; // Check correct time format and split into components

      if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join(''); // return adjusted time or original string
    }

    https.get(
      `${lineAPI}`,
      { headers: { "x-api-key": `${mtakey}` } },
      (resp) => {
        resp.on('data', (dataChunk) => { // On protobuf recieved
          console.log("Receiving Data");
          const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(dataChunk); // Using gtfs-realtime-bindings to parse the protobuf
          const noOfTrips = feed.entity.length; // The number of trips is actually half of the value given here, but we must use the full value to index through the feed as trip info comes in sequential pairs.

          for (let i = 0; i < noOfTrips; i += 2) { // This is why we increment by 2 and not 1 ^^^
            for (let j = 0; j < feed.entity[i].tripUpdate.stopTimeUpdate.length; j += 1) { // Remaining stops (j) for a given trip (i) irrespective of direction
              console.log(feed.entity[i].tripUpdate.stopTimeUpdate[j].arrival.time.low);
              let UTCtime = new Date(feed.entity[i].tripUpdate.stopTimeUpdate[j].arrival.time.low * 1000); // Arrivals times are stored as epochs thus the * 1000
              // figure out that error
              if (feed.entity[i].tripUpdate.stopTimeUpdate[j].stopId === stopIDs[0]) {
                nextArrivalsN.push(UTCtime.toTimeString().slice(0, -33));
              } else if (feed.entity[i].tripUpdate.stopTimeUpdate[j].stopId === stopIDs[1]) {
                nextArrivalsS.push(UTCtime.toTimeString().slice(0, -33));
              }
            }
          }
        });
        resp.on('end', () => {
          console.log("Finished receiving data");
          
          let timeEmbed = new Discord.MessageEmbed()
            .setTitle(`${station} (${line}) Arrival Times`)
            .addFields(
              { name: `To ${stopIDData.stationStopID[0][1][0]}`, value: `[1] ${timeConvert(nextArrivalsN[0])}`, inline: true },
              { name: '\u200B', value: `[2] ${timeConvert(nextArrivalsN[1])}`, inline: true },
              { name: '\u200B', value: `[3] ${timeConvert(nextArrivalsN[2])}`, inline: true },
              { name: `To ${stopIDData.stationStopID[0][stopIDData.stationStopID[0].length - 1][0]}`, value: `[1] ${timeConvert(nextArrivalsS[0])}`, inline: true },
              { name: '\u200B', value: `[2] ${timeConvert(nextArrivalsS[1])}`, inline: true },
              { name: '\u200B', value: `[3] ${timeConvert(nextArrivalsS[2])}`, inline: true }
            )
            .setTimestamp()

          message.channel.send(timeEmbed);
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      }
    );
  }
};
