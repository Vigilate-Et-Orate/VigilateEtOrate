import React, { useCallback, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Page from 'components/layout/Page'
import { TFavourite } from 'config/types/Favourite'
import theme from 'config/theme'
import { PrayerBlock } from 'components/prayers/Block'
import { connect } from 'react-redux'
import { RootState } from 'red/reducers/RootReducer'
import { TPrayer } from 'config/types/Prayer'

const FavouriteScreen = ({
  favs,
  prayers
}: {
  favs: TFavourite[]
  prayers: TPrayer[]
}): JSX.Element => (
  <Page title="Favoris">
    <View>
      {favs.length > 0 &&
        favs.map((f) => {
          const p = prayers.find((p) => p._id === f.prayer)
          if (!p) return
          return <PrayerBlock key={f.id} prayer={p} index={1} fav />
        })}
      {favs.length === 0 && (
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

const mapToProps = (state: RootState) => ({
  favs: state.favourites.favourites.filter((f) => f.faved),
  prayers: state.prayers.prayers
})

export default connect(mapToProps)(FavouriteScreen)
