import { combineReducers } from 'redux'

// Reducers
import userReducer from './UserReducer'
import intentionsReducer from './IntentionsReducer'
import prayersReducer from './PrayersReducer'
import evangileReducer from './EvangileReducer'
import dailyInfosReducer from './DailyInformationsReducer'

const rootReducer = combineReducers({
  user: userReducer,
  prayers: prayersReducer,
  intentions: intentionsReducer,
  evangile: evangileReducer,
  dailyInfos: dailyInfosReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
