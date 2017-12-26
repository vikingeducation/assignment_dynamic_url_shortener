# Dynamic URL Shortenter Source Code

A site to shorten URLS natively utilizing a custom NodeJS router. 

Features: 
- Allows you shorten any URL on the web to a custom domain path (i.e. yoursite.com/2343 -> google.com)
- Allows tracking of the shortened URLs and visits to the page

## Key Technologies Used and Technical Challenges 

Technologies used: 
- NodeJS
- Reddis Database 
- Web Sockets

Challenges:
- Redirecting users correctly to site -> utilized a Reddis Database to keep track of the path and the URL of the site to be redirected to 
- Tracking page visits -> tracked page visits with Reddis Request Counting feature and realtime updates on analytics page utilizing Web Sockets 

## Deployment

### Prerequisites

What things you need to install the software and how to install them

* nodejs
* reddis

### Local Deployment 
How to deploy this on your local machine

```
git clone <project-folder-on-github>
cd <cloned-project-folder-on-your-local-machine>
npm install
node index.js
```

## Authors

* **Steven Li** - _Initial work_ -
