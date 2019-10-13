import React from 'react';

const defaultState = { open: false, options: [["Err: no options defined", null]] };
class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...defaultState};
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(e, options) {
    e.preventDefault();
    this.setState({
      open: true,
      pos: {top: e.pageY, left: e.pageX},
      options
    });
    document.addEventListener('click', this.hide);
  }

  hide() {
    this.setState({open: false});
    document.removeEventListener('click', this.hide);
  }

  render() {
    if(!this.state.open) return <></>
    return (
      <div id="context-menu" style={{...this.state.pos}} className="shadowed">
        {this.state.options.map(opt => (
          <div key={opt[0]} onClick={opt[1]}>{opt[0]}</div>
        ))}
      </div>
    )
  }
}

ContextMenu.register = ref => { ContextMenu.show = ref.show; }
export default ContextMenu;
