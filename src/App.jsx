import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapboxGl, { Feature, GeoJSONLayer, Layer, Popup } from "react-mapbox-gl";
import axios from 'axios';

import '../style/app.scss';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYWJvdXRnZW8iLCJhIjoiY2pqcjgzYXl6M29wbjNxcm05MzZqMDJiYSJ9.nIS2lMRvW3KQto_CTt4PPA"
});

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      places: { type: "FeatureCollection", features: [] },  // Places data from GeoJSON
      routes: [],  // Routes data from GeoJSON
      highlighted: { // Selected route (if any)
        places: [],
        segments: []
      }
    }
  }

  componentDidMount() {
    axios.get('data/places_new_structure.json')
      .then(result => {
        this.setState({ places: result.data });
      });

    axios.get('data/routes.json')
      .then(result => {
        this.setState({ routes: result.data.features });
      });
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
      if (previous.highlighted.places.length === 1)
        return { highlighted: { places: [ previous.highlighted.places[0], feature ] } };
      else
        return { highlighted: { places: [ feature ] } };
    });
  }

  render() {
    return (
      <Map
        ref={c => this._map = c}
        style="mapbox://styles/mapbox/streets-v9"
        center={[ 33, 35 ]}
        zoom={[4]}
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

          {this.state.highlighted.routes &&
            <Layer
              id="selected_path"
              type="line"
              paint={{ "line-color": "blue" }}>
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
