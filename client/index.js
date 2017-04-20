import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import store from './store'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

const app = (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App} />
    </Router>
  </Provider>
)

const target = document.getElementById('app')

render(app, target)
