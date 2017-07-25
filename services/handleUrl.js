const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//make a tiny url for a given normal url
function handleUrl(url) {
  const newUrl = "http://107d8cd0.ngrok.io/t/" + getRandomString();
  return newUrl;
}

//helper function
function getRandomString() {
  var string = "";
  for (let i = 0; i < 6; i++) {
    string = string.concat(chars[Math.floor(Math.random() * 62)]);
  }
  return string;
}

module.exports = { handleUrl };
