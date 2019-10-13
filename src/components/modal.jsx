import React from 'react';
import Helpers from 'lib/helpers';
import Dataset from 'lib/dataset';

const inRange = (n, min, max) => min <= n && n < max;

const invalid = (val, parse) => {
  if(!val) return false;
  let n = Number(val), p = parse(val);
  return isNaN(n) || isNaN(p) || n !== p;
}

const inputs = [
  [x => new Date(x.time).getUTCMonth()+1, "Month"     , "MM", parseInt,   x => inRange(x, 1, 13)],
  [x => new Date(x.time).getUTCDate()   , "Date"      , "DD", parseInt,   (x,m) => inRange(x, 1, m)],
  [x => new Date(x.time).getUTCHours()  , "Hour"      , "hh", parseInt,   x => inRange(x, 0, 24)],
  [x => new Date(x.time).getUTCMinutes(), "Minute"    , "mm", parseInt,   x => inRange(x, 0, 60)],
  [x => new Date(x.time).getUTCSeconds(), "Second"    , "ss", parseInt,   x => inRange(x, 0, 60)],
  [x => { try { return x.coord[0] } catch(e) { return ""; }}                      , "Longitude" , "LG", parseFloat, x => inRange(x, -180, 180)],
  [x => { try { return x.coord[1] } catch(e) { return ""; }}                      , "Latitude"  , "LT", parseFloat, x => inRange(x, -90, 90)]
]

const outputs = [
  ["MM", (x, field) => x.setUTCMonth(field - 1)],
  ["DD", (x, field) => x.setUTCDate(field)],
  ["hh", (x, field) => x.setUTCHours(field)],
  ["mm", (x, field) => x.setUTCMinutes(field)],
  ["ss", (x, field) => x.setUTCSeconds(field)],
]

const defaultState = { open: false };
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...defaultState};
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(data, index) {
    let unpacked = {};
    inputs.forEach(([access,name,short]) => {
      unpacked[`start${short}`] = access(data.start);
      unpacked[`end${short}`] = access(data.end);
    });
    this.setState({open: true, ...unpacked, data, index})
  }

  hide(update) {
    if(!update) return this.setState({open: false});
    let { data, startLG, startLT, endLG, endLT } = this.state;
    let startDate = new Date(data.start.time);
    let endDate = new Date(data.end.time);
    outputs.forEach(out => {
      out[1](startDate, this.state["start" + out[0]]);
      out[1](endDate, this.state["end" + out[0]]);
    })
    data.start = { time: startDate.valueOf(), coord: [startLG, startLT] };
    data.end = { time: endDate.valueOf(), coord: [endLG, endLT] };
    Dataset.update(this.state.index, data);
    this.setState({open: false});
  }

  render() {
    if(!this.state.open) return <></>

    const maxStartDate = Helpers.getMaxDate(this.state.startMM) + 1;
    const maxEndDate = Helpers.getMaxDate(this.state.endMM) + 1;
    let err = false;

    return (
      <div id="modal-cover" className="vbox center" onClick={_ => this.hide(false)}>
        <div id="modal-content" className="vbox" onClick={e => e.stopPropagation()}>
          <table>
            <thead>
              <tr>
                <th/>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {inputs.map(([access, name, short, parse, test], i) => {
                const startName = `start${short}`, endName = `end${short}`
                const startValid = this.state[startName] && test(this.state[startName], maxStartDate);
                const endValid = this.state[endName] && test(this.state[endName], maxEndDate)
                err = err || !startValid || !endValid;

                return (
                  <tr key={i}>
                    <td>{name}</td>
                    <td>
                      <input
                        value={this.state[startName]}
                        onChange={e => !invalid(e.target.value, parse) && this.setState({[startName]: parse(e.target.value) || ""})}
                        className={`valid-${startValid}`}
                      />
                    </td>
                    <td>
                      <input
                        value={this.state[endName]}
                        onChange={e => !invalid(e.target.value, parse) && this.setState({[endName]: parse(e.target.value) || ""})}
                        className={`valid-${endValid}`}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div id="save" className={`shadowed btn btn-${err ? "gr" : "tl"}`} onClick={_ => err || this.hide(true)}>Save</div>
        </div>
      </div>
    )
  }
}

Modal.register = ref => { Modal.show = ref.show; }
export default Modal;
