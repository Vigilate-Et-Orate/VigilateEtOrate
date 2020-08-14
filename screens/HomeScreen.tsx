import React, { useState, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, TouchableOpacity, Text, ScrollView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

import * as LocalNotification from 'utils/notification/LocalNotification'
import Card, { WelcomeCard } from 'elements/layout/Card'
import { Title, Header } from 'elements/text/Text'
import baseStyle from 'config/style'
import * as Storage from 'utils/storage/StorageManager'

import PrayersScreen from 'screens/PrayersScreen'
import ProfileScreen from 'screens/ProfileScreen'
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
  const [availablePrayers, setAvailablePrayers] = useState(prayers)
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

class HomeScreen extends React.Component {
  state = {
    isReady: false
  }

  // async componentDidMount() {
  //   await SplashScreen.preventAutoHideAsync();
  //   console.log('Waiting');
  //   setTimeout(async () => {
  //     console.log('Showing Screen')
  //     this.setState({ isReady: true })
  //     await SplashScreen.hideAsync()
  //   }, 5000)
  // }

  render(): JSX.Element {
    return (
      <Tabs.Navigator
        tabBarOptions={{
          activeTintColor: theme.colors.red,
          inactiveTintColor: theme.colors.gray
        }}
      >
        <Tabs.Screen name="Home" component={Home} />
        <Tabs.Screen name="Prayers" component={PrayersScreen} />
        <Tabs.Screen name="Profile" component={ProfileScreen} />
      </Tabs.Navigator>
    )
  }
}

export default HomeScreen
