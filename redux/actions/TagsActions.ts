import constants from 'config/constants'
import { TTags, TTagsActionsTypes } from 'config/types/TTags'

export const updateTags = (tags: TTags): TTagsActionsTypes => ({
  type: constants.TAGS.TAGS_UPDATE,
  tags
})
