import React, { Component } from 'react';
import { Feature, Layer, Popup } from 'react-mapbox-gl';

/**
 * A MapPath is a visual feature made up of a start and end location and
 * a list of line segments in between.
 */
export default class MapboxPath extends Component {

  constructor(props) {
    super(props);
    this.state = { selected: null };
    this.setPopupState(props);
  }

  setPopupState(props) {
    if (props.places.length > 0) {
      this.setState({
        selected: props.places[props.places.length - 1]
      });
    }
  }

  getName(feature) {
    const payload = JSON.parse(feature.properties.althurayyaData)
    return payload.names.eng.translit;
  }

  componentWillReceiveProps(nextProps) {
    this.setPopupState(nextProps);
  }

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

        {this.state.selected &&
          <Popup
            className="popup"
            coordinates={this.state.selected.geometry.coordinates}>
            <h1>{this.getName(this.state.selected)}</h1>
          </Popup>
        }
      </React.Fragment>
    )
  }

}
