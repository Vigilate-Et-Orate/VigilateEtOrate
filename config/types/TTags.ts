import constants from 'config/constants'

export type TTags = Array<string>

export interface ITagsState {
  tags: TTags
  count: number
}

export interface ITagsUpdate {
  type: typeof constants.TAGS.TAGS_UPDATE
  tags: TTags
}

export type TTagsActionsTypes = ITagsUpdate
