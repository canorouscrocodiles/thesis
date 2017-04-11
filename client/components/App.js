import React, { Component } from 'react'
import GMap from './GMap'
import { connect } from 'react-redux'
import CurrentLocation from './CurrentLocation'
import Menu from './Menu'
import PostList from './PostList'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2>OnPoint 👇</h2>
        <Menu />
        <GMap />
        <CurrentLocation />
        <PostList />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(App)
