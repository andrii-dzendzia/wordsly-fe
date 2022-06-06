import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { languagesReducer } from './language';
import { subjectsReducer } from './subject';
import { userReducer } from './user';

const reducer = combineReducers({
  user: userReducer,
  subjects: subjectsReducer,
  languages: languagesReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(thunk),
);

export default store;
