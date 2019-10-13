import React from "react";
import { hot } from "react-hot-loader";
import { Clock, ContextMenu, Map, Modal, Table, Utilities } from '.';

import style from "css/main.scss";

const App = () => (
  <>
    <ContextMenu ref={r => ContextMenu.register(r)}/>
    <Modal ref={r => Modal.register(r)}/>
    <div className="vbox flex-fill">
      <div className="vbox">
        <Map/>
        <Clock/>
      </div>
      <Utilities/>
      <Table/>
    </div>
  </>
);

export default hot(module)(App);
