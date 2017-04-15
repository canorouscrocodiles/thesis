import { combineReducers } from 'redux'
import userReducer from './userReducer'
import questionReducer from './questionReducer'
import answerReducer from './answerReducer'
import locationReducer from './locationReducer'
import urlReducer from './urlReducer'

const rootReducer = combineReducers({
  user: userReducer,
  questions: questionReducer,
  currentLocation: locationReducer,
  answers: answerReducer,
  goToUrl: urlReducer
})

export default rootReducer
