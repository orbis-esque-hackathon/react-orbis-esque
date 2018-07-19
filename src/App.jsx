import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapboxGl, { Feature, GeoJSONLayer, Layer, Popup } from 'react-mapbox-gl';
import axios from 'axios';

import GraphHelper from './dijkstra/GraphHelper.js'

// const althurayya = require('./althurayya.js');
import '../style/app.scss';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYWJvdXRnZW8iLCJhIjoiY2pqcjgzYXl6M29wbjNxcm05MzZqMDJiYSJ9.nIS2lMRvW3KQto_CTt4PPA"
});

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: [4],
      center: [33, 35],
      places: { type: "FeatureCollection", features: [] },  // Places data from GeoJSON
      routes: [],  // Routes data from GeoJSON
      highlighted: { // Selected route (if any)
        places: [],
        segments: []
      }
    }
  }

  componentDidMount() {
    axios.get('data/fakedata_16_16/places_new_structure.geojson')
      .then(result => {
        this.setState({ places: result.data });
      });

    axios.get('data/fakedata_16_16/routes.json')
      .then(result => {
        const features = result.data.features;
        this._graph = GraphHelper.buildGraph(features);
        this.setState({ routes: features });
      });
  }

  pickSegment(from, to) {
    return this.state.routes.find(segment => {
      const s = segment.properties.sToponym;
      const e = segment.properties.eToponym;
      return (s === from && e === to) || (e === from && s === to);
    });
  }

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
        segments.push(this.pickSegment(path[i - 1], path[i]));
      }

      return segments;
    }
  }

  onMapMove(e) {
    this.setState({
      zoom: [ e.transform._zoom ]
      // center: e.transform._center
    })
  }

  onMouseEnterPlace(e) {
    // Not really nice, but does the job
    const canvas = document.querySelector('.mapboxgl-canvas');
    canvas.style.cursor = 'crosshair';
  }

  onMouseLeavePlace(e) {
    const canvas = document.querySelector('.mapboxgl-canvas');
    canvas.style.cursor = 'inherit';
  }

  onSelectPlace(e) {
    const feature = (e.features.length > 0) ? e.features[0] : null;

    this.setState(previous => {
      if (previous.highlighted.places.length === 1) {
        const start = previous.highlighted.places[0];
        const end = feature;

        // althurayya.findPathConsideringIntermediates(previous.highlighted.places[0], feature)
        const segments = this.calculateRoute(start, end);
        if (segments)
          return { highlighted: { places: [ start, end ], segments: segments } };
        else
          return { highlighted: { places: [ start, end ] } };
      } else
        return { highlighted: { places: [ feature ] } };
    });
  }

  render() {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        center={this.state.center}
        zoom={this.state.zoom}
        onMoveEnd={this.onMapMove.bind(this)}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
          <GeoJSONLayer
            id="places"
            data={this.state.places}
            type="circle"
            circlePaint={{
              "circle-color": "red",
              "circle-opacity": 0.8,
              "circle-radius": 6
            }}
            circleOnMouseEnter={this.onMouseEnterPlace.bind(this)}
            circleOnMouseLeave={this.onMouseLeavePlace.bind(this)}
            circleOnClick={this.onSelectPlace.bind(this)} />

          <Layer
            id="routes"
            type="line"
            paint={{
              "line-color": "#ff0000"
            }}>
            {this.state.routes.map(feature =>
              <Feature
                key={feature.properties.id}
                coordinates={feature.geometry.coordinates} />
            )}
          </Layer>

          {this.state.highlighted.segments &&
            <Layer
              id="selected_path"
              type="line"
              paint={{
                "line-color": "blue",
                "line-width": 4
              }}>
              {this.state.highlighted.segments.map(feature =>
                <Feature
                  key={`selected_${feature.properties.id}`}
                  coordinates={feature.geometry.coordinates} />
              )}
            </Layer>
          }

          <Layer
            id="selected_places"
            type="circle"
            paint={{
              "circle-color": "blue",
              "circle-opacity": 0.9,
              "circle-radius": 6
            }}>
            {this.state.highlighted.places.map(feature =>
              <Feature
                key={`selected_${feature.properties.id}`}
                coordinates={feature.geometry.coordinates} />
            )}
          </Layer>
      </Map>
    )
  }

}

render(<App />, document.getElementById('app'));
