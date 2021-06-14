import constants from 'config/constants'
import { ITagsState, TTagsActionsTypes } from 'config/types/TTags'

const initialState: ITagsState = {
  tags: [],
  count: 0
}

const tagsReducer = (
  state = initialState,
  action: TTagsActionsTypes
): ITagsState => {
  if (action.type == constants.TAGS.TAGS_UPDATE) {
    const tags = state.tags
    let c = 0
    action.tags.forEach((t) => {
      if (!tags.includes(t)) {
        tags.push(t)
        c++
      }
    })
    return {
      ...state,
      tags,
      count: state.count + c
    }
  }
  return state
}

export default tagsReducer
