import CONST from 'config/constants'
import { TFavourite, TFavouritesActionTypes } from 'config/types/Favourite'

export function addFavourite(favourite: TFavourite): TFavouritesActionTypes {
  return {
    type: CONST.FAVOURITES.FAVOURITES_ADD,
    favourite
  }
}

export function updateFavourite(
  favourites: TFavourite[]
): TFavouritesActionTypes {
  return {
    type: CONST.FAVOURITES.FAVOURITES_UPDATE,
    favourites
  }
}

export function deleteFavourite(favourite: TFavourite): TFavouritesActionTypes {
  return {
    type: CONST.FAVOURITES.FAVOURITES_DELETE,
    favourite
  }
}
