'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Router, Route, hashHistory, IndexRedirect, IndexRoute } from 'react-router';
import axios from 'axios';


ReactDOM.render(
  <Provider store={store}>
    <div>HI..</div>
  </Provider>,
  document.getElementById('main')
);

