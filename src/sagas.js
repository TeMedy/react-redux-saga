import { take, put, fork, call } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

import * as Actions from './actions'

import CanvasCompress from 'canvas-compress';

const compressImages = (files) => {
  const compressor = new CanvasCompress({
      type: CanvasCompress.MIME.JPEG,
      width: 500,
      height: 500,
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

function createUploadFilesChannel(files){
  return eventChannel( emitter => {
    setTimeout(() => {

          emitter({type: 'TEST'});
        }, 2000)
    return () => {};
  })
};


const countdown = (secs = 4) => {
  return eventChannel( (emitter) => {
        const iv = setInterval(() => {
          secs -= 1
          if (secs > 0) {
            emitter(secs)
          } else {
            // this causes the channel to close
            emitter(END)
          }
        }, 750);
        // The subscriber must return an unsubscribe function
        return () => {
          clearInterval(iv)
        }
      }
    )
}


function* uploadFilesSaga(files){
  console.log('code was here 11');
  //const channel = yield call(createUploadFilesChannel, files);
  const channel = yield call(countdown);
  console.log('code was here 12');
  while (true){
    //const { progress = 0, err, success } = yield take(channel);
    const action = yield take(channel);
    console.log('progress in uploadFilesSaga: ');
    console.log(action);
  }
}
/*
 Basically Follow this tutorial:
 https://decembersoft.com/posts/file-upload-progress-with-redux-saga/
*/

function* watchForUploadActions() {
  while(true){
    console.log('inside while loop 3')
    /*const { files } = */yield take(Actions.START_UPLOAD);
    console.log('inside while loop 3.5');
    yield call(uploadFilesSaga/*, files*/);
    console.log('inside while loop 4')
  }
}

function* watchForCompressionActions() {
  while(true){
    console.log('inside while loop 1')
    const { files } = yield take(Actions.SELECT_FILE);
    yield call(compressImagesSaga, files);
    console.log('inside while loop 2')
  }
}

export function* rootSaga(){
  yield fork(watchForUploadActions);
  /*
  yield [
    fork(watchForCompressionActions),
    fork(watchForUploadActions)
  ];
  */
}
