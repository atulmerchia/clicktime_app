import React from 'react';
import Dataset from 'lib/dataset';
import Helpers from 'lib/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faMinus, faPlus, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';

export default class Utilities extends React.Component {
  render() {
    let offset = Helpers.UTCOffset;
    if(offset < 0) offset = "GMT-" + Math.abs(offset).toString().padStart(2,0);
    else if(offset > 0) offset = "GMT+" + Math.abs(offset).toString().padStart(2,0);
    else offset = "\u00A0UTC\u00A0\u00A0";

    return (
      <div id="utility-bar" className="hbox split" style={{margin: "3% 0"}}>
        <span className="flex-fill center hbox">
          <div className="shadowed btn btn-bl" onClick={Dataset.export}>
            Export to CSV <FontAwesomeIcon icon={faDownload}/>
          </div>
          <label htmlFor="import" className="shadowed btn btn-tl">
            Import from CSV <FontAwesomeIcon icon={faUpload}/>
            <input type="file" id="import" style={{display: 'none'}} accept="text/csv" onChange={Dataset.import}/>
          </label>
        </span>
        <span id="timezone" className="center hbox">
          <FontAwesomeIcon icon={faMinus} onClick={_ => { Dataset.incrementOffset(-1); this.forceUpdate(); }}/>
          <div>Timezone: {offset}</div>
          <FontAwesomeIcon icon={faPlus} onClick={_ => { Dataset.incrementOffset(1); this.forceUpdate(); }}/>
        </span>
        <span className="flex-fill center hbox" style={{justifyContent: 'flex-end'}}>
          <div className="shadowed btn btn-og" onClick={_ => { Dataset.toggleUnitSystem(); this.forceUpdate(); }}>
            Units: {Helpers.distLabel()}
          </div>
          <div className="shadowed btn btn-rd" onClick={Dataset.clear}>
            Clear Data <FontAwesomeIcon icon={faTrash}/>
          </div>
        </span>
      </div>
    )
  }
}
