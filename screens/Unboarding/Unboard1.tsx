import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Keyboard } from 'react-native'

import theme from 'config/theme'
import {
  FirstnameBlock,
  MyPrayerBlock
} from 'components/prayers/PersonnalBlock'

const Unboard = (): JSX.Element => {
  const [keyboard, setScreenKeyboard] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setScreenKeyboard(true))
    Keyboard.addListener('keyboardDidHide', () => setScreenKeyboard(false))

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow')
      Keyboard.removeAllListeners('keyboardDidHide')
    }
  }, [])

  return (
    <View style={styles.backgroundKeyboard}>
      {!keyboard && (
        <View>
          <Text
            style={{
              color: theme.colors.white,
              marginBottom: 10,
              marginTop: '20%',
              paddingHorizontal: 25,
              fontSize: 36
            }}
          >
            Ajoutez une prière personnelle
          </Text>
          <Text
            style={{
              color: theme.colors.blue,
              marginBottom: '20%',
              paddingHorizontal: 20
            }}
          >
            Une prière que vous avez écrite par exemple. Elle pourra être
            modifiée plus tard dans les paramètres
          </Text>
        </View>
      )}
      <FirstnameBlock />
      <View style={{ marginVertical: 20 }}></View>
      <MyPrayerBlock />
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.yellow,
    height: '100%'
  },
  backgroundKeyboard: {
    backgroundColor: theme.colors.yellow,
    height: '100%',
    paddingTop: '10%'
  }
})

export default Unboard
