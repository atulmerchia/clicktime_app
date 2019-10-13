import React from 'react';
import { ComposableMap, Geographies, Geography, Line, Sphere, ZoomableGroup } from 'react-simple-maps';
import WorldMap from 'assets/worldmap.json';
import Dataset from 'lib/dataset';

const defaultState = { data: [] }

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...defaultState};
  }

  componentDidMount() { Dataset.register(this); }

  render() {
    return (
      <div id="map-wrapper" className="vbox center flex-fill">
        <ComposableMap width={1100} height={470}>
          <ZoomableGroup>
            <Sphere fill="#AADAFF"/>
            <Geographies geography={WorldMap} fill="#B5DE7B" stroke="black" strokeWidth={0.25}>
              {({geographies}) => geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)}
            </Geographies>
            {this.state.data.map((d,i) => !d.end || !d.end.coord
              ? <React.Fragment key={i}/>
              : <Line
                key={i}
                coordinates={[d.start.coord, d.end.coord]}
                stroke="#F53"
                strokeWidth={4}
                strokeLinecap="round"
              />
            )}
            <Sphere stroke="grey" strokeWidth={5}/>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  };
}
