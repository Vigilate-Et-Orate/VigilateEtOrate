import React from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { connect } from 'react-redux'

import theme from 'config/theme'
import { TUser } from 'config/types/User'
import { TLectureAelf } from 'config/types/TAelfApi'
import { TNominisSaint } from 'config/types/TNominis'
import Page from 'components/layout/Page'
import DaySummary from 'components/DaySummary'
import { WelcomeCard } from 'elements/layout/Card'
import { RootState } from 'red/reducers/RootReducer'

type THomeScreenProps = {
  user: TUser | undefined
  evangile: TLectureAelf | undefined
  infos: TNominisSaint | undefined
}

const HomeScreen = ({ user, evangile }: THomeScreenProps) => {
  const navigation = useNavigation()

  return (
    <Page
      title="Accueil"
      backgroundColor={theme.colors.blue}
      foregroundColor={theme.colors.lightBlue}
      home
      refresh
      rightComponent={
        <React.Fragment>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons
              name="settings"
              color={theme.colors.yellow}
              size={35}
            />
          </TouchableOpacity>
        </React.Fragment>
      }
    >
      <View>
        {user && (
          <View style={styles.row}>
            <Text style={styles.h1}>Bonjour</Text>
            <Text style={styles.h1}>{user.firstname} !</Text>
          </View>
        )}
        {evangile && (
          <React.Fragment>
            <WelcomeCard evangile={evangile.titre} />
          </React.Fragment>
        )}
        <Text style={styles.h2}>Résumé de la journée</Text>
        <ScrollView style={styles.container}>
          <DaySummary />
        </ScrollView>
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  container: { height: 250 },
  h1: { color: theme.colors.white, fontSize: 24, marginRight: 10 },
  h2: {
    color: theme.colors.white,
    fontSize: 18,
    marginBottom: 10,
    marginRight: 10
  },
  row: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row'
  }
})

const mapToProps = (state: RootState) => ({
  user: state.user.user,
  evangile: state.evangile.evangile
})

export default connect(mapToProps)(HomeScreen)
