import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Constant from 'expo-constants'

import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { connect, useDispatch } from 'react-redux'
import { TUser } from 'config/types/User'
import { updateUser, userLogout } from 'red/actions/UserActions'
import Page from 'components/layout/Page'
import Device from 'components/Device/Block'
import {
  registerDevice,
  removeDevice,
  updateUserInfo
} from 'utils/api/api_server'
import { getExpoPushTokenAsync } from 'expo-notifications'

const Settings = ({
  user,
  token
}: {
  user: TUser | undefined
  token: string
}): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [i, si] = useState(false)
  const [edit, setEdition] = useState(false)
  const [lastname, setLastname] = useState(user?.lastname || '')
  const [firstname, setFirstname] = useState(user?.firstname || '')
  const [email, setEmail] = useState(user?.email || '')

  const getInitials = () => {
    if (!user) return ''
    return user.firstname[0] + user.lastname[0]
  }
  const forceReload = () => si(!i)
  const logout = () => {
    dispatch(userLogout())
    navigation.navigate('Welcome')
  }
  const toggleEdition = async () => {
    if (edit) {
      await updateUserInfo(token, lastname, firstname, email)
      const tmpUser = user
      if (!tmpUser) return
      tmpUser.lastname = lastname
      tmpUser.firstname = firstname
      tmpUser.email = email
      dispatch(updateUser(tmpUser, false))
    }
    setEdition(!edit)
  }
  const deleteDevice = async (id: string) => {
    await removeDevice(token, id)
    const tmpUser = user
    if (!tmpUser) return
    tmpUser.devices = tmpUser.devices.filter((d) => d._id !== id)
    dispatch(updateUser(tmpUser))
    forceReload()
  }
  const addThisDev = async () => {
    const expoPushToken = await getExpoPushTokenAsync()
    const dev = await registerDevice(token, expoPushToken.data)
    const tmpUser = user
    if (!dev || !tmpUser) return
    tmpUser.devices.push(dev)
    dispatch(updateUser(tmpUser))
    forceReload()
  }

  return (
    <Page
      title="Paramètres"
      backgroundColor={theme.colors.blue}
      back
      rightComponent={
        <MaterialIcons.Button
          name={edit ? 'save' : 'edit'}
          color={edit ? theme.colors.yellow : theme.colors.white}
          backgroundColor={theme.colors.blue}
          onPress={() => toggleEdition()}
        >
          <Text
            style={{ color: edit ? theme.colors.yellow : theme.colors.white }}
          >
            {edit ? 'Enregistrer' : 'Editer'}
          </Text>
        </MaterialIcons.Button>
      }
    >
      <View>
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
              {!edit && (
                <View>
                  <Text style={{ fontSize: 26 }}>
                    {user.firstname + ' ' + user.lastname}
                  </Text>
                  <Text>{user.email}</Text>
                </View>
              )}
              {edit && (
                <View>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextInput
                      style={styles.input}
                      value={firstname}
                      onChangeText={setFirstname}
                    />
                    <TextInput
                      style={styles.input}
                      value={lastname}
                      onChangeText={setLastname}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              )}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <Text>Se Deconnecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={{ marginBottom: 20 }}>
          {user?.devices &&
            user.devices.map((d) => (
              <Device key={d._id} device={d} deleteDevice={deleteDevice} />
            ))}
        </View>
        <View style={styles.addDevice}>
          <MaterialIcons.Button
            name="phonelink-ring"
            backgroundColor={theme.colors.white}
            color={theme.colors.blue}
            onPress={addThisDev}
          >
            <Text style={styles.text}>
              Ajouter cet appareil pour les notifications
            </Text>
          </MaterialIcons.Button>
        </View>
      </View>
      <View style={styles.version}>
        <Text style={styles.versionText}>
          Version {Constant.nativeAppVersion} Build{' '}
          {Constant.nativeBuildVersion}
        </Text>
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  version: {
    position: 'absolute',
    bottom: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '110%',
    justifyContent: 'center'
  },
  versionText: {
    color: theme.colors.blue
  },
  text: {
    color: theme.colors.blue
  },
  addDevice: {
    marginHorizontal: '10%'
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.ultraLightGrey,
    marginTop: 10
  },
  input: {
    borderBottomColor: theme.colors.yellow,
    borderBottomWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 1,
    marginHorizontal: 5,
    fontSize: 15
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
  }
})

const mapToProps = (state: RootState) => ({
  user: state.user.user,
  token: state.user.token
})

export default connect(mapToProps)(Settings)
