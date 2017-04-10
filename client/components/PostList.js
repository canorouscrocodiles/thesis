import React, { Component } from 'react'
import ListEntry from './ListEntry'

export default class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h3>PostList</h3>
        <ListEntry />
        <ListEntry />
        <ListEntry />
        <ListEntry />
      </div>
    )
  }
}
