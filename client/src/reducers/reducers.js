import {combineReducers} from 'redux'
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
    case actions.GET_FLOOD_ALERT_AREAS_ITEMS:
      return { ...state, floodAlertAreasItems: [...state.floodAlertAreasItems, action.payload] };
    case actions.GET_FLOOD_ALERT_AREAS:
      return { ...state, floodAlertAreas: [...state.floodAlertAreas, action.payload] };
    case actions.GET_CURRENT_ALERT_AREAS_ITEMS:
      return { ...state, currentAlertAreasItems: [...state.rules, action.payload] };
    case actions.GET_CURRENT_ALERT_AREAS:
      return { ...state, currentAlertAreas: [...state.rules, action.payload] };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
   getMapInputReducer
})

export default rootReducer;
