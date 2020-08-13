import React, { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import * as LocalNotification from 'utils/notification/LocalNotification'
import * as Storage from 'utils/storage/StorageManager'

import { Title } from 'elements/text/Text'
import { Prayer } from 'config/types/Prayer'
import { Switch } from 'react-native-gesture-handler'
import theme from 'config/theme'

type PrayerLineProps = {
  prayer: Prayer
}

const PrayerLine = ({ prayer }: PrayerLineProps) => {
  const [enabled, setEnabled] = useState(prayer.active)
  const toggleSwitch = () => {
    if (enabled) LocalNotification.unsubFromPrayer(prayer.name)
    else LocalNotification.registerForPrayer(prayer.name, new Date())
    setEnabled((prevState: boolean) => !prevState)
  }

  return (
    <View style={styles.card}>
      <View style={{ width: '70%' }}>
        <Text style={styles.title}>{prayer.displayName}</Text>
        <Text style={styles.description}>{prayer.description}</Text>
      </View>
      <View style={{ width: '30%' }}>
        <Switch
          trackColor={{ false: theme.colors.red, true: theme.colors.blue }}
          onValueChange={toggleSwitch}
          value={enabled}
        />
      </View>
    </View>
  )
}

const ManageNotificationsSubs = () => {
  let [data, setData] = useState<Prayer[]>()
  useEffect(() => {
    Storage.getDataAsync(Storage.Stored.SUBS).then((res) => {
      if (!res) {
        setData([])
        return
      }
      console.log('Res:', res)
      setData(JSON.parse(res))
    })
  }, [])

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 10,
          justifyContent: 'space-between'
        }}
      >
        <Title>Notifications</Title>
        <TouchableOpacity
          onPress={() => LocalNotification.unsubToAll}
          style={{ justifyContent: 'center', marginRight: 10 }}
        >
          <Text style={{ color: theme.colors.red, justifyContent: 'center' }}>
            Plus de notifs
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {data &&
          data.map((p: Prayer) => <PrayerLine prayer={p} key={p.name} />)}
      </ScrollView>
    </View>
  )
}

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
  }
})

export default ManageNotificationsSubs
