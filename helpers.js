const { getCounterAndStamp } = require("./link_shortener");

function objectToArray(obj, callback) {
  var keysArray = Object.keys(obj);
  infoArray = [];
  keysArray.forEach(key => {
    // get counter and timestamp for this key from redis
    getCounterAndStamp(key, (counterData, timeData) => {
      infoArray.push({
        key: key,
        value: obj[key],
        counter: counterData,
        timestamp: timeData
      });
      if (infoArray.length == keysArray.length) {
        callback(infoArray);
      }
    });
  });
}
module.exports = { objectToArray };
