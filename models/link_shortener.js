let urlCollection = {};

function makeid() {
  var text = "";
  var allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 15; i++)
    text += allLetters.charAt(Math.floor(Math.random() * allLetters.length));

  return text;
}

// urlCollection['http://localhost:3000/short/' + makeid()] = 'https://i.pinimg.com/736x/32/97/4b/32974b49b7910d6959b79f1bb677dbdd--house-styles-bedroom-decor.jpg';
//



module.exports = urlCollection;
