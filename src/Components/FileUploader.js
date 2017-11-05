import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as AllActions from '../actions';
import { bindActionCreators  } from 'redux';

export class FileUploader extends Component{

  render(){
    //const { selectFile } = this.props;
    console.log(this);
    return(
      //<div onClick={() => selectFile()} >
        <a className='btn btn-primary'> Select A File </a>
      //</div>
    )
  }
}

function mapStateToProps(state){
  return{
    fileSelect : state.fileSelect,
    fileUploadStart : state.fileUploadStart
  }
}

function mapActionCreatorsToProps(dispatch){
  return bindActionCreators(AllActions, dispatch);
}


export default connect(mapStateToProps)(FileUploader);
