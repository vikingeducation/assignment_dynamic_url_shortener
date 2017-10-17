# assignment_dynamic_url_shortener
Build a URL shortening service, outfitted with realtime analytics.


## Maddie Rajavasireddy

### Assignment Description:   
Build a simple URL shortener, similar to Google's. Just like Google's version, the application takes links and returns shortened URLs which redirect the visitor to the original link after passing through the server. It should similarly display the number of times the shortened-link has been accessed. However, to make things more exciting, the website should be live updating using web sockets.  

#### Requirements:   
1. Create a "link-shortener" module that can store and retrieve shortened URLs. This should be implemented using Redis.   
2. Create the basic Express application without WebSockets. User be able to view all the URLs along with their usage statistics, create new URLs, and, of course, visit the shortened URLs and be redirected to the appropriate page.   
3. Finally, make it realtime by adding WebSockets with the Socket.io library.   
4. Next to each shortened link, there should be a counter which displays the total number of times the link has been clicked.    

Concepts used: WebSockets, Express, Handlebars, Redis   
Start application with `npm start`
