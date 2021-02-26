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

import { WelcomeCard } from 'elements/layout/Card'
import Page from 'components/layout/Page'
import DaySummary from 'components/DaySummary'
import theme from 'config/theme'
import { TUser } from 'config/types/User'
import { TLectureAelf } from 'config/types/AelfApi'
import { RootState } from 'red/reducers/RootReducer'
import { TNominisSaint } from 'config/types/Nominis'

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
      <View style={{ paddingBottom: 150 }}>
        {user && (
          <React.Fragment>
            <Text style={{ color: theme.colors.white, fontSize: 18 }}>
              Bonjour
            </Text>
            <Text style={{ color: theme.colors.white, fontSize: 26 }}>
              {user.firstname} !
            </Text>
          </React.Fragment>
        )}
        {evangile && (
          <React.Fragment>
            <WelcomeCard evangile={evangile.titre} />
          </React.Fragment>
        )}
        <Text style={styles.h3}>Résumé de la journée</Text>
        <ScrollView style={{ height: 250 }}>
          <DaySummary />
        </ScrollView>
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  h3: {
    marginVertical: 10,
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
  evangile: state.evangile.evangile
})

export default connect(mapToProps)(HomeScreen)
