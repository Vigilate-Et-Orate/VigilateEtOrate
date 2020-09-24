import React, { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Page from 'components/layout/Page'
import { Favourite } from 'config/types/Favourite'
import { Prayer } from 'config/types/Prayer'
import * as Storage from 'utils/storage/StorageManager'
import theme from 'config/theme'
import { useFocusEffect } from '@react-navigation/native'
import { PrayerBlock } from 'components/prayers/Block'
import prayers from 'data/prayers.json'

const FavouriteScreen = (): JSX.Element => {
  const [favs, setFavs] = useState<Prayer[]>([])
  const [nbFav, setNbFav] = useState(0)

  useFocusEffect(
    useCallback(() => {
      Storage.getDataAsync(Storage.Stored.FAVOURITE).then((data) => {
        if (!data) return
        const parsed: Favourite[] = JSON.parse(data)
        // set prayers
        const favedPrayers = prayers.filter((p) =>
          parsed.find((f) => f.name === p.name && f.fav)
        )
        setFavs(favedPrayers)
        // count Nb of faved prayers
        let tmpNbFav = 0
        parsed.forEach((f) => {
          if (f.fav) tmpNbFav++
        })
        setNbFav(tmpNbFav)
      })
    }, [])
  )

  return (
    <Page title="Favoris">
      <View>
        {favs.length > 0 &&
          favs.map((f) => (
            <PrayerBlock key={f.name} prayer={f} index={1} fav />
          ))}
        {nbFav == 0 && (
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 20, color: theme.colors.blue }}>
              Pas de prières favorites...
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingTop: 30
              }}
            >
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

export default FavouriteScreen
