function objectToArray(obj) {
  var keysArray = Object.keys(obj);
  return keysArray.map(key => {
    return { key: obj[key] };
  });
}
module.exports = { objectToArray };
