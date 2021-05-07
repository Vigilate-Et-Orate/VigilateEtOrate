import React, { useEffect, useState } from 'react'
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import * as Analytics from 'expo-firebase-analytics'
import { connect, useDispatch } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import theme from 'config/theme'
import { TFavourite } from 'config/types/TFavourite'
import { TPrayer } from 'config/types/TPrayer'
import Page from 'components/layout/Page'
import { updateFavourite } from 'red/actions/FavouritesActions'
import { RootState } from 'red/reducers/RootReducer'
import { isFavourite } from 'utils/favourites/favourites'
import VOFire from 'utils/api/api_firebase'

type Route = {
  key: string
  name: string
  params: {
    prayer: string
  }
}

const PrayerScreen = ({
  route,
  userId,
  token,
  favourites,
  prayers
}: {
  route: Route
  prayers: TPrayer[]
  userId: string | undefined
  token: string
  favourites: TFavourite[]
}): JSX.Element => {
  const prayer = prayers.find((p) => p.name === route.params.prayer)
  const dispatch = useDispatch()
  const [faved, setFaved] = useState(false)
  const [size, setSize] = useState(16)
  const [o, so] = useState(false)

  const onGestureChange = (event: any) => {
    const newSize = size * event.nativeEvent.scale
    if (newSize < 72 && newSize > 8) setSize(size * event.nativeEvent.scale)
  }
  const forceReload = () => so(!o)

  useEffect(() => {
    if (!prayer) return
    setFaved(isFavourite(prayer.id, favourites))
    Analytics.logEvent('ReadingPrayer', {
      prayerName: prayer?.name
    })
  }, [])

  const toogleFav = async () => {
    if (!prayer || !prayer.id || !userId) return
    const api = new VOFire().favourites
    const res = await api.toggle(prayer.id, !faved)
    if (!res) return
    dispatch(updateFavourite(res))
    setFaved(res.faved)
    forceReload()
  }

  return (
    <Page
      title="Prière"
      backgroundColor={theme.colors.blue}
      back
      rightComponent={
        <TouchableOpacity onPress={toogleFav}>
          <MaterialCommunityIcons
            name="heart"
            size={35}
            color={faved ? theme.colors.red : theme.colors.white}
          />
        </TouchableOpacity>
      }
    >
      <PinchGestureHandler onGestureEvent={onGestureChange}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.title}>{prayer?.displayName}</Text>
          <Text style={{ fontSize: size }}>{prayer?.content}</Text>
          <Text style={[styles.text, { fontSize: size }]}>Amen.</Text>
        </ScrollView>
      </PinchGestureHandler>
    </Page>
  )
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20
  },
  text: {
    marginTop: 10
  },
  title: {
    color: theme.colors.blue,
    fontSize: 32,
    marginVertical: 20
  }
})

const mapToProps = (state: RootState) => ({
  userId: state.user.user?.id,
  token: state.user.token,
  favourites: state.favourites.favourites,
  prayers: state.prayers.prayers
})

export default connect(mapToProps)(PrayerScreen)
