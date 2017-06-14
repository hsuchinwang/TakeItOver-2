'use strict'

import { applyMiddleware, combineReducers, createStore } from 'redux';
import rootReducer from '../reducers';
import devTools from 'remote-redux-devtools';

export default function configureStore(initialState) {
  const createStoreWithMiddleware = applyMiddleware()(createStore);
  // const store = createStoreWithMiddleware(rootReducer, initialState, devTools({
  //   name: 'Platform.OS',
  //   hostname: 'http://remotedev.io/local/',
  // }));
  const store = createStoreWithMiddleware(rootReducer, initialState);
  return store;
}

