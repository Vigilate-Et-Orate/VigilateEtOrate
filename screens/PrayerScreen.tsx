import React, { useEffect, useState } from 'react'
import { ScrollView, Text, StyleSheet } from 'react-native'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import * as Analytics from 'expo-firebase-analytics'

import Page from 'components/layout/Page'
import { isFavourite } from 'utils/favourites/favourites'
import theme from 'config/theme'
import { TPrayer } from 'config/types/Prayer'
import { connect, useDispatch } from 'react-redux'
import {
  addFavourite,
  deleteFavourite,
  updateFavourite
} from 'red/actions/FavouritesActions'
import { toggleFavourite } from 'utils/api/api_server'
import { RootState } from 'red/reducers/RootReducer'
import { TFavourite } from 'config/types/Favourite'

type Route = {
  key: string
  name: string
  params: {
    prayer: TPrayer
  }
}

const PrayerScreen = ({
  route,
  userId,
  token,
  favourites
}: {
  route: Route
  userId: string | undefined
  token: string
  favourites: TFavourite[]
}): JSX.Element => {
  const prayer = route.params.prayer
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
    isFavourite(prayer._id, favourites).then((res) => setFaved(res))
    Analytics.logEvent('ReadingPrayer', {
      prayerName: prayer?.name
    })
  }, [])

  const toogleFav = async () => {
    const res = await toggleFavourite(!faved, prayer._id, userId || '', token)
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
  favourites: state.favourites.favourites
})

export default connect(mapToProps)(PrayerScreen)
