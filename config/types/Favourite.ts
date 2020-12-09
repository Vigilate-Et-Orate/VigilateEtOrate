import CONST from 'config/constants'

export type TFavourite = {
  id: string
  user: string
  prayer: string
  fav: boolean
}

// Redux
export type TFavouriteState = {
  favourites: TFavourite[]
  count: number
}

export interface IFavouriteAdd {
  type: typeof CONST.FAVOURITES.FAVOURITES_ADD
  favourite: TFavourite
}

export interface IFavouriteRemove {
  type: typeof CONST.FAVOURITES.FAVOURITES_DELETE
  favourite: TFavourite
}

export interface IFavouriteUpdate {
  type: typeof CONST.FAVOURITES.FAVOURITES_ADD
  favourites: TFavourite[]
}

export type TFavouritesActionTypes =
  | IFavouriteUpdate
  | IFavouriteRemove
  | IFavouriteAdd
