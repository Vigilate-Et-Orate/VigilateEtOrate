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
import { connect, useDispatch } from 'react-redux'
import { getExpoPushTokenAsync } from 'expo-notifications'
import Constant from 'expo-constants'

import theme from 'config/theme'
import { TUser } from 'config/types/User'
import Page from 'components/layout/Page'
import Device from 'components/Device/Block'
import { RootState } from 'red/reducers/RootReducer'
import { updateUser, userLogout } from 'red/actions/UserActions'
import {
  registerDevice,
  removeDevice,
  updateUserInfo
} from 'utils/api/api_server'

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
            <View style={styles.userRowLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            </View>
            <View style={styles.userRowRight}>
              {!edit && (
                <View>
                  <Text style={styles.userRowText}>
                    {user.firstname + ' ' + user.lastname}
                  </Text>
                  <Text>{user.email}</Text>
                </View>
              )}
              {edit && (
                <View>
                  <View style={styles.editRowInfos}>
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
              <View style={styles.userRowActions}>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <Text>Se Deconnecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={styles.devices}>
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
  addDevice: {
    marginHorizontal: '10%'
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.ultraLightGrey,
    borderRadius: 100,
    display: 'flex',
    height: 100,
    justifyContent: 'center',
    width: 100
  },
  avatarText: { color: theme.colors.white, fontSize: 30 },
  devices: { marginBottom: 20 },
  editRowInfos: { display: 'flex', flexDirection: 'row' },
  input: {
    borderBottomColor: theme.colors.yellow,
    borderBottomWidth: 1,
    fontSize: 15,
    marginHorizontal: 5,
    paddingHorizontal: 3,
    paddingVertical: 1
  },
  logoutButton: {
    backgroundColor: theme.colors.ultraLightGrey,
    borderRadius: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  text: {
    color: theme.colors.blue
  },
  userRow: {
    display: 'flex',
    flexDirection: 'row',
    height: 200,
    marginTop: 10
  },
  userRowActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  userRowLeft: { height: '100%', width: '30%' },
  userRowRight: { paddingLeft: 10, width: '70%' },
  userRowText: { fontSize: 26 },
  version: {
    bottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    width: '110%'
  },
  versionText: {
    color: theme.colors.blue
  }
})

const mapToProps = (state: RootState) => ({
  user: state.user.user,
  token: state.user.token
})

export default connect(mapToProps)(Settings)
