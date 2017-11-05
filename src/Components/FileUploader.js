import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as AllActions from '../actions';
import { bindActionCreators  } from 'redux';

import ReactUploadFile from 'react-upload-file';

export class FileUploader extends Component{

  render(){
    const { fileSelect, selectFile } = this.props;
    return(
      <div onClick={() => selectFile()} >
        <a className='btn btn-primary'> Select A File </a>
        {
          fileSelect?
          <div>
            <h1> A file a selected </h1>
          </div>
          : undefined
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return{
    fileSelect : state.fileSelect,
    fileUploadStart : state.fileUploadStart
  }
}

const mapActionCreatorsToProps = (dispatch) => {
  return bindActionCreators(AllActions, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(FileUploader);
