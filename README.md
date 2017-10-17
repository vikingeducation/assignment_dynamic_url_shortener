# dynamic_url_shortener
Build a URL shortening service, outfitted with realtime analytics.

Project Description:

This project allows the user to fabricate new short URLs based off of submitted URLs. Furthermore, it displays the number of instances (All Clicks) in which that short URL has been visited. The "All Clicks" property updates in real time by utilizing web sockets.

Heroku URL: https://dynamic-url-shortener.herokuapp.com/

How to work Application:

To use the demo in heroku, simply enter the name of the url into the URL_Shortener input area on the front page. After submitting, the URL will be displayed on a table on the front page. Visiting the short URL will redirect the user to the original URL location, while saving the clicked number info on the main page.

Emphasized Technologies:
  1. Redis
  2. Sockets.io

Interesting Technical Components:

Had a ton of fun on this project experimenting with sockets.io and loved the data flow for handling sockets!

Flow for registering a new short URL:
  1. listen for submission click on front end javascript side. When registered, send out "url" event.
  2. On back end, use the url name to make a new redis object.
  3. Store redis info (if valid) and emit back to all front end sides with new data as the "newId" event.
  4. Add the data to the table on the front end side

The flow for updating the count for a short URL:
  1. Send request to back end side with base URL and attached id. Extract id on back end side.
  2. Using id, query data (will return object) from redis and add 1 to the count of this queried object.
  3. Emit the new data as a "count" event to all listening sockets and redirect user to correct URL.
  4. Front end on all listening sockets will update respective counts.

Redis was also interesting to work with if only because it presented a challenge. Took a while for us to realize that nested objects could not be stored in redis.
