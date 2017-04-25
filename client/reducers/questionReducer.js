import _ from 'lodash'
import utils from '../utils'
import {
  QUESTIONS_REQUEST_SENT,
  QUESTIONS_REQUEST_ERROR,
  SINGLE_QUESTION_RECEIVED,
  SORT_QUESTIONS,
  MARK_QUESTIONS_AS_READ,
  CHANGE_OPTION,
  CHANGE_VALUE
} from '../actions/questions'
import {
  POST_QUESTION_SUCCESS,
  GET_QUESTION_SUCCESS,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAILURE
} from '../actions/sockets/questions'
import { UPDATED_QUESTIONS_SUCCESS, UPDATED_QUESTIONS_FAILURE } from '../actions/sockets/location'
const UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS'
const SELECTED_QUESTION_DEACTIVATION_SUCCESS = 'SELECTED_QUESTION_DEACTIVATION_SUCCESS'
const QUESTION_DEACTIVATION_SUCCESS = 'QUESTION_DEACTIVATION_SUCCESS'
const NEW_QUESTION_POSTED = 'NEW_QUESTION_POSTED'

const initialState = {
  data: [],
  allQuestions: [],
  sortBy: 'New',
  categories: [],
  categoryList: [],
  categoryOptions: [],
  unread: false,
  value: [],
  sortOptions: [ 'New', 'Trending', 'Distance', 'Old' ],
  option: 0,
  fetching: false,
  error: null
}

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
const filterCategories = (arr) => {
  let results = Object.keys(_.groupBy(arr, 'category')).map(cat => {
    return {
      label: cat,
      value: cat.toLowerCase()
    }
  })

  return _.sortBy(results, 'label', 'asc')
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
        if (grouped[_.capitalize(category)]) {
          results = [...results, ...grouped[_.capitalize(category)]]
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
    case POST_QUESTION_SUCCESS:
      let updatedAllQuestions = state.allQuestions.slice()
      updatedAllQuestions.push(action.data)

      return {
        ...state,
        allQuestions: updatedAllQuestions,
        categoryOptions: filterCategories(updatedAllQuestions),
        fetching: false
      }
    case UPDATED_QUESTIONS_SUCCESS:
      calculateDistance(action.data, action.location)

      return {
        ...state,
        data: action.data,
        allQuestions: action.data,
        categoryOptions: filterCategories(action.data),
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
      let data = action.data.map(x => x.name)
      return {
        ...state,
        categoryList: data
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
    case NEW_QUESTION_POSTED:
      console.log('NEW QUESTION POSTED')
      return {
        ...state,
        unread: true
      }
    case MARK_QUESTIONS_AS_READ:
      return {
        ...state,
        unread: false,
        option: 0,
        value: []
      }
    case CHANGE_OPTION:
      return {
        ...state,
        option: action.data
      }
    case CHANGE_VALUE:
      return {
        ...state,
        value: action.data
      }
    default:
      return state
  }
}
