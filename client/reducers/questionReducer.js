import _ from 'lodash'
import utils from '../utils'
import {
  QUESTIONS_REQUEST_SENT,
  QUESTIONS_REQUEST_ERROR,
  SELECT_SINGLE_QUESTION,
  SINGLE_QUESTION_RECEIVED,
  SORT_QUESTIONS
} from '../actions/questions'
import { POST_QUESTION_SUCCESS, GET_QUESTION_SUCCESS, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAILURE } from '../actions/sockets/questions'
import { UPDATED_QUESTIONS_SUCCESS, UPDATED_QUESTIONS_FAILURE } from '../actions/sockets/location'
const UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS'
const SELECTED_QUESTION_DEACTIVATION_SUCCESS = 'SELECTED_QUESTION_DEACTIVATION_SUCCESS'
const QUESTION_DEACTIVATION_SUCCESS = 'QUESTION_DEACTIVATION_SUCCESS'
const initialState = {data: [], allQuestions: [], categoryList: [], sortBy: 'New', categories: [], selectedQuestion: null, fetching: false, error: null}

// Once a page reloads all questions come in and will be sorted by NEW
// On sortBy change re-order all questions
// If questions are updated re-order the questions coming in by sortBy

const sortBy = {
  New: ['timestamp', 'desc'],
  Old: ['timestamp', 'asc'],
  Trending: ['vote_count', 'desc'],
  Distance: ['distance', 'asc']
}

const sortQuestions = (questions, sortBy, order) => _.orderBy(questions, [sortBy], [order])
const calculateDistance = (questions, location) => {
  questions.forEach(q => {
    let coords = utils.parseGeoJSON(q.st_asgeojson)
    q.distance = utils.haversine(location.lat, location.lng, coords.lat, coords.lng)
  })
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SORT_QUESTIONS:
      // Sort questions by the criteria set
      let sortedQuestions = sortQuestions(state.allQuestions, sortBy[action.sortBy][0], sortBy[action.sortBy][1])

      // Group the questions into categories
      let grouped = _.groupBy(sortedQuestions, 'category')

      // Create array for filtered questions
      let results = []

      // Loop through all categories
      // If the key is in our grouped object then concat that array to our results
      action.categories.forEach(category => {
        if (grouped[category]) {
          results = [...results, ...grouped[category]]
        }
      })

      return {
        ...state,
        sortBy: action.sortBy,
        categories: action.categories,
        data: action.categories.length > 0 ? results : sortedQuestions
      }
    case QUESTIONS_REQUEST_SENT:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case QUESTIONS_REQUEST_ERROR:
      return {
        ...state,
        error: action.data
      }
    case GET_QUESTION_SUCCESS:
      return {
        ...state,
        selectedQuestion: action.data
      }
    case SINGLE_QUESTION_RECEIVED:
      return {
        ...state,
        selectedQuestion: action.data
      }
    case SELECT_SINGLE_QUESTION:
      const singleQuestion = state.data.find(question => question.id === parseInt(action.data))
      return {
        ...state,
        selectedQuestion: singleQuestion
      }
    case POST_QUESTION_SUCCESS:
      return {
        ...state,
        data: action.data,
        fetching: false
      }
    case UPDATED_QUESTIONS_SUCCESS:
      calculateDistance(action.data, action.location)
      return {
        ...state,
        data: action.data,
        allQuestions: action.data,
        fetching: false
      }
    case UPDATED_QUESTIONS_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.data
      }
    case UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        selectedQuestion: {
          ...state.selectedQuestion,
          category_id: action.data.category_id,
          message: action.data.message
        }
      }
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categoryList: action.data
      }
    case GET_CATEGORIES_FAILURE:
      return {
        ...state,
        error: action.data
      }
    case SELECTED_QUESTION_DEACTIVATION_SUCCESS:
      return {
        ...state,
        selectedQuestion: {
          ...state.selectedQuestion,
          active: false
        }
      }
    case QUESTION_DEACTIVATION_SUCCESS:
      return {
        ...state,
        data: [...state.data.filter(question => question.id !== action.data)],
        allQuestions: [...state.allQuestions.filter(question => question.id !== action.data)]
      }
    default:
      return state
  }
}
