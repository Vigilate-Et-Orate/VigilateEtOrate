import { Dispatch } from 'redux'
import * as Storage from 'utils/storage/StorageManager'
import { TUser } from 'config/types/User'
import { updateUser } from 'red/actions/UserActions'
import { updateIntentions } from 'red/actions/IntentionsActions'
import { updatePrayers } from 'red/actions/PrayersActions'
import { getDailyGospel } from 'utils/api/api_aelf'
import { updateEvangile } from 'red/actions/EvangileActions'
import { updateInformations } from 'red/actions/DailyInformationsActions'
import { TIntention } from 'config/types/TIntention'
import { TPrayer } from 'config/types/TPrayer'
import { TInformationAelf, TLectureAelf } from 'config/types/TAelfApi'
import { updateFavourites } from 'red/actions/FavouritesActions'
import { registerForNotificationsAsync } from 'utils/notification/NotificationManager'
import { TNotif } from 'config/types/TNotif'
import { updateNotifs } from 'red/actions/NotifsActions'
import { getNominisSaint } from 'utils/api/rss_nominis'
import VOFire from 'utils/api/api_firebase'

const loadLocal = async (
  dispatch: Dispatch<any>,
  setProgress: (n: number) => void,
  setIsReady: (b: boolean) => void
) => {
  try {
    const user = await Storage.getDataAsync<TUser>(Storage.Stored.USER)
    if (user) dispatch(updateUser(user))
    setProgress(10)
    const intentions = await Storage.getDataAsync<TIntention[]>(
      Storage.Stored.INTENTIONS
    )
    setProgress(20)
    const prayers = await Storage.getDataAsync<TPrayer[]>(
      Storage.Stored.PRAYERS
    )
    setProgress(30)
    const informations = await Storage.getDataAsync<TInformationAelf>(
      Storage.Stored.DAY_INFO
    )
    setProgress(40)
    const evangile = await Storage.getDataAsync<TLectureAelf>(
      Storage.Stored.EVANGILE
    )
    setProgress(50)
    const notifs = await Storage.getDataAsync<TNotif[]>(Storage.Stored.NOTIFS)
    setProgress(90)
    if (
      !user ||
      !intentions ||
      !prayers ||
      !informations ||
      !evangile ||
      !notifs
    )
      return
    dispatch(updateIntentions(intentions))
    dispatch(updatePrayers(prayers))
    dispatch(updateEvangile(evangile))
    // dispatch(updateInformations(informations))
    dispatch(updateNotifs(notifs))
    setIsReady(true)
  } catch (e) {
    console.error(e.message)
  }
}

const loadOnline = async (
  dispatch: Dispatch<any>,
  // token: string,
  setProgress: (n: number) => void,
  setIsReady: (b: boolean) => void
) => {
  try {
    console.warn('LOADING DATA')
    const api = new VOFire()
    let user: TUser | undefined | null = await api.users.get()
    console.log('USER', user)
    if (user) dispatch(updateUser(user))
    setProgress(10)
    const prayers = await api.prayers.get()
    if (prayers) dispatch(updatePrayers(prayers))
    setProgress(30)
    const informations = await getNominisSaint()
    if (informations) dispatch(updateInformations(informations))
    setProgress(40)
    const evangile = await getDailyGospel()
    if (evangile) dispatch(updateEvangile(evangile))
    setProgress(50)
    const favs = await api.favourites.getFavs()
    console.log('FAVS', favs)
    if (favs) dispatch(updateFavourites(favs))
    setProgress(60)
    // const notifs = await api.notifications.get()
    // console.log('NOTIFS', notifs)
    // if (notifs) dispatch(updateNotifs(notifs))
    // setProgress(70)
    const intentions = await api.intentions.get()
    if (intentions) dispatch(updateIntentions(intentions))
    setProgress(80)
    // if (!user) user = await Storage.getDataAsync(Storage.Stored.USER)
    // if (!user) return
    // if (!user.devices || user.devices.length <= 0) {
    //   const expoToken = await registerForNotificationsAsync()
    //   const dev = await api.devices.add(expoToken)
    //   if (dev) user.devices.push(dev)
    // }
    // dispatch(updateUser(user))
    setProgress(100)
    setIsReady(true)
  } catch (e) {
    console.error('Error Loading', e.message)
    loadLocal(dispatch, setProgress, setIsReady)
  }
}

export async function loadData(
  dispatch: Dispatch<any>,
  setProgress: (n: number) => void,
  setIsReady: (b: boolean) => void
): Promise<void> {
  // const status = await getNetworkStateAsync()
  // const token = await Storage.getDataAsync<string>(Storage.Stored.TOKEN)
  // if (status.isInternetReachable && token)
  await loadOnline(dispatch, setProgress, setIsReady)
  // else await loadLocal(dispatch, setProgress, setIsReady)
}
