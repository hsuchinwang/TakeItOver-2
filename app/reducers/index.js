import { combineReducers } from 'redux';

// Navigation
import { tabBarReducer } from './tabBarReducer';
import { tabOneReducer } from './tabOneReducer';
import { tabTwoReducer } from './tabTwoReducer';
import { tabThreeReducer } from './tabThreeReducer';
import { tabFourReducer } from './tabFourReducer';

const rootReducer = combineReducers({
    tabBar: tabBarReducer,
    tabOne: tabOneReducer,
    tabTwo: tabTwoReducer,
    tabThree: tabThreeReducer,
    tabFour: tabFourReducer,
});

export default rootReducer;