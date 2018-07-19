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
      places: [],       // Places data from GeoJSON
      routes: [],       // Routes data from GeoJSON
      selected: null,   // Mostly for testing: a feature selected via mouse
      highlighted: null // { routes: [], places: [] } to highlight (e.g. after a route calculation)
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

    // TODO highlight some routes randomly, for testing...
  }

  onSelectPlace(e) {
    const feature = (e.features.length > 0) ? e.features[0] : null;

    this.setState({
      selected: {
        coordinates: [ e.lngLat.lng, e.lngLat.lat ]
        // TODO meaningful popup from feature info
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
        }}>
          <Layer
            id="places"
            type="circle"
            paint={{
              "circle-color": "#ff0000",
              "circle-opacity": 0.9,
              "circle-radius": 6
            }}
          >
            {this.state.places.map(feature =>
              <Feature
                key={feature.properties.id}
                coordinates={feature.geometry.coordinates}
                onClick={this.onSelectPlace.bind(this)} />
            )}
          </Layer>

          <Layer
            id="routes"
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

          {this.state.selected &&
            <Popup
              coordinates={this.state.selected.coordinates}>
              <div>You are here</div>
            </Popup>
          }
      </Map>
    )
  }

}

render(<App />, document.getElementById('app'));
