import { combineReducers } from 'redux';

// Navigation
import { tabBarReducer } from './tabBarReducer';
import { tabOneReducer } from './tabOneReducer';
import { tabTwoReducer } from './tabTwoReducer';
import { tabThreeReducer } from './tabThreeReducer';
import { tabFourReducer } from './tabFourReducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    tabBar: tabBarReducer,
    tabOne: tabOneReducer,
    tabTwo: tabTwoReducer,
    tabThree: tabThreeReducer,
    tabFour: tabFourReducer,
    form: formReducer
});

export default rootReducer;