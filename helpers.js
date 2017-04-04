function objectToArray(obj) {
  var keysArray = Object.keys(obj);
  return keysArray.map(key => {
    return { key: key, value: obj[key] };
  });
}
module.exports = { objectToArray };
