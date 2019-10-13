import React from 'react';
import Dataset from 'lib/dataset';
import Helpers from 'lib/helpers';
import { ContextMenu, Modal } from '.';

const pad = (n, length = 2) => Math.floor(n).toString().padStart(length, 0);

const format = date => {
  date = new Date(date);
  return <>{pad(date.getUTCDate())} {MONTHS[date.getUTCMonth()]} <br/> {pad(date.getUTCHours())}:{pad(date.getUTCMinutes())}:{pad(date.getUTCSeconds())}</>
}

const defaultState = { data: [] };

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...defaultState};
  }

  componentDidMount() { Dataset.register(this);}

  render() {
    if (!this.state.data.length)
      return (
        <div id="no-data" className="center vbox flex-fill">
          No Data :(<br/>
          FEEED MEEE
        </div>
      )

    return (
      <table id="data-table">
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Time<br/>Elapsed</th>
            <th>Start<br/>Longitude</th>
            <th>Start<br/>Latitude</th>
            <th>End<br/>Longitude</th>
            <th>End<br/>Latitude</th>
            <th>Distance<br/>({Helpers.distLabel()})</th>
            <th>Avg. Speed<br/>({Helpers.speedLabel()})</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((datum, i) => (
            <tr key={i} onContextMenu={e => ContextMenu.show(e, [
              ["Remove data point", _ => Dataset.remove(i)],
              ["Edit data point", _ => datum.end && Modal.show(datum, i)],
            ])}>
              <td>{Helpers.formatDate(datum.start)}</td>
              <td>{Helpers.formatDate(datum.end || {})}</td>
              <td>{Helpers.formatTime(datum.elapsed)}</td>
              <td>{Helpers.formatCoord(datum.start, 0)}</td>
              <td>{Helpers.formatCoord(datum.start, 1)}</td>
              <td>{Helpers.formatCoord(datum.end || {}, 0)}</td>
              <td>{Helpers.formatCoord(datum.end || {}, 1)}</td>
              <td>{datum.dist === undefined ? "" : Math.floor(datum.dist).toString().padStart(5, '\u00A0')}</td>
              <td>{datum.speed === undefined || isNaN(datum.speed) ? "" : datum.speed.toFixed(2).toString().padStart(6, '\u00A0')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
