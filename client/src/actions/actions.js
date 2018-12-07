export const GET_LOCATION = 'GET_LOCATION';
export const GET_FLOOD_ALERT_AREAS_ITEMS = 'GET_FLOOD_ALERT_AREAS_ITEMS';
export const GET_FLOOD_ALERT_AREAS = 'GET_FLOOD_ALERT_AREAS';
export const GET_CURRENT_ALERT_AREAS_ITEMS = 'GET_CURRENT_ALERT_AREAS_ITEMS';
export const GET_CURRENT_ALERT_AREAS = 'GET_CURRENT_ALERT_AREAS';

export function getLocation(location) {
   return {
      type: GET_LOCATION,
      payload: location
   };
}

export function getFloodAlertAreasItems(floodAlertAreasItems) {
   return {
      type: GET_FLOOD_ALERT_AREAS_ITEMS,
      payload: floodAlertAreasItems
   };
}

export function getFloodAlertAreas(floodAlertAreas) {
   return {
      type: GET_FLOOD_ALERT_AREAS,
      payload: floodAlertAreas
   };
}

export function getCurrentAlertAreasItems(currentAlertAreasItems) {
   return {
      type: GET_CURRENT_ALERT_AREAS_ITEMS,
      payload: currentAlertAreasItems
   };
}

export function getCurrentAlertAreas(currentAlertAreas) {
   return {
      type: GET_CURRENT_ALERT_AREAS,
      payload: currentAlertAreas
   };
}
