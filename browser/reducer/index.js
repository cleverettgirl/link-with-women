const initialState = {
  allPuppies: []
}

export default function(state=initialState, action){

  var newState = Object.assign({}, state);

  switch(action.type){

    case "RECEIVE_PUPPIES":
      newState.allPuppies = action.allPuppies;
      break;

    default:
    return state;

  }

  return newState

}
