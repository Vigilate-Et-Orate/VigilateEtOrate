import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { connect, useDispatch } from 'react-redux'
import { TUser } from 'config/types/User'
import { userLogout } from 'red/actions/UserActions'

const Settings = ({ user }: { user: TUser | undefined }): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const getInitials = () => {
    if (!user) return ''
    return user.firstname[0] + user.lastname[0]
  }

  const logout = () => {
    dispatch(userLogout())
    navigation.navigate('SignIn')
  }

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <View
          style={{ flexDirection: 'row', height: '60%', position: 'relative' }}
        >
          <View style={{ position: 'absolute', top: 20, left: '20%' }}>
            <Image
              style={{ width: 80, height: 70 }}
              source={require('../assets/newIconolive.png')}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
            height: '40%',
            paddingHorizontal: 40
          }}
        >
          <Text style={{ color: '#f6f4f4', fontSize: 32 }}>Paramètres</Text>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '8%',
            left: '2%',
            elevation: 20,
            zIndex: 90
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={40}
            color={theme.colors.white}
          />
        </TouchableOpacity>
        <View style={styles.roundedView}>
          {user && (
            <View style={styles.userRow}>
              <View style={{ width: '30%', height: '100%' }}>
                <View style={styles.avatar}>
                  <Text style={{ color: theme.colors.white, fontSize: 30 }}>
                    {getInitials()}
                  </Text>
                </View>
              </View>
              <View style={{ width: '70%', paddingLeft: 10 }}>
                <Text style={{ fontSize: 26 }}>
                  {user.firstname + ' ' + user.lastname}
                </Text>
                <Text>{user.email}</Text>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={logout}
                  >
                    <Text>Se Deconnecter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.ultraLightGrey,
    marginTop: 10
  },
  userRow: {
    display: 'flex',
    flexDirection: 'row',
    height: 200,
    marginTop: 10
  },
  avatar: {
    borderRadius: 100,
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ultraLightGrey
  },
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  body: {
    height: '125%'
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
    marginTop: '40%',
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    flexDirection: 'column',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingVertical: 35
  }
})

const mapToProps = (state: RootState) => ({
  user: state.user.user
})

export default connect(mapToProps)(Settings)
