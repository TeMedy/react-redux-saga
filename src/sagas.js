import { take, put, fork, call } from 'redux-saga/effects';
import { buffers, eventChannel, END } from 'redux-saga';

import * as Actions from './actions'

import CanvasCompress from 'canvas-compress';

import { store } from './index'

const compressImages = (files) => {
  const compressor = new CanvasCompress({
      type: CanvasCompress.MIME.JPEG,
      width: 1000,
      height: 1000,
      quality: 1,
  });
  return files.map(
    file => compressor.process(file).then(({ source, result }) => {
      // const { blob, width, height } = source;
      //const { blob, width, height } = result;
      const { blob } = result;
      return blob;
  }));
}

function uploadFiles(emitter, filesToUpload){
  console.log(filesToUpload.length + ' files selected to upload');
  var formData = new FormData();
  filesToUpload.forEach(
    (file, index) => {formData.append('file[' + index + ']', file)}
  )

  var xhr = new XMLHttpRequest();
  // progress callback is called frequently by the xhr handler during the upload
  xhr.upload.onprogress = function (event){
    if (event.lengthComputable){
      var percent = Math.round(100 * event.loaded / event.total);
      console.log('progress: ' + percent);
      emitter(Actions.updateUploadProgress(percent));
    }
  };
  // when uplaod is finished successfully
  xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE){
        if( xhr.status >= 200 && xhr.status < 300) {
          console.log('upload status: successful')
          emitter(Actions.endUpload(true, xhr.responseText));
          emitter(END);
        } else {
        //there was an error: handle error
        console.log('upload status: error');
          emitter(Actions.endUpload(false, xhr.responseText));
          emitter(END);
        }
      }
    }

  // callback to handle errors
  xhr.upload.onerror = event => {
    console.log('an error happened.')
    //TODO: handle error.
    emitter(END);
  };
  // open the xhr and disable the browser caching
  xhr.open('POST', '/upload');
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.send(formData);
  console.log('formData sent.')
  return () => {
    xhr.upload.onprogress = null;
    xhr.upload.onerror = null;
    xhr.upload.onabort = null;
    xhr.onreadystatechange = null;
    xhr.abort();
  }
}

function* compressImagesSaga(files) {
  console.log('compressing images in sagas');
  yield put(Actions.startCopmression());
  const compressedImages = yield compressImages(files);
  yield put(Actions.endCopmression());
  //console.log('insilde compressImages()')
  //console.log(compressedImages);
  yield put(Actions.startUpload(compressedImages));
}

export function createUploadFilesChannel(files){
  return eventChannel( emitter => {
    uploadFiles(emitter, files);
  })
};

export function* uploadFilesSaga(files){
  const channel = yield call(createUploadFilesChannel, files);
  while (true){
    const { progress = 0, err, success } = yield take(channel);
    console.log('progress in uploadFilesSaga: ' + progress);

    yield put(Actions.updateUploadProgress(progress));
  }
}
/*
 Basically Follow this tutorial:
 https://decembersoft.com/posts/file-upload-progress-with-redux-saga/
*/

export function* watchForUploadActions() {
  while(true){
    console.log('inside while loop 3')
    const { files } = yield take(Actions.START_UPLOAD);
    yield call(uploadFilesSaga, files);
    console.log('inside while loop 4')
  }
}

export function* watchForCompressionActions() {
  while(true){
    console.log('inside while loop 1')
    const { files } = yield take(Actions.SELECT_FILE);
    yield call(compressImagesSaga, files);
    console.log('inside while loop 2')
  }
}

export function* rootSaga(){
  yield [
    fork(watchForCompressionActions),
    fork(watchForUploadActions)
  ];
}
