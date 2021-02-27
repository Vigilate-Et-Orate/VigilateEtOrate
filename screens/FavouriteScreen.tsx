import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { connect } from 'react-redux'

import { TFavourite } from 'config/types/TFavourite'
import theme from 'config/theme'
import { TPrayer } from 'config/types/TPrayer'
import Page from 'components/layout/Page'
import { PrayerBlock } from 'components/prayers/Block'
import { RootState } from 'red/reducers/RootReducer'

const FavouriteScreen = ({
  favs,
  prayers
}: {
  favs: TFavourite[]
  prayers: TPrayer[]
}): JSX.Element => (
  <Page
    title="Favoris"
    backgroundColor={theme.colors.red}
    foregroundColor={theme.colors.blue}
  >
    <View>
      {favs.length > 0 &&
        favs.map((f) => {
          const p = prayers.find((p) => p._id === f.prayer)
          if (!p) return
          return <PrayerBlock key={f.id} prayer={p} />
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
  prayers: state.prayers.prayers
})

export default connect(mapToProps)(FavouriteScreen)
