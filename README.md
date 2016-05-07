# Morgan

Small application used to display data through a "magic mirror".

![Morgan implementation](https://raw.githubusercontent.com/babelouest/morgan/master/mirror_making/4.jpg)

Display randomly on the screen the date/time and the weather, and display rss feeds titles in the bottom as a scrolling text.

Small 1-page application that uses AngularJS. Also uses google services to convert rss feeds to a json rest api.

# Configuration

Modify the file `dist/sources.json` to add, modify or remove sources.

A source file has the following format:

```json
[
  {
    "id": "quebecWeather",
    "display": "block",
    "type": "yahooWeather",
    "url": "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22quebec%2C%20ca%22)%20%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
    "refresh": 3600
  }
]
```
Each source json object in the array must have the following parameters:

`id`: an identifier for the source. Your choice, will not be displayed anyway.

`display`: display type, values can be `block` for a randomly display block, or `scroll` for a bottom text scroll.

`type`: source type, for now supports `yahooWeather`, `time` or `rss`.

`url`: mandatory for source types `rss` and `yahooWeather`, provides the url to get the data.

`refresh`: specify the time (in seconds) when the source will be refreshed.

# Installation

Install the folder `dist/` to a folder accessible to your web server, example:

```shell
$ cp -R dist /var/www/morgan
```

Then on your browser, go to the url `http://<your_web_server>/morgan`

Click on the `fullscreen` button to display the page in fullscreen mode.

# Development

The application is build using the 3 new knights of a brand new Web: `npm`/`bower`/`gulp`.

The source files are available in the `src/` directory.

Run `gulp serve` to work on the source files.

Run `gulp build` to build a new standalone application. The application will be available in the `dist/` directory.

# Magic mirror fabrication

I used a two-way mirror, an old android tablet, and some tools to fix the tablet behind the mirror.

A two-way mirror can be baught by itself, or you can add a mirror window film to a window glass.

Pictures of the fabrications steps are available in the folder `mirror_making`.
