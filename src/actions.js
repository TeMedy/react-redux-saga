
export const SELECT_FILE = 'SELECT_FILE';

export const selectFile = (files) => {
  return {
    type: SELECT_FILE,
    files
  }
}

export const START_COMPRESSION = 'START_COMPRESSION'
export const startCopmression = () => ({
  type: START_COMPRESSION
})

export const END_COMPRESSION = 'END_COMPRESSION'
export const endCopmression = () => ({
  type: END_COMPRESSION
})

export const START_UPLOAD = 'START_UPLOAD';
export const startUpload = (files) => ({
  type: START_UPLOAD,
  files
});

export const UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';
export const updateUploadProgress = (progress) => ({
  type: UPDATE_UPLOAD_PROGRESS,
  progress
});

export const END_UPLOAD = 'END_UPLOAD';
export const endUpload = (wasSuccessful, linkToSrc) => ({
  type: END_UPLOAD,
  wasSuccessful,
  linkToSrc,
});
