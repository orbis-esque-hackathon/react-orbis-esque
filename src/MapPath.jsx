import React, { Component } from 'react';
import { Feature, Layer } from 'react-mapbox-gl';

/**
 * A MapPath is a visual feature made up of a start and end location and
 * a list of line segments in between.
 */
export default class MapPath extends Component {

  render() {
    return (
      <React.Fragment>
        {this.props.segments &&
          <Layer
            id="selected_path"
            type="line"
            paint={{
              "line-color": "#2ca02c",
              "line-width": 6
            }}>
            {this.props.segments.map(feature =>
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
            "circle-color": "#2ca02c",
            "circle-opacity": 0.9,
            "circle-radius": 8
          }}>
          {this.props.places.map(feature =>
            <Feature
              key={`selected_${feature.properties.id}`}
              coordinates={feature.geometry.coordinates} />
          )}
        </Layer>
      </React.Fragment>
    )
  }

}
