import CONST from 'config/constants'

export type TFavourite = {
  id: string
  user: string
  prayer: string
  faved: boolean
}

interface Res {
  error?: string
}

export type TFavouriteResponse = TFavourite[] & Res

export type TToggleFavResponse = Res & TFavourite

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

export interface IFavouritesUpdate {
  type: typeof CONST.FAVOURITES.FAVOURITES_UPDATE
  favourites: TFavourite[]
}

export interface IFavouriteUpdate {
  type: typeof CONST.FAVOURITES.FAVOURITE_UPDATE
  favourite: TFavourite
}

export type TFavouritesActionTypes =
  | IFavouriteUpdate
  | IFavouriteRemove
  | IFavouriteAdd
  | IFavouritesUpdate
