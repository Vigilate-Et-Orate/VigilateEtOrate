import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Image
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as Notifications from 'expo-notifications'
import * as Analytics from 'expo-firebase-analytics'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'

import * as LocalNotification from 'utils/notification/LocalNotification'
import Card, { WelcomeCard } from 'elements/layout/Card'
import { Header } from 'elements/text/Text'
import * as Storage from 'utils/storage/StorageManager'

import PrayersScreen from 'screens/PrayersScreen'
import ProfileScreen from 'screens/ProfileScreen'
import IntentionsScreen from 'screens/IntentionsScreen'
import theme from 'config/theme'
import { Prayer, MyPrayer } from 'config/types/Prayer'
import RegisterNotification from 'components/list/RegisterNotification'
import prayers from 'data/prayers.json'
import {
  LectureAelf,
  InformationAelf,
  getDailyGospel,
  getDailySaint
} from 'utils/aelf/fetchAelf'

const defaultValues: MyPrayer = {
  title: 'Je vous salue Marie',
  content: `Je vous salue Marie, pleine de grâces
Le Seigneur est avec vous
vous êtes bénie entre toutes les femmes
et Jésus le fruit de vos entrailles est beni
Sainte Marie Mère de Dieu,
priez pour nous pauvre pêcheurs,
maintenant et à l'heure de notre mort.
Amen.
`
}

const Home = (): JSX.Element => {
  const navigation = useNavigation()
  const [myPrayer, setPrayer] = useState(defaultValues)
  const [firstname, setFirstName] = useState('')
  const [availablePrayers, setAvailablePrayers] = useState(prayers as Prayer[])
  const [evangile, setEvangile] = useState<LectureAelf>()
  const [saint, setSaint] = useState<InformationAelf>()
  const [date, setDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState('')

  const onDateChange = (event: any, selectedDate?: Date | undefined) => {
    if (!event) return
    const currentDate = selectedDate || date
    setDate(currentDate)
    setShow(false)
    if (currentPrayer && currentPrayer.length > 0) {
      LocalNotification.registerForPrayer(currentPrayer, currentDate)
      setCurrentPrayer('')
    }
  }

  const effectCallback = () => {
    Storage.getDataAsync(Storage.Stored.MY_PRAYER).then((data) => {
      if (!data) return
      const res = JSON.parse(data)
      setPrayer(res)
    })
    Storage.getDataAsync(Storage.Stored.FIRSTNAME).then((data) => {
      if (!data) return
      setFirstName(data)
    })
    Storage.getDataAsync(Storage.Stored.SUBS).then((data) => {
      if (!data) return
      let res: Prayer[] = prayers
      const tmpData: Prayer[] = JSON.parse(data)
      const values = tmpData.map((e) => e.name)
      res = res.filter((e: Prayer) => !values.includes(e.name))
      setAvailablePrayers(res)
    })
    getDailyGospel().then((gospel: LectureAelf | undefined) => {
      if (!gospel) return
      setEvangile(gospel)
    })
    getDailySaint().then((saint: InformationAelf | undefined) => {
      if (!saint) return
      setSaint(saint)
    })
  }

  useFocusEffect(useCallback(effectCallback, []))

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
          <Text style={{ color: '#f6f4f4', fontSize: 36 }}>{firstname} !</Text>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '2%',
            right: '2%'
          }}
          onPress={() => navigation.navigate('Profile')}
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
          <Text style={styles.h3}>Saint du jour</Text>
          <Text style={styles.saintDuJour}>{saint?.fete}</Text>
          <Text style={styles.h3}>Evangile du jour</Text>
          <WelcomeCard evangile={evangile?.titre || 'Erreur de reseau'} />
          <Text style={styles.h3}>Prière Personnelle</Text>
          <Card
            title={myPrayer.title}
            body={myPrayer.content}
            onPress={() => {
              Analytics.logEvent('PersonnalPrayer', {
                location: 'homescreen'
              })
              navigation.navigate('MyPrayer')
            }}
          />
          <Text style={styles.h3}>Notifications disponibles</Text>
          {availablePrayers &&
            availablePrayers.map((p: Prayer) => (
              <RegisterNotification
                prayer={p}
                onPress={async () => {
                  if (p.times && p.times.length == 0) {
                    setShow(true)
                    setCurrentPrayer(p.name)
                  } else
                    LocalNotification.registerForPrayer(
                      p.name,
                      new Date(Date.now())
                    )
                  setAvailablePrayers(
                    availablePrayers.filter((e) => e.name !== p.name)
                  )
                }}
                key={p.name}
              />
            ))}
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
    paddingBottom: 35,
    paddingTop: 15
  }
})

// Tabs
const Tabs = createMaterialTopTabNavigator()

type TabBarProps = {
  state: any
  descriptors: any
  navigation: any
}

const tabsNameIcon = [
  { name: 'Home', iconName: 'home' },
  { name: 'Intentions', iconName: 'feather-alt' },
  { name: 'Prayers', iconName: 'book' },
  { name: 'Profile', iconName: 'heart' }
]

const MainTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View
      style={{
        elevation: 20,
        position: 'absolute',
        bottom: 40,
        left: '10%',
        borderRadius: 40,
        width: '80%',
        flexDirection: 'row',
        height: 60,
        zIndex: 40,
        backgroundColor:
          state.index == 1 ? theme.colors.green : theme.colors.blue
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]

        const name = tabsNameIcon.find((i) => i.name == route.name)?.iconName
        const isFocused = state.index == index
        const color = !isFocused
          ? theme.colors.white
          : route.name == 'Intentions'
          ? theme.colors.lightGreen
          : route.name == 'Profile'
          ? theme.colors.red
          : theme.colors.yellow

        const onPressNav = () => {
          const event = navigation.emit({
            type: 'typePress',
            target: route.key,
            canPreventDefault: true
          })

          if (!isFocused && !event.defaultPrevented)
            navigation.navigate(route.name)
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          })
        }

        return (
          <TouchableOpacity
            testID={options.tabBarTestID}
            onPress={onPressNav}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            key={route.key}
          >
            <FontAwesome5 name={name} size={25} color={color} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const HomeScreen = (): JSX.Element => {
  const navigation = useNavigation()

  useEffect(() => {
    const subRes = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        const data = event.notification.request.content.data
        if (data && (data.prayerName as string)) {
          Analytics.logEvent('notificationClicked', {
            prayer: data.prayerName
          })
          navigation.navigate('Prayer', {
            name: data.prayerName as string
          })
        }
      }
    )

    return () => {
      subRes.remove()
    }
  })

  return (
    <Tabs.Navigator tabBar={(props) => <MainTabBar {...props} />}>
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{ title: 'Accueil' }}
      />
      <Tabs.Screen
        name="Intentions"
        component={IntentionsScreen}
        options={{ title: 'Intentions' }}
      />
      <Tabs.Screen
        name="Prayers"
        component={PrayersScreen}
        options={{ title: 'Prières' }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tabs.Navigator>
  )
}

export default HomeScreen
