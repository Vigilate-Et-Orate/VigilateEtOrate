import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { connect, useDispatch } from 'react-redux'

import { TFavourite } from 'config/types/TFavourite'
import theme from 'config/theme'
import { TPrayer } from 'config/types/TPrayer'
import Page from 'components/layout/Page'
import { PrayerBlock } from 'components/prayers/Block'
import TimePicker from 'components/TimePicker'
import { TNotif } from 'config/types/TNotif'
import { RootState } from 'red/reducers/RootReducer'
import { stringToTime } from 'utils/time/timeManager'
import { updateFavourite } from 'red/actions/FavouritesActions'
import { addNotif, removeNotif } from 'red/actions/NotifsActions'
import VOFire from 'utils/api/api_firebase'

const FavouriteScreen = ({
  favs,
  prayers,
  notifs
}: {
  favs: TFavourite[]
  prayers: TPrayer[]
  notifs: TNotif[]
  userId: string | undefined
  token: string
}): JSX.Element => {
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

  return (
    <Page
      title="Favoris"
      backgroundColor={theme.colors.red}
      foregroundColor={theme.colors.blue}
    >
      <View>
        <TimePicker open={show} onClosePicker={addTheNotif} />
        {favs.length > 0 &&
          favs.map((f) => {
            const p = prayers.find((p) => p.id === f.prayer)
            if (!p) return
            return (
              <PrayerBlock
                key={f.id}
                prayer={p}
                fav
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
  notifs: state.notifs.notifs
})

export default connect(mapToProps)(FavouriteScreen)
