/*
  React for dealing with JSX
 */

import React from 'react';

/*
  Creates redux dev tools from passed components
 */

import { createDevTools } from 'redux-devtools';

/*
  Component that contains the log of actions and what's in the redux store
 */

import LogMonitor from 'redux-devtools-log-monitor';

/*
  Component that contains the log in a dock that you can toggle and move
 */
import DockMonitor from 'redux-devtools-dock-monitor';

module.exports = createDevTools(
  <DockMonitor
    toggleVisibilityKey='shift-ctrl-x'
    changePositionKey='shift-ctrl-z'
    defaultIsVisible={ false }
    >
    <LogMonitor />
  </DockMonitor>
);
