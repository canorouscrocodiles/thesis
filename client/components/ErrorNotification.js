import React, { Component } from 'react'
import { connect } from 'react-redux'

class ErrorNotification extends Component {
  renderClass () {
    const { error } = this.props
    if (error) {
      return 'error-notification show'
    } else {
      return 'error-notification hide'
    }
  }

  render () {
    const { error } = this.props
    if (error) {
      return (
        <div className={this.renderClass()}>
          <span className='error-text'>{error}</span>
        </div>
      )
    } else {
      return null
    }
  }
 }

const mapStateToProps = state => {
  return { error: state.error }
}

export default connect(mapStateToProps)(ErrorNotification)
