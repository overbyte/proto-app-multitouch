# proto-app-multitouch

This is an svg view that will allow multiple users to be selected from,
returning an array of svg graphics, sorted in clockwise order starting 
with a random item. 

By using a web manifest, this PWA will behave like an app.

## Setup

To install use

```
npm install
```

A static webserver (like http-server) will be required to use this

## TODO

* Add a proper `start` script to the package.json to run a webserver
* Add animation to the touch points
* Sort in clockwise order before re-ordering with a random start (1st player)
* Fix app icons for ios
