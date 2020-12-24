import CONST from 'config/constants'
import {
  IFavouriteAdd,
  IFavouriteRemove,
  IFavouriteUpdate,
  IFavouritesUpdate,
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
      act = action as IFavouritesUpdate
      return {
        ...state,
        favourites: act.favourites,
        count: act.favourites.length
      }
    case CONST.FAVOURITES.FAVOURITE_UPDATE: {
      act = action as IFavouriteUpdate
      const id = act.favourite.id
      const favs = state.favourites
      const index = favs.findIndex((e) => e.id === id)
      favs[index].faved = act.favourite.faved
      return { ...state, favourites: favs }
    }
    case CONST.FAVOURITES.FAVOURITES_DELETE: {
      act = action as IFavouriteRemove
      const id = act.favourite.id
      const index = state.favourites.findIndex((e) => e.id === id)
      if (state.favourites.length - 1 === 0)
        return { ...state, favourites: [], count: 0 }
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
