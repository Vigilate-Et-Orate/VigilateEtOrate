import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView
} from 'react-native'

import * as LocalNotification from 'utils/notification/LocalNotification'
import Button from 'elements/buttons/BaseButton'
import Card, { WelcomeCard } from 'elements/layout/Card'
import { Title, Header } from 'elements/text/Text'
import baseStyle from 'config/style'
import * as Storage from 'utils/storage/StorageManager'

import PrayerScreen from 'screens/PrayersScreen'
import ProfileScreen from 'screens/ProfileScreen'
import theme from 'config/theme'
import { Prayer } from 'config/types/Prayer'
import RegisterNotification from 'components/list/RegisterNotification'
import prayers from 'data/prayers.json'

const defaultValues: {
  title: string
  prayer: string
} = {
  title: 'Je vous salue Marie',
  prayer: `Je vous salue Marie, pleine de grâces
Le Seigneur est avec vous
vous êtes bénie entre toutes les femmes
et Jésus le fruit de vos entrailles est beni
Sainte Marie Mère de Dieu,
priez pour nous pauvre pêcheurs,
maintenant et à l'heure de notre mort.
Amen.
`
}

const getData = async () => {
  let result = await Storage.getDataAsync('my-prayer')

  if (result) result = JSON.parse(result)
  return result
}

const Home = () => {
  const navigation = useNavigation()
  const [myPrayer, setPrayer] = useState(defaultValues)
  const [availablePrayers, setAvailablePrayers] = useState(prayers)

  useEffect(() => {
    Storage.getDataAsync('my-prayer').then((data) => {
      if (!data) return
      const res = JSON.parse(data)
      setPrayer(res)
    })
    Storage.getDataAsync(Storage.Stored.SUBS).then((data) => {
      if (!data) return
      let tmpData: Prayer[] = JSON.parse(data)
      const res: Prayer[] = prayers
      res.filter((e: any) => tmpData.includes(e as Prayer))
      setAvailablePrayers(res)
    })
  }, [availablePrayers])

  return (
    <ScrollView style={baseStyle.view}>
      <Title>Bonjour !</Title>
      <WelcomeCard
        saint="Saint Thomas d'Aquin"
        evangile="Et le coq chanta pour la troisieme fois"
        onPress={() => console.log('Pressed card !')}
      />
      <Header>Prière Personnelle</Header>
      <Card
        title={myPrayer.title}
        body={myPrayer.prayer}
        onPress={() => console.log('Voila')}
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
            onPress={() => console.log('Register:', p.displayName)}
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

  render() {
    return (
      <Tabs.Navigator
        tabBarOptions={{
          activeTintColor: theme.colors.red,
          inactiveTintColor: theme.colors.gray
        }}
      >
        <Tabs.Screen name="Home" component={Home} />
        <Tabs.Screen name="Prayers" component={PrayerScreen} />
        <Tabs.Screen name="Profile" component={ProfileScreen} />
      </Tabs.Navigator>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  manage: {
    color: theme.colors.red
  }
})

export default HomeScreen
