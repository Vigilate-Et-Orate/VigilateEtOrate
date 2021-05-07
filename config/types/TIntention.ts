import CONST from 'config/constants'
import { firestore } from 'firebase'

export type TIntention = {
  id: string
  intention: string
  user: firestore.DocumentReference
}

// Redux
export interface IIntentionsState {
  intentions: TIntention[]
  count: number
}

export interface IIntentionsAdd {
  type: typeof CONST.INTENTIONS.INTENTIONS_ADD
  intention: TIntention
}

export interface IIntentionsUpdate {
  type: typeof CONST.INTENTIONS.INTENTIONS_UPDATE
  intentions: TIntention[]
}

export interface IIntentionsDelete {
  type: typeof CONST.INTENTIONS.INTENTIONS_REMOVE
  intention: TIntention
}

export type TIntentionsActionsTypes =
  | IIntentionsDelete
  | IIntentionsUpdate
  | IIntentionsAdd
