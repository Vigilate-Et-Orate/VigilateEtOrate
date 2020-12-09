import CONST from 'config/constants'
import {
  IFavouriteAdd,
  IFavouriteRemove,
  IFavouriteUpdate,
  TFavouriteState,
  TFavouritesActionTypes
} from 'config/types/Favourite'

const initialState: TFavouriteState = {
  favourites: [],
  count: 0
}

const favouriteReducer = (
  state = initialState,
  action: TFavouritesActionTypes
): TFavouriteState => {
  let act: TFavouritesActionTypes
  switch (action.type) {
    case CONST.FAVOURITES.FAVOURITES_ADD:
      act = action as IFavouriteAdd
      return {
        ...state,
        favourites: [...state.favourites, act.favourite],
        count: state.count + 1
      }
    case CONST.FAVOURITES.FAVOURITES_UPDATE:
      act = action as IFavouriteUpdate
      return {
        ...state,
        favourites: act.favourites,
        count: act.favourites.length
      }
    case CONST.FAVOURITES.FAVOURITES_DELETE: {
      act = action as IFavouriteRemove
      const id = act.favourite.id
      const index = state.favourites.findIndex((e) => e.id === id)
      const newFav = [
        ...state.favourites.slice(0, index),
        ...state.favourites.slice(index + 1)
      ]
      return { ...state, favourites: newFav, count: state.count - 1 }
    }
    default:
      return state
  }
}

export default favouriteReducer
