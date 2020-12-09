import { useMemo } from 'react'
import { createStore } from 'redux'

import rootReducer from './reducers/RootReducer'

let store: any

const initialState = {
  user: {
    token: '',
    user: undefined,
    loggedIn: false
  },
  prayers: {
    prayers: [],
    count: 0
  }
}

const initStore = (preloadedState = initialState) => {
  return createStore(rootReducer, preloadedState)
}

const initializeStore = (preloadedState: any) => {
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

export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), initialState)
  return store
}
