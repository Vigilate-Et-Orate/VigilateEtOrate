import { View, Switch, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import theme from 'config/theme'

const capitalise = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

type Props = {
  title: string
  activeInitial: boolean
}

export const PrayerHome = ({ title }: { title: string }): JSX.Element => {
  return (
    <View style={styles.row}>
      <View style={{ width: '60%' }}>
        <Text style={{ fontSize: 25 }}>{title}</Text>
        <Text style={{ fontSize: 18 }}>Description future</Text>
      </View>
      <View style={{ width: '40%' }}></View>
    </View>
  )
}

const LineElement = ({ title, activeInitial }: Props): JSX.Element => {
  const [active, setActive] = useState(activeInitial)
  const toggleSwitch = () => setActive((prev) => !prev)

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ width: '60%' }}>
        <Text style={styles.text}>{capitalise(title)}</Text>
      </View>
      <View style={{ width: '40%' }}>
        <Switch
          onValueChange={toggleSwitch}
          value={active}
          trackColor={{ false: theme.colors.gray, true: theme.colors.red }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    margin: 10
  },
  text: {
    fontSize: 30
  }
})

export default LineElement
