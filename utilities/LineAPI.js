module.exports = function getLineAPI(line) {
  if(line === 'A' || line === 'C' || line === 'E') {    
    return 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace';
  } else if(line === 'B' || line === 'D' || line === 'F' || line === 'M') {
    return 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm';
  } else if(line === 'G') {
    return 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g';
  } else if(line === 'J' || line === 'Z') {
    return 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz';
  } else if(line === 'N' || line === 'Q' || line === 'R' || line === 'W') {
    return 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw';
  } else if(line === 'L') {
    return 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l';
  } else if(line === '1' || line === '2' || line === '3' || line === '4' || line === '5' || line === '6' || line === '7') {
    return 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';
  }
};
