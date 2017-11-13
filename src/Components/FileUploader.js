import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as AllActions from '../actions';
import { bindActionCreators  } from 'redux';
import { Circle } from 'rc-progress';

import Dropzone from 'react-dropzone';


class FileUploader extends Component{

  uploadFile(filesToUpload){
    const { updateUploadProgress, uploadFinish } = this.props;
    console.log(filesToUpload.length + ' files selected to upload');
    var formData = new FormData();
    filesToUpload.forEach(
      (file) => {formData.append('file', file)}
    )
    // create a XHR to upload the files
    var request = new XMLHttpRequest();
    // progress callback is called frequently by the request handler during the upload
    request.upload.addEventListener('progress', event => {
      if (event.lengthComputable){
        //const {updateUploadProgress } = this.props;
        var percent = Math.round(100 * event.loaded / event.total);
        console.log('progress: ' + percent);
        updateUploadProgress(percent);
      }
    });
    // when uplaod is finished successfully
    /*
    request.upload.addEventListener('load', event =>{
    });
    */
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          console.log('onreadystatechage: ')
          uploadFinish(true, request.responseText);
        }
      }

    // callback to handle errors
    request.upload.addEventListener('error', event => {
      console.log('an error happened.')
    });
    // open the request and disable the browser caching
    request.open('POST', '/upload');
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.send(formData);
    console.log('formData sent.')
  }

  componentWillUpdate(nextProps){
    const { selectFile, filesToUpload, uploadStarted, startUpload } = nextProps;
    if (filesToUpload.length > 0 && !uploadStarted){
      startUpload();
      this.uploadFile(filesToUpload);
    }
  }

  render(){
    const { selectFile, filesToUpload, uploadStarted, startUpload } = this.props;
    const { uploadProgress } = this.props;
    const { linkToSrc } = this.props;
    const dropZoneDisplay = () => {
      if (!uploadProgress){
        return(
          <img style={{width:"100%", height:"auto"}}
                src="https://png.icons8.com/add-user-male/ios7/50/3498db" alt="">
          </img>
        )
      } else {
        return (
          <Circle percent={uploadProgress} strokeWidth="6" strokeColor="#00A0FA" />
        )
      }
    }
    return(
      <div>
        <h1> Select file </h1>
        <Dropzone onDrop={ (files) => {selectFile(files)} }>
          { dropZoneDisplay() }
        </Dropzone>
        <div>
          {filesToUpload.map(
            (item, index) => (
              <div key={index}>
                <br></br>
                <a href={item.preview}>
                <img src={item.preview} style={{width:"175pt"}} alt=""></img>
                </a>
              </div>
          ))}
        </div>
        <hr></hr>
        The link to uploaded file:
        <img src={'/'+linkToSrc} style={{width: '200pt'}}></img>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return{
    filesToUpload: state.filesToUpload,
    uploadStarted: state.uploadStarted,
    uploadSuccessful: state.uploadSuccessful,
    uploadError: state.uploadError,
    uploadProgress: state.uploadProgress,
    linkToSrc: state.linkToSrc,
  }
}

const mapActionCreatorsToProps = (dispatch) => {
  return bindActionCreators(AllActions, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(FileUploader);
