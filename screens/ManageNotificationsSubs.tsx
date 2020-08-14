import React, { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

import * as LocalNotification from 'utils/notification/LocalNotification'
import * as Storage from 'utils/storage/StorageManager'

import { Title } from 'elements/text/Text'
import { Prayer } from 'config/types/Prayer'
import { Switch } from 'react-native-gesture-handler'
import theme from 'config/theme'

type PrayerLineProps = {
  prayer: Prayer
  onReactivate: (name: string) => void
}

const PrayerLine = ({ prayer, onReactivate }: PrayerLineProps) => {
  const [enabled, setEnabled] = useState(prayer.active)

  const toggleSwitch = () => {
    if (enabled) LocalNotification.unsubFromPrayer(prayer.name)
    else {
      if (prayer.times && prayer.times.length == 0) onReactivate(prayer.name)
      LocalNotification.registerForPrayer(prayer.name, new Date(Date.now()))
    }
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
  const [data, setData] = useState<Prayer[]>()
  const [date, setDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState('')
  let _isMounted: boolean

  const onDateChange = (event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || date
    setDate(currentDate)
    setShow(false)
    LocalNotification.registerForPrayer(currentPrayer, currentDate)
    setCurrentPrayer('')
  }

  const onReactivate = (name: string) => {
    setCurrentPrayer(name)
    setShow(true)
  }

  useEffect(() => {
    _isMounted = true
    Storage.getDataAsync(Storage.Stored.SUBS).then((res) => {
      if (!res) {
        setData([])
        return
      }
      setData(JSON.parse(res))
    })
    return () => {
      _isMounted = false
    }
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
        {show && (
          <DateTimePicker
            mode="time"
            value={date}
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
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
          data.map((p: Prayer) => (
            <PrayerLine onReactivate={onReactivate} prayer={p} key={p.name} />
          ))}
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
