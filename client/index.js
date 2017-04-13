import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import MainQuestion from './components/MainQuestion'
import store from './store'
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

const app = (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/question/:id' component={MainQuestion} />
        <Route path='/*' render={() => <h2>404</h2>} />
      </Switch>
    </Router>
  </Provider>
)

const target = document.getElementById('app')

render(app, target)
