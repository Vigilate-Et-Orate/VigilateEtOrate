import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, TouchableOpacity, Text, ScrollView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as Notifications from 'expo-notifications'

import * as LocalNotification from 'utils/notification/LocalNotification'
import Card, { WelcomeCard } from 'elements/layout/Card'
import { Title, Header } from 'elements/text/Text'
import baseStyle from 'config/style'
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
    <ScrollView style={baseStyle.view}>
      {show && (
        <DateTimePicker
          mode="time"
          value={date}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      <Title>Bonjour {firstname} !</Title>
      <WelcomeCard
        saint={saint?.jour_liturgique_nom || 'Erreur de reseau'}
        evangile={evangile?.titre || 'Erreur de reseau'}
      />
      <Header>Prière Personnelle</Header>
      <Card
        title={myPrayer.title}
        body={myPrayer.content}
        onPress={() => navigation.navigate('MyPrayer')}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        <Header>Prières disponibles</Header>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('ManageNotifs')}>
            <Text style={{ color: theme.colors.red, marginBottom: 20 }}>
              Gérer les Notifs
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    </ScrollView>
  )
}

const Tabs = createMaterialTopTabNavigator()

type TabBarProps = {
  state: any
  descriptors: any
  navigation: any
}

const MainTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 40,
        backgroundColor: theme.colors.red,
        alignItems: 'center',
        paddingHorizontal: 10
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index == index

        const onPress = () => {
          const event = navigation.emit({
            type: 'typePress',
            target: route.key,
            canPreventDefault: true
          })

          console.log(
            'isFocused:',
            isFocused,
            'defaultPrevented:',
            event.defaultPrevented,
            'RouteName:',
            route.name
          )
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
            accessibilityRole="button"
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
            key={route.key}
          >
            <Text
              style={{
                color: isFocused
                  ? theme.colors.blue
                  : theme.colors.ultraLightGrey,
                textAlign: 'center',
                fontSize: 15
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const HomeScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const subRes = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        const data = event.notification.request.content.data
        if (data && (data.prayerName as string)) {
          navigation.navigate('Prayer', {
            name: data.prayerName as string
          })
        }
      }
    )
  })

  return (
    <Tabs.Navigator tabBar={(props) => <MainTabBar {...props} />}>
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Intentions" component={IntentionsScreen} />
      <Tabs.Screen name="Prayers" component={PrayersScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  )
}

export default HomeScreen
