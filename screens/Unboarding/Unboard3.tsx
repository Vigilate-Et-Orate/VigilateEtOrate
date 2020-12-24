import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

import theme from 'config/theme'
import { useNavigation } from '@react-navigation/native'
import { PrayerBlockRegister } from 'components/prayers/Block'
import { TPrayer } from 'config/types/Prayer'
import { useDispatch } from 'react-redux'
import { TNotif } from 'config/types/TNotif'
import { stringTimeToReadable, timeToString } from 'utils/time/timeManager'
import {
  registerForNotification,
  removeNotification
} from 'utils/api/api_server'
import { removeNotif, addNotif } from 'red/actions/NotifsActions'

type TPrayerUnboard = {
  notif: boolean
  time: string
} & TPrayer

const Unboard = ({
  prayers,
  notifs,
  token
}: {
  prayers: TPrayer[]
  notifs: TNotif[]
  token: string
}): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [prays, setPrayers] = useState<TPrayerUnboard[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState('')
  const [date, setDate] = useState(new Date(Date.now()))

  useEffect(() => {
    const p = prayers.filter(
      (p) =>
        p.name === 'angelus' ||
        p.name === 'je-vous-salue-marie' ||
        p.name === 'consecration'
    )
    const prs = p.map((pr) => {
      const not = notifs.find(
        (n) => n.notificationContent === pr.notificationContent
      )
      let time = ''
      if (not) time = stringTimeToReadable((not.time as string) || 'Error|R')
      return {
        ...pr,
        notif: not ? true : false,
        time
      }
    })
    setPrayers(prs)
  }, [])

  const onDateChange = async (event: any, selectedDate?: Date | undefined) => {
    if (!event) return
    const currentDate = selectedDate || date
    setShowModal(Platform.OS === 'ios')
    setDate(currentDate)
    if (currentPrayer) {
      const t = timeToString({
        hour: currentDate.getHours() + currentDate.getTimezoneOffset() / 60,
        minute: currentDate.getMinutes(),
        repeat: true,
        daysLeft: 0
      })
      const n = await registerForNotification(token, currentPrayer, t)
      console.log('Notifs registered:', n)
      if (!n) return
      dispatch(addNotif(n))
    }
  }

  const register = async (prayer: TPrayerUnboard) => {
    if (prayer.notificationContent) {
      const not = notifs?.find(
        (n) => n.notificationContent === prayer.notificationContent
      )
      if (!not) return
      const no = await removeNotification(token, not._id)
      dispatch(removeNotif(no || not))
    } else {
      setCurrentPrayer(prayer.notificationContent)
      setShowModal(true)
    }
  }

  return (
    <View style={styles.background}>
      {showModal && (
        <DateTimePicker
          mode="time"
          value={date}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      <Text style={styles.title}>Les Notifications les plus utilisées</Text>
      {prays.length > 0 && (
        <View style={styles.container}>
          <View style={styles.column}>
            <PrayerBlockRegister
              prayer={prays[0]}
              index={1}
              onPress={() => register(prays[0])}
            />
            <PrayerBlockRegister
              prayer={prays[2]}
              index={1}
              onPress={() => register(prays[2])}
            />
          </View>
          <View style={styles.column}>
            <PrayerBlockRegister
              prayer={prays[1]}
              index={0}
              onPress={() => register(prays[1])}
            />
          </View>
        </View>
      )}
      <View style={styles.button}>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.blue,
            paddingHorizontal: 25,
            paddingVertical: 10,
            borderRadius: 30
          }}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={{ color: theme.colors.white, fontSize: 20 }}>
            Continuer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.lightBlue,
    height: '100%'
  },
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  column: {
    flexDirection: 'column',
    alignContent: 'center',
    width: '40%',
    marginHorizontal: 20
  },
  title: {
    color: theme.colors.white,
    marginBottom: 10,
    marginTop: '20%',
    paddingHorizontal: 25,
    fontSize: 36
  },
  button: {
    position: 'absolute',
    bottom: '17%',
    right: '10%'
  }
})

export default Unboard
