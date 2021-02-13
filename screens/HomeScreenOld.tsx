import React, { useState, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as Analytics from 'expo-firebase-analytics'
import { MaterialIcons } from '@expo/vector-icons'
import { connect, useDispatch } from 'react-redux'

import Card, { WelcomeCard } from 'elements/layout/Card'
import theme from 'config/theme'
import { TPrayer } from 'config/types/Prayer'
import { PrayerBlockRegister } from 'components/prayers/Block'
import { TUser } from 'config/types/User'
import { TLectureAelf, TInformationAelf } from 'config/types/AelfApi'
import { RootState } from 'red/reducers/RootReducer'
import { stringTimeToReadable, timeToString } from 'utils/time/timeManager'
import {
  registerForNotification,
  removeNotification
} from 'utils/api/api_server'
import { TNotif } from 'config/types/TNotif'
import { addNotif, removeNotif } from 'red/actions/NotifsActions'

type THomeScreenProps = {
  user: TUser | undefined
  loggedIn: boolean
  prayers: TPrayer[] | undefined
  evangile: TLectureAelf | undefined
  infos: TInformationAelf | undefined
  notifs: TNotif[] | undefined
  token: string
}

type TPrayerHome = {
  notif: boolean
  time: string
} & TPrayer

const HomeScreen = ({
  user,
  prayers,
  evangile,
  infos,
  notifs,
  token
}: THomeScreenProps): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [pair, setPair] = useState<TPrayerHome[]>([])
  const [inpair, setInpair] = useState<TPrayerHome[]>([])
  const [date, setDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState('')

  const onDateChange = async (event: any, selectedDate?: Date | undefined) => {
    if (!event) return
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
    if (currentPrayer) {
      const t = timeToString({
        hour: currentDate.getHours() + currentDate.getTimezoneOffset() / 60,
        minute: currentDate.getMinutes(),
        repeat: true,
        daysLeft: 0
      })
      const n = await registerForNotification(token, currentPrayer, t)
      if (!n) return
      dispatch(addNotif(n))
    }
  }

  const effectCallback = () => {
    const pairTmp: TPrayerHome[] = []
    const inpairTmp: TPrayerHome[] = []
    if (!prayers || prayers.length <= 0 || !Array.isArray(prayers) || !notifs)
      return
    prayers.forEach((prayer, index) => {
      const notif = notifs.find(
        (n) => n.notificationContent === prayer.notificationContent
      )
      let time = ''
      if (notif) {
        time = stringTimeToReadable((notif?.time as string) || 'Error|r')
      }
      const p = {
        ...prayer,
        time,
        notif: notif ? true : false
      }
      if (index % 2 == 0) pairTmp.push(p)
      else inpairTmp.push(p)
    })
    setPair(pairTmp)
    setInpair(inpairTmp)
  }

  useFocusEffect(useCallback(effectCallback, [prayers, notifs]))

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <View
          style={{ flexDirection: 'row', height: '60%', position: 'relative' }}
        >
          <View style={{ position: 'absolute', top: '50%', right: '35%' }}>
            <Image
              style={{ width: 40, height: 35 }}
              source={require('../assets/newIconolive.png')}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            height: '50%',
            paddingHorizontal: 40
          }}
        >
          <Text style={{ color: '#f6f4f4', fontSize: 22 }}>Bonjour</Text>
          <Text style={{ color: '#f6f4f4', fontSize: 36 }}>
            {user ? `${user.firstname} !` : ''}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '4%',
            right: '2%'
          }}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialIcons name="settings" color={theme.colors.white} size={35} />
        </TouchableOpacity>
        <View style={styles.roundedView}>
          {show && (
            <DateTimePicker
              mode="time"
              value={date}
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
          {infos?.fete && (
            <React.Fragment>
              <Text style={styles.h3}>Saint du jour</Text>
              <Text style={styles.saintDuJour}>{infos.fete}</Text>
            </React.Fragment>
          )}
          {evangile && (
            <React.Fragment>
              <Text style={styles.h3}>Evangile du jour</Text>
              <WelcomeCard evangile={evangile.titre} />
            </React.Fragment>
          )}
          {user?.personnalPrayer && (
            <View>
              <Text style={styles.h3}>Prière Personnelle</Text>
              <Card
                body={user.personnalPrayer}
                onPress={() => {
                  Analytics.logEvent('PersonnalPrayer', {
                    location: 'homescreen'
                  })
                  navigation.navigate('MyPrayer')
                }}
              />
            </View>
          )}
          <Text style={styles.h3}>Notifications disponibles</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                width: '45%',
                marginHorizontal: '2%'
              }}
            >
              {pair &&
                pair.map((prayer, index: number) => (
                  <PrayerBlockRegister
                    key={prayer.name}
                    prayer={prayer}
                    index={index}
                    notif={prayer.notif}
                    time={prayer.time}
                    onPress={async () => {
                      if (prayer.notif) {
                        const not = notifs?.find(
                          (n) =>
                            n.notificationContent === prayer.notificationContent
                        )
                        if (!not) return
                        const no = await removeNotification(token, not._id)
                        dispatch(removeNotif(no || not))
                      } else {
                        setCurrentPrayer(prayer.notificationContent)
                        setShow(true)
                      }
                    }}
                  />
                ))}
            </View>
            <View
              style={{
                flexDirection: 'column',
                width: '45%',
                marginHorizontal: '2%'
              }}
            >
              {inpair &&
                inpair.map((prayer, index: number) => (
                  <PrayerBlockRegister
                    key={prayer.name}
                    prayer={prayer}
                    index={index}
                    notif={prayer.notif}
                    time={prayer.time}
                    inpair
                    onPress={async () => {
                      if (prayer.notif) {
                        const not = notifs?.find(
                          (n) =>
                            n.notificationContent === prayer.notificationContent
                        )
                        if (!not) return
                        const no = await removeNotification(token, not._id)
                        dispatch(removeNotif(no || not))
                      } else {
                        setCurrentPrayer(prayer.notificationContent)
                        setShow(true)
                      }
                    }}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  h3: {
    marginVertical: 20,
    color: theme.colors.white,
    fontSize: 20
  },
  saintDuJour: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: theme.colors.blue,
    color: theme.colors.white,
    borderRadius: 10,
    marginHorizontal: '3%',
    elevation: 10
  },
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
    height: '125%',
    position: 'relative'
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
    marginTop: '45%',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 30,
    flexDirection: 'column',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 100,
    paddingTop: 15
  }
})

const mapToProps = (state: RootState) => ({
  user: state.user.user,
  loggedIn: state.user.loggedIn,
  prayers: state.prayers.prayers,
  evangile: state.evangile.evangile,
  infos: state.dailyInfos.informations,
  token: state.user.token,
  notifs: state.notifs.notifs
})

export default connect(mapToProps)(HomeScreen)
