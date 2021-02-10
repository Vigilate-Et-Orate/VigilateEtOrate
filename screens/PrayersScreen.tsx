import React from 'react'
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native'

import { TPrayer } from 'config/types/Prayer'
import { PrayerBlock } from 'components/prayers/Block'
import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { connect } from 'react-redux'
import Page from 'components/layout/Page'

const PrayersScreen = ({ prayers }: { prayers: TPrayer[] }): JSX.Element => {
  const pair: TPrayer[] = []
  const inpair: TPrayer[] = []

  prayers.forEach((prayer: TPrayer, index: number) => {
    if (index % 2 == 0) pair.push(prayer)
    else inpair.push(prayer)
  })

  return (
    <Page title="Prières" backgroundColor={theme.colors.blue}>
      <View style={{ flexDirection: 'row', display: 'flex' }}>
        <View style={styles.column}>
          {pair &&
            pair.map((prayer: TPrayer, index: number) => (
              <PrayerBlock key={prayer.name} prayer={prayer} index={index} />
            ))}
        </View>
        <View style={styles.column}>
          {inpair &&
            inpair.map((prayer: TPrayer, index: number) => (
              <PrayerBlock
                key={prayer.name}
                prayer={prayer}
                index={index}
                inpair
              />
            ))}
        </View>
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  column: {
    marginHorizontal: 10,
    width: '45%',
    flexDirection: 'column'
  },
  description: {
    fontSize: 14,
    color: theme.colors.blue
  },
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  body: {
    height: '125%'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '15%',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30
  },
  roundedView: {
    marginTop: '40%',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 30,
    paddingTop: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 35,
    height: '100%'
  },
  roundedViewHeight: {
    marginTop: '40%',
    backgroundColor: theme.colors.lightBlue,
    flexDirection: 'row',
    borderRadius: 30,
    paddingTop: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 35,
    height: 750
  }
})

const mapToProps = (state: RootState) => ({
  prayers: state.prayers.prayers
})

export default connect(mapToProps)(PrayersScreen)
