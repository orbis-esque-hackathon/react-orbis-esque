import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import axios from 'axios';

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
      places: EMPTY_GEOM,
      routes: EMPTY_GEOM
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
  }

  render() {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
          <GeoJSONLayer
            data={this.state.places}
            type
            circlePaint={{
              "circle-color": "#ff0000",
              "circle-opacity": 0.2,
              "circle-radius": 5
            }}/>
          <GeoJSONLayer
            data={this.state.routes}
            type
            linePaint={{
              "line-color": "#ff0000"
            }}/>
      </Map>
    )
  }

}

render(<App />, document.getElementById('app'));
