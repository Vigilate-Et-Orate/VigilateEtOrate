import React from 'react'
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native'

import { Prayer } from 'config/types/Prayer'
import { PrayerBlock } from 'components/prayers/Block'
import prayers from 'data/prayers.json'
import theme from 'config/theme'

const PrayersScreen = (): JSX.Element => {
  const pair: Prayer[] = []
  const inpair: Prayer[] = []

  prayers.forEach((prayer: Prayer, index: number) => {
    if (index % 2 == 0) pair.push(prayer)
    else inpair.push(prayer)
  })

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <View
          style={{ flexDirection: 'row', height: '60%', position: 'relative' }}
        >
          <View style={{ position: 'absolute', top: 20, left: '15%' }}>
            <Image
              style={{ width: 80, height: 70 }}
              source={require('../assets/newIconolive.png')}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
            height: '40%',
            paddingHorizontal: 40
          }}
        >
          <Text style={{ color: '#f6f4f4', fontSize: 32 }}>Prières</Text>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <View
          style={
            prayers.length > 4 ? styles.roundedView : styles.roundedViewHeight
          }
        >
          <View style={styles.column}>
            {pair &&
              pair.map((prayer: Prayer, index: number) => (
                <PrayerBlock key={prayer.name} prayer={prayer} index={index} />
              ))}
          </View>
          <View style={styles.column}>
            {inpair &&
              inpair.map((prayer: Prayer, index: number) => (
                <PrayerBlock
                  key={prayer.name}
                  prayer={prayer}
                  index={index}
                  inpair={true}
                />
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
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

export default PrayersScreen
