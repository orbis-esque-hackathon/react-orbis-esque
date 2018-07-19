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
      places: [],  // Places data from GeoJSON
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
        this.setState({ places: result.data.features });
      });

    axios.get('data/routes.json')
      .then(result => {
        this.setState({ routes: result.data.features });
      });
  }

  onClick(e) {
    console.log(e);
  }

  onSelectPlace(e) {
    const feature = (e.features.length > 0) ? e.features[0] : null;

    this.setState(previous => {
      if (previous.highlighted.places.length === 0) {
        return { highlighted: { places: [ feature ] } };
      } else {
        return { highlighted: { places: [ previous.highlighted.places[0], feature ] } };
      }
    });
  }

  render() {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        center={[ 33, 35 ]}
        zoom={[4]}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
        onClick={this.onClick.bind(this)}>
          <Layer
            id="places"
            key="places"
            type="circle"
            paint={{
              "circle-color": "red",
              "circle-opacity": 0.9,
              "circle-radius": 10
            }}>
            {this.state.places.map(feature =>
              <Feature
                key={feature.properties.id}
                coordinates={feature.geometry.coordinates}
                onClick={this.onSelectPlace.bind(this)} />
            )}
          </Layer>

          <Layer
            id="routes"
            key="routes"
            type="line"
            paint={{
              "line-color": "#ff0000"
            }}
          >
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
              paint={{ "line-color": "green" }}>
              {this.state.highlighted.segments.map(feature =>
                <Feature
                  key={feature.properties.id}
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
              <Feature coordinates={feature.geometry.coordinates} />
            )}
          </Layer>
      </Map>
    )
  }

}

render(<App />, document.getElementById('app'));
