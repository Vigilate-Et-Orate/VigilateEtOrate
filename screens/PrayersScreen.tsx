import React, { useEffect, useState } from 'react'
import { ScrollView, View, Animated, StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'

import { TPrayer } from 'config/types/TPrayer'
import { PrayerBlock } from 'components/prayers/Block'
import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { connect, useDispatch } from 'react-redux'
import Page from 'components/layout/Page'
import { TNotif } from 'config/types/TNotif'
import { isFavourite } from 'utils/favourites/favourites'
import { TFavourite } from 'config/types/TFavourite'
import { deleteFavourite, updateFavourite } from 'red/actions/FavouritesActions'
import { stringToTime } from 'utils/time/timeManager'
import { addNotif, removeNotif } from 'red/actions/NotifsActions'
import TimePicker from 'components/TimePicker'
import BottomSpace from 'elements/layout/BottomSpace'
import VOFire from 'utils/api/api_firebase'
import { TTags } from 'config/types/TTags'
import FavToggle from 'components/prayers/FavToggle'

type PrayersScreenProps = {
  prayers: TPrayer[]
  notifs: TNotif[]
  favs: TFavourite[]
  tags: TTags
}

const PrayersScreen = ({
  prayers,
  notifs,
  favs,
  tags
}: PrayersScreenProps): JSX.Element => {
  const dispatch = useDispatch()
  const animatedValue = new Animated.Value(0)
  const api = new VOFire()

  const [p, setPrayers] = useState<TPrayer[]>(prayers)
  const [fFav, setFilterFav] = useState(false)
  const [stag, setSelectedTag] = useState('')
  const [show, setShow] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState<TPrayer>()
  const [i, si] = useState(false)

  useEffect(() => {
    circleAnimated()
  }, [])

  const forceReload = () => si(!i)
  const toggleFav = async (id: string, fav: boolean) => {
    dispatch(
      updateFavourite({
        id: 'default',
        prayer: id,
        user: 'me',
        faved: fav
      })
    )
    const res = await api.favourites.toggle(id, !fav)
    if (!res) return
    dispatch(updateFavourite(res))
    dispatch(
      deleteFavourite({
        id: 'default',
        prayer: id,
        user: 'me',
        faved: fav
      })
    )
    forceReload()
  }
  const addTheNotif = async (time: string | undefined) => {
    if (!time || !currentPrayer) {
      setShow(false)
      return
    }

    setShow(false)
    const n = await api.notifications.create(
      currentPrayer.id,
      'prayer',
      time,
      currentPrayer?.notificationContentId
    )
    if (!n) return
    dispatch(addNotif(n))
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
  const circleAnimated = () => {
    animatedValue.setValue(0)
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start(() =>
      setTimeout(() => {
        if (prayers.length == 0) circleAnimated()
      }, 1000)
    )
  }
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 400]
  })
  const filterPrayers = (tag: string) => {
    let tmpPrayers = prayers
    if (fFav) tmpPrayers = tmpPrayers.filter((p) => isFavourite(p.id, favs))
    if (tag == stag) {
      setPrayers(tmpPrayers)
      setSelectedTag('')
    } else {
      tmpPrayers = tmpPrayers.filter((p) => p.tags.includes(tag))
      setPrayers(tmpPrayers)
      setSelectedTag(tag)
    }
  }
  const filterFav = (fav: boolean) => {
    setFilterFav(fav)
  }

  return (
    <Page
      title="Prières"
      backgroundColor={theme.colors.yellow}
      foregroundColor={theme.colors.blue}
      rightComponent={<FavToggle filter={filterFav}></FavToggle>}
    >
      <View>
        <ScrollView horizontal>
          <View style={styles.chips}>
            {tags &&
              tags.map((t) => (
                <Chip
                  key={t}
                  selected={stag == t}
                  selectedColor={theme.colors.blue}
                  onPress={() => filterPrayers(t)}
                  style={[
                    styles.chip,
                    stag == t ? styles.chipSelected : styles.chipDefault
                  ]}
                >
                  {t}
                </Chip>
              ))}
          </View>
        </ScrollView>
      </View>
      <ScrollView>
        <TimePicker open={show} onClosePicker={addTheNotif} />
        {p.length == 0 && (
          <Animated.View style={styles.card}>
            <Animated.View
              style={[styles.bar, { transform: [{ translateX: translateX }] }]}
            ></Animated.View>
          </Animated.View>
        )}
        {p.map((p) => (
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

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.blue,
    height: '100%',
    opacity: 0.4,
    width: '2%'
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    elevation: 15,
    height: 70
  },
  chip: {
    marginHorizontal: 2
  },
  chipDefault: {
    backgroundColor: theme.colors.yellow
  },
  chipSelected: {
    backgroundColor: theme.colors.white
  },
  chips: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

const mapToProps = (state: RootState) => ({
  prayers: state.prayers.prayers,
  notifs: state.notifs.notifs,
  favs: state.favourites.favourites,
  tags: state.tags.tags
})

export default connect(mapToProps)(PrayersScreen)
