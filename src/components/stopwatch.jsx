import React from 'react';
import Dataset from 'lib/dataset';

const formatForClock = n => n.toString().padStart(2, "0");
const zeroTime = { ss: 0, mm: 0, hh: 0, dd: 0 };
const defaultState = { ...zeroTime, running: Dataset.running };

export default class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...defaultState};
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.enqueueClockTick = this.enqueueClockTick.bind(this);
  }

  componentDidMount() {
    if(Dataset.running) {
      let t = (Date.now() - Dataset.data[Dataset.data.length - 1].start.time)/1000;
      this.start({
        ss: Math.floor(t) % 60,
        mm: Math.floor(t / 60) % 60,
        hh: Math.floor(t / 3600) % 24,
        dd: Math.floor(t / 86400)
      }, false)
    }
  }

  start(time, push = true) {
    if(push) Dataset.pushStart();
    let runToken = Date.now();
    this.setState({...time, running: runToken});
    this.enqueueClockTick(runToken);
  }

  stop() {
    Dataset.pushEnd();
    this.setState({running: false});
  }

  enqueueClockTick(runToken) {
    setTimeout(_ => {
      if(runToken == this.state.running) {
        this.enqueueClockTick(runToken);
        let {ss, mm, hh, dd} = this.state;
        ss++;
        if(ss == 60) { ss = 0; mm++; }
        if(mm == 60) { mm = 0; hh++; }
        if(hh == 24) { hh = 0; dd++; }
        this.setState({ ss, mm, hh, dd });
      }
    }, 1000);
  }

  render() {
    return (
      <>
        <div id="clock" className="vbox center flex-fill">
          <div id="main-time">
            {[this.state.dd, this.state.hh, this.state. mm, this.state.ss].map(formatForClock).join(':')}
          </div>
        </div>
        <br/>
        {this.state.running
          ? <div className="shadowed btn btn-rd" onClick={this.stop}>Stop</div>
          : <div className="shadowed btn btn-gn" onClick={_ => this.start(zeroTime)}>Start</div>
        }
      </>
    )
  }
}
