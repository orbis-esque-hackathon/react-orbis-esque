import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import axios from 'axios';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYWJvdXRnZW8iLCJhIjoiY2pqcjgzYXl6M29wbjNxcm05MzZqMDJiYSJ9.nIS2lMRvW3KQto_CTt4PPA"
});

const geojson ={
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -8.0859375,
              50.064191736659104
            ],
            [
              2.4609375,
              46.800059446787316
            ],
            [
              2.4609375,
              54.77534585936447
            ],
            [
              -2.4609375,
              54.77534585936447
            ],
            [
              -10.546875,
              54.16243396806779
            ],
            [
              -8.0859375,
              50.064191736659104
            ]
          ]
        ]
      }
    }
  ]
};

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { places: { "type": "FeatureCollection", "features": [] } }
  }

  componentDidMount() {
    axios.get('data/places_new_structure.json')
      .then(result => {
        console.log('foo');
        this.setState({ places: result.data });
      })
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
      </Map>
    )
  }

}

render(<App />, document.getElementById('app'));
