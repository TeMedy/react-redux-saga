import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { FileUploader } from './Components/FileUploader'
import { createStore } from 'redux'
import { fileSelect } from './reducers'

import './bootstrap-4.0.0/css/bootstrap.min.css'

const store = createStore( fileSelect )

ReactDOM.render(
  <Provider store= { store }>
    <FileUploader />
  </Provider>,
  document.getElementById('root')
)
