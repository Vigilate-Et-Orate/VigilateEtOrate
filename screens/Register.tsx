import React, { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import firebase from 'firebase'

import theme from 'config/theme'
import { TextInput } from 'react-native-gesture-handler'
import { registerCredentials } from 'utils/api/api_server'
import { connect, useDispatch } from 'react-redux'
import { userLogin } from 'red/actions/UserActions'
import { RootState } from 'red/reducers/RootReducer'
import { loadData } from 'components/layout/HomeRoutes'

const RegisterScreen = ({ keyboard }: { keyboard: boolean }): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [firstname, setFirsname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  /* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
  const register = async () => {
    setLoading(true)
    const res = await registerCredentials(email, firstname, lastname, password)
    if (!res) setLoading(false)
    await firebase.auth().signInWithEmailAndPassword(email, password)
    if (res) {
      dispatch(userLogin(res.token, res.user, true))
      setTimeout(() => {}, 500)
      loadData(
        dispatch,
        (_n: number) => {},
        (_b: boolean) => {}
      )
      setLoading(false)
      navigation.navigate('Home')
    }
  }
  /* eslint-enable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

  return (
    <View style={styles.background}>
      {!keyboard && (
        <>
          <Image
            style={{
              position: 'absolute',
              top: '8%',
              left: '10%',
              width: '30%',
              height: '25%',
              zIndex: 12
            }}
            source={require('../assets/icon.png')}
          />
          <Image
            style={{
              position: 'absolute',
              top: '8%',
              right: '10%',
              width: '15%',
              height: '25%',
              zIndex: 10
            }}
            source={require('../assets/candle.png')}
          />
        </>
      )}
      <View style={[styles.card, keyboard ? styles.cardUp : styles.cardDown]}>
        <Text style={styles.title}>Créer un compte</Text>
        <View style={styles.inputs}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.blue}
          />
          <TextInput
            value={firstname}
            onChangeText={setFirsname}
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor={theme.colors.blue}
          />
          <TextInput
            value={lastname}
            onChangeText={setLastname}
            style={styles.input}
            placeholder="Nom de famille"
            placeholderTextColor={theme.colors.blue}
          />
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Mot de Passe"
            placeholderTextColor={theme.colors.blue}
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.arrowButton} onPress={register}>
            {loading && (
              <ActivityIndicator size="large" color={theme.colors.blue} />
            )}
            {!loading && (
              <FontAwesome5
                name="arrow-right"
                size={40}
                color={theme.colors.blue}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={keyboard ? styles.hidden : styles.register}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={{ color: theme.colors.white }}>Déjà un compte ?</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  cardUp: {
    height: '100%',
    marginTop: '5%'
  },
  cardDown: {
    height: '60%',
    marginTop: '65%'
  },
  card: {
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    paddingHorizontal: '10%',
    zIndex: 30
  },
  title: {
    textAlign: 'left',
    fontSize: 36,
    color: theme.colors.blue,
    marginVertical: '7%'
  },
  hidden: {
    display: 'none'
  },
  register: {
    position: 'absolute',
    left: 0,
    bottom: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '6%',
    zIndex: 40
  },
  input: {
    backgroundColor: theme.colors.white + '33',
    opacity: 5,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.blue
  },
  inputs: {
    marginTop: '8%',
    marginBottom: '15%'
  },
  actions: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  arrowButton: {
    borderRadius: 500,
    backgroundColor: theme.colors.lightBlue,
    width: 90,
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7
  }
})

const mapToProps = (state: RootState) => ({
  keyboard: state.keyboard
})

export default connect(mapToProps)(RegisterScreen)
