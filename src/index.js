import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { fileState } from './reducers'
import createSagaMiddleware from 'redux-saga'

import App from './Components/FileUploader'
import { rootSaga } from './sagas'

import './bootstrap-4.0.0/css/bootstrap.min.css'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  fileState,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store= { store }>
    <App />
  </Provider>,
  document.getElementById('root')
)
