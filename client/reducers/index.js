import { combineReducers } from 'redux'
import userReducer from './userReducer'
import questionReducer from './questionReducer'
import answerReducer from './answerReducer'
import locationReducer from './locationReducer'

const rootReducer = combineReducers({
  user: userReducer,
  questions: questionReducer,
  currentLocation: locationReducer,
  answers: answerReducer
})

export default rootReducer
