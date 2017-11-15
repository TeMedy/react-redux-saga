import * as Actions from './actions'

const initialState = {
  selectedFiles: [],
  filesToUpload: [],
  compressing: false,
  uploadStarted: false,
  uploadDone: false,
  uploadSuccessful: false,
  uploadError: false,
  uploadProgress: undefined,
  linkToSrc: undefined,
}

export const fileState = (state = initialState, action) => {
  switch (action.type){
    case Actions.SELECT_FILE:
      return {
        ...state,
        selectedFiles: action.files,
        uploadStarted: false,
        uploadSuccessful: false,
        uploadError: false
      };
    case Actions.START_COMPRESSION:
      return {
        ...state,
        compressing: true
      }
    case Actions.END_COMPRESSION:
      return {
        ...state,
        compressing: false
      }
    case Actions.START_UPLOAD:
      return {
        ...state,
        filesToUpload: action.files,
        uploadStarted: true,
        uploadSuccessful: false,
        uploadError: false,
        uploadProgress: 0,
      }
    case Actions.UPDATE_UPLOAD_PROGRESS:
    console.log('progress in reducer: ' + action.progress);
      return {
        ...state,
        uploadProgress: action.progress,
      }
    case Actions.END_UPLOAD:
      return {
        ...state,
        filesToUpload: [],
        uploadStarted: false,
        uploadSuccessful: action.wasSuccessful,
        uploadError: !action.wasSuccessful,
        uploadProgress: undefined,
        linkToSrc: action.wasSuccessful? action.linkToSrc: '',
      }
    default:
      return state;
  }
}
