import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapboxGl, { Feature, GeoJSONLayer, Popup } from 'react-mapbox-gl';
import axios from 'axios';

import { MAPBOX_API_KEY } from './conf/constants.js';
import { CIRCLE_STYLE, LINE_STYLE } from './conf/styles.js'

import GraphHelper from './routing/GraphHelper.js';
import MapPath from './MapPath.jsx';

import '../style/app.scss';

const Map = ReactMapboxGl({ accessToken: MAPBOX_API_KEY });

// For initializing empty state
const EMPTY_GEOM = { type: 'FeatureCollection', features: [] };

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom:   [4], // map zoom
      places: EMPTY_GEOM, // Places GeoJSON
      routes: EMPTY_GEOM, // Routes GeoJSON
      highlighted: { // Selected route (if any) - places & route segments
        places:   [],
        segments: []
      }
    }
  }

  componentDidMount() {
    this._canvas = document.querySelector('.mapboxgl-canvas');

    axios.get('data/places_new_structure.geojson')
      .then(result => {
        this.setState({ places: result.data });
      });

    axios.get('data/routes.json')
      .then(result => {
        this._graph = GraphHelper.buildGraph(result.data.features);
        this.setState({ routes: result.data });
      });
  }

  /**
   * Helper to find the segment for a given start/end place pair
   * TODO move into a separate class (RoutableGraph?)
   */
  findSegment(from, to) {
    return this.state.routes.features.find(segment => {
      const s = segment.properties.sToponym;
      const e = segment.properties.eToponym;
      return (s === from && e === to) || (e === from && s === to);
    });
  }

  /**
   * TODO move into a separate class (RoutableGraph?)
   */
  calculateRoute(startFeature, endFeature) {
    const getId = feature => {
      const payload = JSON.parse(feature.properties.althurayyaData)
      return payload.URI;
    }

    const start = getId(startFeature);
    const end = getId(endFeature);

    // Note that this returns the IDs of the *NODES* along the road, i.e.
    // we now need to look up the segments which connect these nodes
    const path = this._graph.findShortestPath(start, end);

    if (path) {
      // Sliding window across path, pairwise
      const segments = [];
      for (var i=1; i<path.length; i++) {
        segments.push(this.findSegment(path[i - 1], path[i]));
      }

      return segments;
    }
  }

  onMapMove(e) {
    this.setState({
      zoom: [ e.transform._zoom ]
    })
  }

  onMouseEnterPlace(e) {
    this._canvas.style.cursor = 'crosshair';
  }

  onMouseLeavePlace(e) {
    this._canvas.style.cursor = 'inherit';
  }

  onSelectPlace(e) {
    const feature = (e.features.length > 0) ? e.features[0] : null;

    this.setState(previous => {
      if (previous.highlighted.places.length === 1) {
        const start = previous.highlighted.places[0];
        const end = feature;

        const segments = this.calculateRoute(start, end);

        if (segments)
          return { highlighted: { places: [ start, end ], segments: segments } };
        else
          return { highlighted: { places: [ start, end ] } };
      } else
        return { highlighted: { places: [ feature ] } };
    });
  }

  // Popup

  render() {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        zoom={this.state.zoom}
        onMoveEnd={this.onMapMove.bind(this)}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
          <GeoJSONLayer
            id="routes"
            data={this.state.routes}
            type="line"
            linePaint={LINE_STYLE} />

          <GeoJSONLayer
            id="places"
            data={this.state.places}
            type="circle"
            circlePaint={CIRCLE_STYLE}
            circleOnMouseEnter={this.onMouseEnterPlace.bind(this)}
            circleOnMouseLeave={this.onMouseLeavePlace.bind(this)}
            circleOnClick={this.onSelectPlace.bind(this)} />

          <MapPath
            places={this.state.highlighted.places}
            segments={this.state.highlighted.segments} />
      </Map>
    )
  }

}

render(<App />, document.getElementById('app'));
