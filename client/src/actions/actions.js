export const GET_LOCATION = 'GET_LOCATION';
export const GET_AREAS_DATA = 'GET_AREAS_DATA';

export function getLocation(location) {
   return {
      type: GET_LOCATION,
      payload: location
   };
}

export function getAreasData(areasData) {
   return {
      type: GET_AREAS_DATA,
      floodAlertAreasItems: areasData.floodAlertAreasItems,
      floodAlertAreas: areasData.floodAlertAreas,
      currentAlertAreasItems: areasData.currentAlertAreasItems,
      currentAlertAreas: areasData.currentAlertAreas
   };
}
