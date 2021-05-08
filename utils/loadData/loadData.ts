import { Dispatch } from 'redux'
import { TUser } from 'config/types/User'
import { updateUser } from 'red/actions/UserActions'
import { updateIntentions } from 'red/actions/IntentionsActions'
import { updatePrayers } from 'red/actions/PrayersActions'
import { getDailyGospel } from 'utils/api/api_aelf'
import { updateEvangile } from 'red/actions/EvangileActions'
import { updateInformations } from 'red/actions/DailyInformationsActions'
import { updateFavourites } from 'red/actions/FavouritesActions'
import { updateNotifs } from 'red/actions/NotifsActions'
import { getNominisSaint } from 'utils/api/rss_nominis'
import VOFire from 'utils/api/api_firebase'
import { registerForNotificationsAsync } from 'utils/notification/NotificationManager'
import { updatedevices } from 'red/actions/DevicesActions'

const loadOnline = async (dispatch: Dispatch<any>, setIsReady: () => void) => {
  try {
    const api = new VOFire()
    const user: TUser | undefined | null = await api.users.get()
    if (user) dispatch(updateUser(user, true))
    setIsReady()
    const notifs = await api.notifications.get()
    if (notifs) dispatch(updateNotifs(notifs))
    const prayers = await api.prayers.get()
    if (prayers) dispatch(updatePrayers(prayers))
    const informations = await getNominisSaint()
    if (informations) dispatch(updateInformations(informations))
    const evangile = await getDailyGospel()
    if (evangile) dispatch(updateEvangile(evangile))
    const favs = await api.favourites.getFavs()
    if (favs) dispatch(updateFavourites(favs))
    const intentions = await api.intentions.get()
    if (intentions) dispatch(updateIntentions(intentions))
    const expoToken = await registerForNotificationsAsync()
    if (!(await api.devices.check(expoToken))) {
      await api.devices.add(expoToken)
    }
    const devices = await api.devices.get()
    if (devices) dispatch(updatedevices(devices))
  } catch (e) {
    console.error('Error Loading', e.message)
  }
}

export async function loadData(
  dispatch: Dispatch<any>,
  ready: () => void
): Promise<void> {
  await loadOnline(dispatch, ready)
}
