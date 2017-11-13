import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { fileState } from './reducers'

import App from './Components/FileUploader'

import './bootstrap-4.0.0/css/bootstrap.min.css'



const store = createStore( fileState )

ReactDOM.render(
  <Provider store= { store }>
    <App />
  </Provider>,
  document.getElementById('root')
)
