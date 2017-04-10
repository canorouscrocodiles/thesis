import React, { Component } from 'react'

export default class ListEntry extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <p>Keith - 10m Ago</p>
        <p>What does Tri Tip even mean?</p>
      </div>
    )
  }
}
