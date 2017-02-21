/*
  Utility for establishing whether the file is currently being executed in a node
  or browser environment
 */

import ExecutionEnvironment from 'exenv';

/*
  Set the value of the special global webpack uses to set output paths at runtime.
  If running in the browser, get it off the window (as it's put there by the pug
  template when the node server rendered the initial response).

  If running in a node environment, get the value from the environment variable
   ASSETS_PATh
 */

__webpack_public_path__ =  ExecutionEnvironment.canUseDOM ? window.__assets_path : process.env.ASSETS_PATH;
