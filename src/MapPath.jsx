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
              "line-color": "#d62728",
              "line-width": 7
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
            "circle-color": "#d62728",
            "circle-opacity": 1,
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
