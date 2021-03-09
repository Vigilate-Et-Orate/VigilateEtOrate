import React from 'react'
import { View, StyleSheet } from 'react-native'

const BottomSpace = (): JSX.Element => <View style={styles.space}></View>

const styles = StyleSheet.create({
  space: {
    marginVertical: 60
  }
})

export default BottomSpace
