export const ADD_RECIPE = 'ADD_RECIPE';
export const REMOVE_FROM_CALENDAR = 'REMOVE_FROM_CALENDAR';

// Action: add recipe
export function addRecipe({day, recipe, meal}) {
  return {
    type: ADD_RECIPE,
    recipe,
    day,
    meal
  };
}

// Action: remove meal from calendar
export function removeFromCalendar({day, meal}) {
  return {
    type: REMOVE_FROM_CALENDAR,
    day,
    meal
  };
}
