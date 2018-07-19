import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapboxGl, { GeoJSONLayer, Popup } from "react-mapbox-gl";
import axios from 'axios';

import '../style/app.scss';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYWJvdXRnZW8iLCJhIjoiY2pqcjgzYXl6M29wbjNxcm05MzZqMDJiYSJ9.nIS2lMRvW3KQto_CTt4PPA"
});

const EMPTY_GEOM = {
  "type": "FeatureCollection",
  "features": []
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      places: EMPTY_GEOM, // Places data from GeoJSON
      routes: EMPTY_GEOM, // Routes data from GeoJSON
      selected: null,     // Mostly for testing: a feature selected via mouse
      highlighted: null   // { routes: [], places: [] } to highlight (e.g. after a route calculation)
    }
  }

  componentDidMount() {
    axios.get('data/places_new_structure.json')
      .then(result => {
        this.setState({ places: result.data });
      });

    axios.get('data/routes.json')
      .then(result => {
        this.setState({ routes: result.data });
      });

    // TODO don't display all as one GeoJSON, but split up features
    // individually, so we can highlight them through state.

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
          <GeoJSONLayer
            data={this.state.places}
            type
            circlePaint={{
              "circle-color": "#ff0000",
              "circle-opacity": 0.9,
              "circle-radius": 6
            }}
            circleOnClick={this.onSelectPlace.bind(this)} />

          <GeoJSONLayer
            data={this.state.routes}
            type
            linePaint={{
              "line-color": "#ff0000"
            }}/>

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
