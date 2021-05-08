import constants from 'config/constants'
import { TIntention, TIntentionsActionsTypes } from 'config/types/TIntention'

export function addIntentions(
  content: string,
  userId: string | undefined
): TIntentionsActionsTypes {
  if (!userId) throw new Error('Failed to dispatch new intentions')
  const intention: TIntention = {
    id: '',
    user: userId,
    intention: content
  }
  return {
    type: constants.INTENTIONS.INTENTIONS_ADD,
    intention
  }
}

export function deleteIntentions(
  intention: TIntention
): TIntentionsActionsTypes {
  return {
    type: constants.INTENTIONS.INTENTIONS_REMOVE,
    intention
  }
}

export function updateIntentions(
  intentions: TIntention[]
): TIntentionsActionsTypes {
  return {
    type: constants.INTENTIONS.INTENTIONS_UPDATE,
    intentions
  }
}
