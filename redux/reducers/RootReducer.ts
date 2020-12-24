import { combineReducers } from 'redux'

// Reducers
import userReducer from './UserReducer'
import intentionsReducer from './IntentionsReducer'
import prayersReducer from './PrayersReducer'
import evangileReducer from './EvangileReducer'
import dailyInfosReducer from './DailyInformationsReducer'
import favouriteReducer from './FavouritesReducer'
import notifsReducer from './NotifsReducer'
import keyboardReducer from './KeyboardReducer'

const rootReducer = combineReducers({
  user: userReducer,
  prayers: prayersReducer,
  intentions: intentionsReducer,
  evangile: evangileReducer,
  dailyInfos: dailyInfosReducer,
  favourites: favouriteReducer,
  notifs: notifsReducer,
  keyboard: keyboardReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
