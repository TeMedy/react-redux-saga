import { SELECT_FILE } from './actions'

const initialState = {
  fileSelect: false,
  fileUploadStart: false
}


export const fileSelect = (state= initialState, action) =>{
  switch (action.type){
    case SELECT_FILE:
      return {...state, fileSelect: true};
    default:
      return state;
  }
}
