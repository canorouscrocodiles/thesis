import React, { Component } from 'react'
import GMap from './GMap'
import CurrentLocation from './CurrentLocation'
import PostList from './PostList'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2>Hello World</h2>
        <GMap />
        <CurrentLocation />
        <PostList />
      </div>
    )
  }
}
