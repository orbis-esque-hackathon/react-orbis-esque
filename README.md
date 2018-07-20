# react-orbis-esque

This result of the [ORBIS-esque hackathon](http://dig-hum.de/aktuelles/open-call-modeling-travels-history-orbis-esque-hackathon-uni-vienna-july-18-20-2018)
in Vienna is an experiment to extract a simple, re-usable [React](https://reactjs.org/)
routing component from the codebase of [al-Ṯurayyā](https://orbis-esque-hackathon.github.io/althurayya/).

![Screenshot](screenshot.jpg)

## Live Demo

__A live demo is available at [https://orbis-esque-hackathon.github.io/react-orbis-esque/](https://orbis-esque-hackathon.github.io/react-orbis-esque/)__.
Click a place to select a start for the route, and another to select the end.
Note that not all places are connected to the road network, so you might not always
get a route.

## How it works

The current integration is for use with [react-mapbox-gl](https://github.com/alex3165/react-mapbox-gl).

Data for places and route segments must follow the example from al-Ṯurayyā. See
sample files in the `data` folder.

The `GraphHelper` holds routing code. Initialize it from the GeoJSON routes
file.

```js
import GraphHelper from './routing/GraphHelper.js';
import MapPath from './MapPath.jsx';

// ...

axios.get('data/routes.json')
  .then(result => {
    // Loads the data from the routes file and builds the graph
    this._graph = GraphHelper.buildGraph(result.data.features);
    this.setState({ routes: result.data });
  });
```

The `MapPath` components handles the drawing. Add it as a child of the
Map component. `places` is the array of start and end features, `segments`
is an array of linestring features.

```js
<Map
  style="mapbox://styles/mapbox/streets-v9"
  containerStyle={{
    height: "100vh",
    width: "100vw"
  }}>

  ...

  <MapPath
    places={this.state.highlighted.places}
    segments={this.state.highlighted.segments} />

</Map>
```

## Hacking on the code

You need __node.js__ and __npm__ installed on your machine. (Tested with
node.js v4.2.6 and npm v6.1.0.)

- Clone this repository
- Create a copy of `src/conf/constants.TEMPLATE.js` named `src/confg/constants.js`
  and add your own Mapbox API key
- Run `npm install` to install project dependencies
- Run `npm start` and go to [http://localhost:7171](http://localhost:7171)

## Potential ideas for the future...

...for whoever wants to play with it:

- Encapsulate just the routing functionality and the path drawing component,
  so that routing can be used alone; and different drawing components can be
  created for Mapbox, Leaflet, etc.
- Support the weight modifiers model developed as part of the hackathon.
- This demo is actually using the wrong routing algorithm (from [dijkstra.js](https://github.com/orbis-esque-hackathon/orbis-esque-hackathon.github.io/blob/master/althurayya/dijkstra.js)
in the original codebase). Use the correct one from [graph.js](https://github.com/orbis-esque-hackathon/orbis-esque-hackathon.github.io/blob/master/althurayya/graph.js)
instead.
- ...
