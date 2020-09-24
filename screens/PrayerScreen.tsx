import React, { useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import * as Analytics from 'expo-firebase-analytics'

import { Title } from 'elements/text/Text'
import Page from 'components/layout/Page'
import prayers from 'data/prayers.json'
import { isFavourite, toggleFavourite } from 'utils/favourites/favourites'

type Route = {
  key: string
  name: string
  params: {
    name: string
  }
}

const PrayerScreen = ({ route }: { route: Route }): JSX.Element => {
  const prayer = prayers.find((p) => p.name === route.params.name)
  const [faved, setFaved] = useState(false)
  const [size, setSize] = useState(16)
  const onGestureChange = (event: any) => {
    const newSize = size * event.nativeEvent.scale
    if (newSize < 72 && newSize > 8) setSize(size * event.nativeEvent.scale)
  }

  useEffect(() => {
    if (!prayer) return
    isFavourite(prayer.name).then((res) => setFaved(res))
  })

  const toogleFav = async () => {
    if (prayer) toggleFavourite(prayer.name)
    setFaved(!faved)
  }

  Analytics.logEvent('ReadingPrayer', {
    prayerName: prayer?.name
  })
  return (
    <Page title="Prière" heart onPress={toogleFav} faved={faved}>
      <PinchGestureHandler onGestureEvent={onGestureChange}>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <Title>{prayer?.displayName}</Title>
          <Text style={{ fontSize: size }}>{prayer?.content}</Text>
          <Text style={{ marginTop: 10, fontSize: size }}>Amen.</Text>
        </ScrollView>
      </PinchGestureHandler>
    </Page>
  )
}

export default PrayerScreen
