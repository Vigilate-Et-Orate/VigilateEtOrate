import { useMemo } from 'react'
import { createStore } from 'redux'

import rootReducer from './reducers/RootReducer'

let store: any

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const initialState: any = {
  user: {
    token: 'faketoken',
    user: {
      email: 'test@test.me',
      fistname: 'Preprod',
      lastname: 'Test',
      id: 'fake',
      admin: true,
      devices: [],
      personnalPrayer: ''
    },
    loggedIn: false
  },
  prayers: {
    prayers: [],
    count: 0
  }
}

const initStore = (preloadedState = initialState): any => {
  return createStore(rootReducer, preloadedState)
}

const initializeStore = (preloadedState: any): any => {
  let _store = store ?? initStore(preloadedState)

  if (preloadedState && store) {
    _store = initStore({
      ...store.getStore(),
      ...preloadedState
    })
    store = undefined
  }

  if (typeof window === 'undefined') return _store
  if (!store) store = _store

  return _store
}

export function useStore(initialState: any): any {
  const store = useMemo(() => initializeStore(initialState), initialState)
  return store
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
