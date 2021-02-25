import React, { useEffect, useState } from 'react'
import { ScrollView, Text, StyleSheet } from 'react-native'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import * as Analytics from 'expo-firebase-analytics'

import Page from 'components/layout/PagePrayer'
import { isFavourite } from 'utils/favourites/favourites'
import theme from 'config/theme'
import { TPrayer } from 'config/types/Prayer'
import { connect, useDispatch } from 'react-redux'
import { updateFavourite } from 'red/actions/FavouritesActions'
import { toggleFavourite } from 'utils/api/api_server'
import { RootState } from 'red/reducers/RootReducer'
import { TFavourite } from 'config/types/Favourite'

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
    setFaved(isFavourite(prayer._id, favourites))
    Analytics.logEvent('ReadingPrayer', {
      prayerName: prayer?.name
    })
  }, [])

  const toogleFav = async () => {
    if (!prayer || !prayer._id || !userId) return
    const res = await toggleFavourite(!faved, prayer._id, userId, token)
    if (!res) return
    dispatch(updateFavourite(res))
    setFaved(res.faved)
    forceReload()
  }

  return (
    <Page title="Prière" heart onPress={toogleFav} faved={faved}>
      <PinchGestureHandler onGestureEvent={onGestureChange}>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <Text style={styles.title}>{prayer?.displayName}</Text>
          <Text style={{ fontSize: size }}>{prayer?.content}</Text>
          <Text style={{ marginTop: 10, fontSize: size }}>Amen.</Text>
        </ScrollView>
      </PinchGestureHandler>
    </Page>
  )
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    fontSize: 32,
    color: theme.colors.blue
  }
})

const mapToProps = (state: RootState) => ({
  userId: state.user.user?.id,
  token: state.user.token,
  favourites: state.favourites.favourites,
  prayers: state.prayers.prayers
})

export default connect(mapToProps)(PrayerScreen)
