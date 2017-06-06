
/* import message from '../middlewares/message';
import refresh from '../middlewares/refresh';
import ga from '../middlewares/ga';
import taskChain from '../middlewares/taskChain';
import rootReducer from '../reducers/index';
*/
import { Platform } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
//import * as Config from '../constants/Config';
//import devTools from 'remote-redux-devtools';
export default function configureStore(initialState) {
  const createStoreWithMiddleware = applyMiddleware()(createStore);
  // const store = createStoreWithMiddleware(rootReducer, initialState, devTools({
  //   name: Platform.OS,
  //   hostname: 'http://remotedev.io/local/',
  // }));
  const store = createStoreWithMiddleware(rootReducer, initialState);
  return store;
}

