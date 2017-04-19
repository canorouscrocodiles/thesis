import React, { Component } from 'react'
import { connect } from 'react-redux'
import ListEntry from './ListEntry'

class PostList extends Component {
  locationLoaded () {
    let location = this.props.currentLocation.address_components
    let district = location[2].long_name
    let city = location[3].long_name
    return (
      <h3>Questions around { `${district}, ${city}` }</h3>
    )
  }

  renderMessage () {
    if (!this.props.currentLocation) return <h3>Finding your location...</h3>
    return this.locationLoaded()
  }

  render () {
    return (
      <div>
        {this.renderMessage()}
        <div className='post-list'>
          {this.props.questions.data.map(question => <ListEntry key={question.id} question={question} />)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.questions,
    currentLocation: state.currentLocation.name
  }
}

export default connect(mapStateToProps)(PostList)
