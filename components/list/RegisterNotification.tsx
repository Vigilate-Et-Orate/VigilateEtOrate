import React, { SyntheticEvent } from 'react'
import { Prayer } from 'config/types/Prayer'
import {
  Text,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity
} from 'react-native'

type RegisterNotificationProps = {
  prayer: Prayer
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const RegisterNotification = ({
  prayer,
  onPress
}: RegisterNotificationProps) => {
  return (
    <View style={styles.card}>
      <View style={{ width: '70%' }}>
        <Text style={styles.title}>{prayer.displayName}</Text>
        <Text style={styles.description}>{prayer.description}</Text>
      </View>
      <View style={{ width: '30%', flexDirection: 'column-reverse' }}>
        <TouchableOpacity onPress={onPress} style={styles.roundedButton}>
          <Text style={{ color: '#ffffff' }}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

import theme from 'config/theme'
const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    margin: 10,
    flexDirection: 'row'
  },
  title: {
    fontSize: 24,
    marginBottom: 6,
    color: theme.colors.blue
  },
  description: {
    fontSize: 14,
    color: theme.colors.gray
  },
  roundedButton: {
    backgroundColor: theme.colors.blue,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  }
})

export default RegisterNotification
