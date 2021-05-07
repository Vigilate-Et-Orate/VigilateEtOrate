import React, { useState } from 'react'
import { ScrollView } from 'react-native'

import { TPrayer } from 'config/types/TPrayer'
import { PrayerBlock } from 'components/prayers/Block'
import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { connect, useDispatch } from 'react-redux'
import Page from 'components/layout/Page'
import { TNotif } from 'config/types/TNotif'
import { isFavourite } from 'utils/favourites/favourites'
import { TFavourite } from 'config/types/TFavourite'
import { updateFavourite } from 'red/actions/FavouritesActions'
import { stringToTime } from 'utils/time/timeManager'
import { addNotif, removeNotif } from 'red/actions/NotifsActions'
import TimePicker from 'components/TimePicker'
import BottomSpace from 'elements/layout/BottomSpace'
import VOFire from 'utils/api/api_firebase'

type PrayersScreenProps = {
  prayers: TPrayer[]
  notifs: TNotif[]
  favs: TFavourite[]
  userId: string | undefined
  token: string
}

const PrayersScreen = ({
  prayers,
  notifs,
  favs,
  userId,
  token
}: PrayersScreenProps): JSX.Element => {
  const dispatch = useDispatch()
  const api = new VOFire()

  const [show, setShow] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState<TPrayer>()
  const [i, si] = useState(false)

  const forceReload = () => si(!i)
  const toggleFav = async (id: string, fav: boolean) => {
    const res = await api.favourites.toggle(id, !fav)
    if (!res) return
    dispatch(updateFavourite(res))
    forceReload()
  }
  const addTheNotif = async (time: string | undefined) => {
    if (!time || !currentPrayer) {
      setShow(false)
      return
    }
    const n = await api.notifications.create(
      currentPrayer?.id,
      'prayer',
      time,
      currentPrayer?.notificationContent
    )
    if (!n) return
    dispatch(addNotif(n))
    setShow(false)
  }
  const addNotification = (prayer: TPrayer) => {
    setCurrentPrayer(prayer)
    setShow(true)
  }
  const removeN = async (id: string) => {
    await api.notifications.delete(id)
    const n = notifs.find((n) => n.id === id)
    if (!n) return
    dispatch(removeNotif(n))
  }

  return (
    <Page
      title="Prières"
      backgroundColor={theme.colors.yellow}
      foregroundColor={theme.colors.blue}
    >
      <ScrollView>
        <TimePicker open={show} onClosePicker={addTheNotif} />
        {prayers.map((p) => (
          <PrayerBlock
            key={p.id}
            prayer={p}
            fav={isFavourite(p.id, favs)}
            notifs={notifs
              .filter((n) => n.item === p.id)
              .sort(
                (a, b) =>
                  (stringToTime(a.time as string)?.hour || 0) -
                  (stringToTime(b.time as string)?.hour || 1)
              )}
            toggleFav={toggleFav}
            addNotification={addNotification}
            removeNotif={removeN}
          />
        ))}
        <BottomSpace />
      </ScrollView>
    </Page>
  )
}

const mapToProps = (state: RootState) => ({
  prayers: state.prayers.prayers,
  notifs: state.notifs.notifs,
  favs: state.favourites.favourites,
  userId: state.user.user?.id,
  token: state.user.token
})

export default connect(mapToProps)(PrayersScreen)
