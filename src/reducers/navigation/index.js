import { combineReducers } from 'redux-immutable';

import main from './main';
import _public from './public';

export default combineReducers({
  main,
  public: _public,
});
