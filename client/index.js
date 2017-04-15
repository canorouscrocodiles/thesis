import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import QuestionPage from './components/QuestionPage'
import store from './store'
import { Provider } from 'react-redux'
import { Router, Route, Switch, Redirect } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

const app = (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/question/:id'
          render={
            props => {
              // Parse id from string to int
              let id = parseInt(props.match.params.id)
              // Get list of questions for user
              let questions = store.getState().questions.data
              let allowedQuestion = false

              // Iterate through question ids
              if (questions.length > 0) {
                for (let i = 0; i < questions.length; i++) {
                  // If question with matching id is found
                  if (questions[i].id === id) {
                    // Set allowedQuestion to true and break out of loop
                    allowedQuestion = true
                    break
                  }
                }
              } else {
                return <Redirect to='/' />
              }

              if (allowedQuestion) {
                return <QuestionPage {...props} />
              } else {
                return <Redirect to='/' />
              }
            }
          }
        />
        <Route path='/*' render={() => <h2>404</h2>} />
      </Switch>
    </Router>
  </Provider>
)

const target = document.getElementById('app')

render(app, target)
