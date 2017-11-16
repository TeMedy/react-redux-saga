import { take, put, fork, call } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

import * as Actions from './actions'

import CanvasCompress from 'canvas-compress';

const compressImages = (files) => {
  const compressor = new CanvasCompress({
      type: CanvasCompress.MIME.JPEG,
      width: 5000,
      height: 5000,
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
  var formData = new FormData();
  filesToUpload.forEach(
    (file, index) => {formData.append('file[' + index + ']', file)}
  )

  var xhr = new XMLHttpRequest();
  // progress callback is called frequently by the xhr handler during the upload
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable){
      var percent = Math.round(100 * event.loaded / event.total);
      //console.log('progress: ' + percent);
      emitter({ percent });
    }
  };
  // when uplaod is finished successfully
  xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE){
        if( xhr.status >= 200 && xhr.status < 300) {
          emitter({ success: true, paths: xhr.responseText });
          emitter(END);
        } else {
          emitter({ err: new Error('Upload failed') });
          emitter(END);
        }
      }
    }

  // callback to handle errors
  xhr.upload.onerror = event => {
    emitter({ err: new Error('Upload failed') });
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

function createUploadFilesChannel(files){
  return eventChannel( emitter => {
    return uploadFiles(emitter, files)
  })
}

function* uploadFilesSaga(files){
  console.log('creating UploadFiles Channel');
  const channel = yield call(createUploadFilesChannel, files);
  while (true){
    const chan = yield take(channel);
    console.log('take: ', chan);
    if (chan.err) {
       yield put(Actions.endUpload(false));
       return;
   }
   if (chan.success) {
       yield put(Actions.endUpload(true, chan.paths));
       return;
   }
   yield put(Actions.updateUploadProgress(chan.percent));
  }
}
/*
 Basically Follow this tutorial:
 https://decembersoft.com/posts/file-upload-progress-with-redux-saga/
*/

function* watchForUploadActions() {
  while(true){
    const { files } = yield take(Actions.START_UPLOAD);
    yield call(uploadFilesSaga, files);
  }
}

function* compressImagesSaga(files) {
  console.log('compressing images in sagas');
  yield put(Actions.startCopmression());
  const compressedImages = yield compressImages(files);
  yield put(Actions.endCopmression());
  yield put(Actions.startUpload(compressedImages));
}

function* watchForCompressionActions() {
  while(true){
    const { files } = yield take(Actions.SELECT_FILE);
    yield call(compressImagesSaga, files);
  }
}

export function* rootSaga(){
  yield [
    fork(watchForCompressionActions),
    fork(watchForUploadActions)
  ];
}
