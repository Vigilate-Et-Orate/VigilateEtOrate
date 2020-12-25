import CONST from 'config/constants'
import { TFavourite, TFavouritesActionTypes } from 'config/types/Favourite'

export function addFavourite(favourite: TFavourite): TFavouritesActionTypes {
  return {
    type: CONST.FAVOURITES.FAVOURITES_ADD,
    favourite
  }
}

export function updateFavourites(
  favourites: TFavourite[]
): TFavouritesActionTypes {
  return {
    type: CONST.FAVOURITES.FAVOURITES_UPDATE,
    favourites
  }
}

export function updateFavourite(favourite: TFavourite): TFavouritesActionTypes {
  return {
    type: CONST.FAVOURITES.FAVOURITE_UPDATE,
    favourite
  }
}

export function deleteFavourite(favourite: TFavourite): TFavouritesActionTypes {
  return {
    type: CONST.FAVOURITES.FAVOURITES_DELETE,
    favourite
  }
}
