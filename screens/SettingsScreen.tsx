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
import Constant from 'expo-constants'
import * as Analytics from 'expo-firebase-analytics'

import theme from 'config/theme'
import { TUser } from 'config/types/User'
import Page from 'components/layout/Page'
import Device from 'components/Device/Block'
import { RootState } from 'red/reducers/RootReducer'
import { updateUser, userLogout } from 'red/actions/UserActions'
import { registerForNotificationsAsync } from 'utils/notification/NotificationManager'
import VOFire from 'utils/api/api_firebase'
import { TDevice } from 'config/types/TDevices'
import { addDevice, removeDevice } from 'red/actions/DevicesActions'
import { Snackbar } from 'react-native-paper'

const Settings = ({
  user,
  devices
}: {
  user: TUser | undefined
  devices: TDevice[]
}): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const api = new VOFire()

  const [i, si] = useState(false)
  const [edit, setEdition] = useState(false)
  const [lastname, setLastname] = useState(user?.lastname || '')
  const [firstname, setFirstname] = useState(user?.firstname || '')
  const [email, setEmail] = useState(user?.email || '')
  const [show, dispSnack] = useState(false)
  const [snackTxt, setSnackTxt] = useState('')
  const [password, setPassword] = useState('')

  const getInitials = () => {
    if (!user) return ''
    return user.firstname[0] + user.lastname[0]
  }
  const forceReload = () => si(!i)
  const logout = () => {
    dispatch(userLogout())
    navigation.navigate('Welcome')
  }
  const save = async () => {
    if (edit) {
      Analytics.logEvent('updateUserInfos')
      await api.users.update(email, firstname, lastname)
      const tmpUser = user
      setSnackTxt('Mis à jour avec succès !')
      dispSnack(true)
      if (!tmpUser) return
      tmpUser.lastname = lastname
      tmpUser.firstname = firstname
      tmpUser.email = email
      dispatch(updateUser(tmpUser, false))
      if (password) {
        api.users.updatePwd(password)
        Analytics.logEvent('updatePassword')
      }
    }
    setEdition(!edit)
  }
  const deleteDevice = async (id: string) => {
    Analytics.logEvent('deletedDevice')
    await api.devices.delete(id)
    const dev = devices.find((d) => d.id === id)
    if (dev) {
      setSnackTxt('Appareil supprimé')
      dispSnack(true)
      dispatch(removeDevice(dev))
    }
    forceReload()
  }
  const addThisDev = async () => {
    Analytics.logEvent('manualDeviceAdd')
    const expoPushToken = await registerForNotificationsAsync()
    const dev = await api.devices.add(expoPushToken)
    if (typeof dev == 'string') {
      setSnackTxt(dev)
      dispSnack(true)
    } else if (dev != null) dispatch(addDevice(dev))
    forceReload()
  }

  return (
    <Page
      title="Paramètres"
      backgroundColor={theme.colors.blue}
      back
      rightComponent={
        <MaterialIcons.Button
          name={'edit'}
          color={edit ? theme.colors.yellow : theme.colors.white}
          backgroundColor={theme.colors.blue}
          onPress={() => setEdition(!edit)}
        >
          <Text
            style={{ color: edit ? theme.colors.yellow : theme.colors.white }}
          >
            {edit ? 'Annuler' : 'Editer'}
          </Text>
        </MaterialIcons.Button>
      }
    >
      <View>
        {user && (
          <View style={styles.userRow}>
            {!edit && (
              <View style={styles.userRowLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials()}</Text>
                </View>
              </View>
            )}
            <View style={edit ? styles.userRowRightEdit : styles.userRowRight}>
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
                      style={[styles.input, styles.editRowName]}
                      value={firstname}
                      onChangeText={setFirstname}
                    />
                    <TextInput
                      style={[styles.input, styles.editRowName]}
                      value={lastname}
                      onChangeText={setLastname}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Changer le mot de passe"
                  />
                </View>
              )}
              <View style={styles.userRowActions}>
                <TouchableOpacity
                  style={[styles.logoutButton, edit ? styles.logoutEdit : {}]}
                  onPress={edit ? save : logout}
                >
                  <Text style={styles.logoutButtonTxt}>
                    {edit ? 'Enregister' : 'Se Deconnecter'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={styles.devices}>
          {devices &&
            devices.map((d) => (
              <Device key={d.id} device={d} deleteDevice={deleteDevice} />
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
          {Constant.nativeBuildVersion}{' '}
        </Text>
      </View>
      <Snackbar
        visible={show}
        onDismiss={() => dispSnack(false)}
        duration={2000}
        style={styles.snack}
      >
        <Text style={styles.snackTxt}>{snackTxt}</Text>
      </Snackbar>
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
  editRowInfos: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  editRowName: { width: '45%' },
  input: {
    borderBottomColor: theme.colors.yellow,
    borderBottomWidth: 1,
    fontSize: 18,
    marginHorizontal: 5,
    marginVertical: 7,
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
  snack: {
    backgroundColor: theme.colors.blue
  },
  snackTxt: {
    color: theme.colors.white
  },
  logoutButtonTxt: {
    color: theme.colors.blue
  },
  logoutEdit: {
    backgroundColor: theme.colors.yellow
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
  userRowRightEdit: { paddingLeft: 10, width: '100%' },
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
    color: theme.colors.blue,
    fontSize: 12
  }
})

const mapToProps = (state: RootState) => ({
  user: state.user.user,
  devices: state.devices.devices
})

export default connect(mapToProps)(Settings)
