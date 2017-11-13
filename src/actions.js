
export const SELECT_FILE = 'SELECT_FILE';

export const selectFile = (files) => {
  return {
    type: SELECT_FILE,
    files
  }
}

export const START_UPLOAD = 'START_UPLOAD';

export const startUpload = () => {
  return {
    type: START_UPLOAD
  }
}

export const UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';

export const updateUploadProgress = (progress) => {
  return {
    type: UPDATE_UPLOAD_PROGRESS,
    progress
  }
}

export const UPLOAD_FINISH = 'UPLOAD_FINISH';

export const uploadFinish = (wasSuccessful, linkToSrc) => {
  return {
    type: UPLOAD_FINISH,
    wasSuccessful,
    linkToSrc,
  }
}
