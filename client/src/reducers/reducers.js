import {combineReducers} from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import * as actions from '../actions/actions'

const initialState = {
  location: [51.2802, 1.0789],
  floodAlertAreasItems: [],
  floodAlertAreas: [],
  currentAlertAreasItems: [],
  currentAlertAreas: []
}

const getMapInputReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_LOCATION:
      return {...state, location: action.payload.location}
    case actions.GET_AREAS_DATA:
      return {
        ...state,
        floodAlertAreasItems: action.floodAlertAreasItems,
        floodAlertAreas: action.floodAlertAreas,
        currentAlertAreasItems: action.currentAlertAreasItems,
        currentAlertAreas: action.currentAlertAreas,
      }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
   form: reduxFormReducer,
   getMapInputReducer
})

export default rootReducer;
