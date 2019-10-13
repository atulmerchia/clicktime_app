import React from 'react';
import {Stopwatch} from '.';

class CurrentTimeSlug extends React.Component {
  componentDidMount() { setTimeout(_ => this.forceUpdate(), 1000 - Date.now() % 1000); }
  componentDidUpdate() { setTimeout(_ => this.forceUpdate(), 1000); }

  render() {
    return (
      <div id="secondary-time">
        {(new Date()).toLocaleTimeString(undefined, {timeZoneName: 'long'})}
      </div>
    )
  }
}

export default class Clock extends React.Component {
  render() {
    return (
      <div id="clock-wrapper" className="vbox center flex-fill">
        <div id="clock-text" className="center">
          <CurrentTimeSlug/>
          <Stopwatch/>
        </div>
      </div>
    )
  }
}
