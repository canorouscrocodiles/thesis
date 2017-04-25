import _ from 'lodash'
import {
  ANSWERS_REQUEST_SENT,
  USER_ANSWERS_REQUEST_RECEIVED,
  ANSWERS_REQUEST_ERROR,
  QUESTION_ANSWERS_REQUEST_RECEIVED,
  SUCCESSFUL_POST_ANSWER,
  FAILED_POST_ANSWER,
  SORT_ANSWERS
} from '../actions/answer'
import { REMOVE_QUESTION_FROM_INBOX } from '../actions/inbox'
import { UPDATE_USER_VOTE } from '../actions/sockets/votes'
import { sendNotification } from '../actions/notifications'
import { getUnread } from '../actions/sockets/answer'
const UPDATE_VOTE_SUCCESS = 'UPDATE_VOTE_SUCCESS'
const UPDATE_VOTE_FAILURE = 'UPDATE_VOTE_FAILURE'
const UPDATE_ANSWER_SUCCESS = 'UPDATE_ANSWER_SUCCESS'
const UNREAD_ANSWERS_SUCCESS = 'UNREAD_ANSWERS_SUCCESS'
const UNREAD_ANSWERS_FAILURE = 'UNREAD_ANSWERS_FAILURE'
const initialState = { data: [], unread: [], unreadExist: false, userAnswers: [], sortBy: 'New', fetching: false, error: null }

const sortBy = {
  New: ['timestamp', 'desc'],
  Old: ['timestamp', 'asc'],
  Trending: ['vote_count', 'desc']
}

const sortAnswers = (answers, sortBy, order) => _.orderBy(answers, [sortBy], [order])

export default (state = initialState, action) => {
  switch (action.type) {
    case SORT_ANSWERS:
      let sortedAnswers = sortAnswers(state.data, sortBy[action.sortBy][0], sortBy[action.sortBy][1])
      return {
        ...state,
        sortBy: action.sortBy,
        data: sortedAnswers
      }
    case ANSWERS_REQUEST_SENT:
      return {
        ...state,
        fetching: true
      }
    case USER_ANSWERS_REQUEST_RECEIVED:
      return {
        ...state,
        userAnswers: action.data,
        fetching: false
      }
    case QUESTION_ANSWERS_REQUEST_RECEIVED:
      let initialAnswers = sortAnswers(action.data, sortBy[state.sortBy][0], sortBy[state.sortBy][1])

      return {
        ...state,
        data: initialAnswers,
        fetching: false
      }
    case ANSWERS_REQUEST_ERROR:
      return {
        ...state,
        error: action.data
      }
    case SUCCESSFUL_POST_ANSWER:
      let path = window.location.pathname.split('/')
      let qID = parseInt(path[2])
      if (qID !== action.data.question_id) {
        sendNotification(action.data)
        return { ...state,
          unreadExist: true
        }
      } else {
        return {
          ...state,
          data: [
            ...state.data,
            action.data
          ]
        }
      }
    case FAILED_POST_ANSWER:
      return {
        ...state,
        error: action.data
      }
    case UPDATE_VOTE_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data.map(answer => answer.id === action.data.answer_id ? { ...answer, vote_count: action.data.vote_count } : answer )
        ]
      }
    case UPDATE_USER_VOTE:
      return {
        ...state,
        data: [
          ...state.data.map(answer => answer.id === action.data.answer_id ?
            {
              ...answer,
              users_vote_count: updateVote(answer.users_vote_count, action.data.vote_type)
            } :
            answer
          )
        ]
      }
    case UPDATE_ANSWER_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data.map(answer => answer.id === action.data.id ?
            {
              ...answer,
              message: action.data.message
            } :
            answer
          )
        ]
      }
    case UNREAD_ANSWERS_SUCCESS:
      return {
        ...state,
        unread: action.data,
        unreadExist: false
      }
    case REMOVE_QUESTION_FROM_INBOX:
      const index = state.unread.findIndex(message => message.id === action.data)
      let newUnread = [ ...state.unread.slice(0, index), ...state.unread.slice(index + 1)]
      newUnread[0] = state.unread[0] - 1
      return {
        ...state,
        unread: newUnread
      }
    case UNREAD_ANSWERS_FAILURE:
      return {
        ...state,
        error: action.data
      }
    default:
      return state
  }
}

const updateVote = (oldVote, newVote) => {
  if (oldVote === newVote) { // 1 and 1 or -1 and -1
    return 0
  } else {
    return newVote
  }
}
