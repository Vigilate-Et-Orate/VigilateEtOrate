import React, { useState } from 'react'
import { View, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

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
import {
  registerForNotification,
  removeNotification,
  toggleFavourite
} from 'utils/api/api_server'
import { stringToTime, timeToString } from 'utils/time/timeManager'
import { addNotif, removeNotif } from 'red/actions/NotifsActions'

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

  const [date, setDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState<TPrayer>()
  const [i, si] = useState(false)

  const forceReload = () => si(!i)
  const toggleFav = async (id: string, fav: boolean) => {
    const res = await toggleFavourite(!fav, id, userId || '', token)
    if (!res) return
    dispatch(updateFavourite(res))
    forceReload()
  }
  const onDateChange = async (event: any, selectedDate?: Date | undefined) => {
    if (!event || event.type === 'dismissed') {
      setShow(false)
      return
    }
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
    if (currentPrayer) {
      const t = timeToString({
        hour: currentDate.getHours() + currentDate.getTimezoneOffset() / 60,
        minute: currentDate.getMinutes(),
        repeat: true,
        daysLeft: 0
      })
      const n = await registerForNotification(
        token,
        currentPrayer.notificationContent,
        currentPrayer._id,
        'prayer',
        t
      )
      if (!n) return
      dispatch(addNotif(n))
    }
  }
  const addNotification = (prayer: TPrayer) => {
    setCurrentPrayer(prayer)
    setShow(true)
  }
  const removeN = async (id: string) => {
    await removeNotification(token, id)
    const n = notifs.find((n) => n._id === id)
    if (!n) return
    dispatch(removeNotif(n))
  }

  return (
    <Page
      title="Prières"
      backgroundColor={theme.colors.yellow}
      foregroundColor={theme.colors.blue}
    >
      <View>
        {show && (
          <DateTimePicker
            mode="time"
            value={date}
            is24Hour
            display="default"
            onChange={onDateChange}
          />
        )}
        {prayers.map((p) => (
          <PrayerBlock
            key={p._id}
            prayer={p}
            fav={isFavourite(p._id, favs)}
            notifs={notifs
              .filter((n) => n.itemId === p._id)
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
      </View>
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
