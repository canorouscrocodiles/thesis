import { combineReducers } from 'redux'
import userReducer from './userReducer'
import questionReducer from './questionReducer'
import answerReducer from './answerReducer'
import locationReducer from './locationReducer'
import errorReducer from './errorReducer'
import authReducer from './authReducer'

const rootReducer = combineReducers({
  user: userReducer,
  questions: questionReducer,
  currentLocation: locationReducer,
  answers: answerReducer,
  error: errorReducer,
  auth: authReducer
})

export default rootReducer
