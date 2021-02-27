import React, { useState } from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { connect, useDispatch } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker'

import { TFavourite } from 'config/types/TFavourite'
import theme from 'config/theme'
import { TPrayer } from 'config/types/TPrayer'
import Page from 'components/layout/Page'
import { PrayerBlock } from 'components/prayers/Block'
import { RootState } from 'red/reducers/RootReducer'
import { TNotif } from 'config/types/TNotif'
import { stringToTime, timeToString } from 'utils/time/timeManager'
import { updateFavourite } from 'red/actions/FavouritesActions'
import { addNotif, removeNotif } from 'red/actions/NotifsActions'
import {
  registerForNotification,
  removeNotification,
  toggleFavourite
} from 'utils/api/api_server'

const FavouriteScreen = ({
  favs,
  prayers,
  notifs,
  userId,
  token
}: {
  favs: TFavourite[]
  prayers: TPrayer[]
  notifs: TNotif[]
  userId: string | undefined
  token: string
}): JSX.Element => {
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
      title="Favoris"
      backgroundColor={theme.colors.red}
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
        {favs.length > 0 &&
          favs.map((f) => {
            const p = prayers.find((p) => p._id === f.prayer)
            if (!p) return
            return (
              <PrayerBlock
                key={f.id}
                prayer={p}
                fav
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
            )
          })}
        {favs.length === 0 && (
          <View style={styles.noFavContainer}>
            <Text style={styles.noFavText}>Pas de prières favorites...</Text>
            <View style={styles.noFavHeart}>
              <MaterialCommunityIcons
                name="heart-broken"
                size={80}
                color={theme.colors.red}
              />
            </View>
          </View>
        )}
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  noFavContainer: { flexDirection: 'column' },
  noFavHeart: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30
  },
  noFavText: { color: theme.colors.white, fontSize: 20 }
})

const mapToProps = (state: RootState) => ({
  favs: state.favourites.favourites.filter((f) => f.faved),
  prayers: state.prayers.prayers,
  notifs: state.notifs.notifs,
  userId: state.user.user?.id,
  token: state.user.token
})

export default connect(mapToProps)(FavouriteScreen)
