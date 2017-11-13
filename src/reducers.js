import { SELECT_FILE, START_UPLOAD} from './actions'
import { UPDATE_UPLOAD_PROGRESS } from './actions'
import { UPLOAD_FINISH } from './actions'

const initialState = {
  filesToUpload: [],
  uploadStarted: false,
  uploadDone: false,
  uploadSuccessful: false,
  uploadError: false,
  uploadProgress: undefined,
  linkToSrc: undefined,
}

export const fileState = (state = initialState, action) => {
  switch (action.type){
    case SELECT_FILE:
      return {
        ...state,
        filesToUpload: action.files,
        uploadStarted: false,
        uploadSuccessful: false,
        uploadError: false
      };
    case START_UPLOAD:
      return {
        ...state,
        uploadStarted: true,
        uploadSuccessful: false,
        uploadError: false,
        uploadProgress: 0,
      }
    case UPDATE_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: action.progress,
      }
    case UPLOAD_FINISH:
      return {
        ...state,
        filesToUpload: [],
        uploadStarted: false,
        uploadSuccessful: action.wasSuccessful,
        uploadError: !action.wasSuccessful,
        uploadProgress: undefined,
        linkToSrc: action.linkToSrc,
      }
    default:
      return state;
  }
}
