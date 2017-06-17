import { createStore, applyMiddleware } from 'redux';
import thunx from 'redux-thunk'
import rootReducer from './reducer';

export default createStore(rootReducer, applyMiddleware(thunx));
