import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as AllActions from '../actions';
import { bindActionCreators  } from 'redux';

import { Circle } from 'rc-progress';

import Dropzone from 'react-dropzone';


class FileUploader extends Component{

  render(){
    const { selectFile, startUpload, selectedFiles } = this.props;
    const { uploadProgress } = this.props;
    const { linkToSrc } = this.props;
    const { compressing } = this.props;
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
          {selectedFiles.map(
            (item, index) => (
              <div key={index}>
                {/*
                <br></br>
                <a href={item.preview}>
                <img src={item.preview} style={{width:"175pt"}} alt=""></img>
                </a>
                */}
              </div>
          ))}
        </div>

        {compressing ? 'Copression in progress --': ''}
        <hr></hr>
        The link to uploaded file:
        <img src={linkToSrc} style={{width: '200pt'}} alt=''></img>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return{
    selectedFiles: state.selectedFiles,
    uploadStarted: state.uploadStarted,
    uploadSuccessful: state.uploadSuccessful,
    uploadError: state.uploadError,
    uploadProgress: state.uploadProgress,
    linkToSrc: state.linkToSrc,
    compressing: state.compressing
  }
}

const mapActionCreatorsToProps = (dispatch) => {
  return bindActionCreators(AllActions, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(FileUploader);
