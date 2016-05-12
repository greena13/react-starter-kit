'use strict';

import React from 'react';
import { Route } from 'react-router';

import ApplicationContainer from '../containers/ApplicationContainer';
import Homepage from '../components/Homepage';

const ApplicationRoutes = (
  <Route component={ApplicationContainer}>
    <Route path='/' component={Homepage} />
  </Route>
);

export default ApplicationRoutes;
