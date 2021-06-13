import React, { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native'
import { Snackbar } from 'react-native-paper'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { connect, useDispatch } from 'react-redux'

import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { updateUser } from 'red/actions/UserActions'
import { loadData } from 'utils/loadData/loadData'
import VOFire from 'utils/api/api_firebase'

export const formatEmail = (s: string): string => {
  const char = s.charAt(s.length - 1)
  let final = s
  if (char === ' ') final = s.slice(0, -1)
  final = final.toLowerCase()
  return final
}

const SignInScreen = ({ keyboard }: { keyboard: boolean }): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const api = new VOFire()

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [snackTxt, setSnackTxt] = useState('')
  const [show, dispSnack] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [sent, setSent] = useState(false)

  /* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars  */
  const signIn = async () => {
    setLoading(true)
    const _email = formatEmail(email)
    setEmail(_email)
    const res = await api.users.signIn(_email, password)
    if (typeof res == 'string') {
      setSnackTxt(res)
      dispSnack(true)
      setLoading(false)
      return
    }
    if (!res) {
      const user = await api.users.get()
      if (user) dispatch(updateUser(user, false))
      loadData(dispatch, () => {})
      setLoading(false)
      navigation.navigate('Home')
    }
  }
  /* eslint-enable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars  */
  const resetEmail = async () => {
    if (!email) {
      setSnackTxt('Veuillez entrer une adresse email')
      dispSnack(true)
      return
    }
    const _email = formatEmail(email)
    setEmail(_email)
    const res = await api.users.resetEmail(_email)
    if (typeof res == 'string') {
      setSnackTxt(res)
      dispSnack(true)
      return
    }
    setSent(true)
    setTimeout(() => setResetting(false), 2000)
  }

  return (
    <View style={styles.background}>
      {!keyboard && (
        <>
          <Image style={styles.image2} source={require('../assets/icon.png')} />
          <Image
            style={styles.image}
            source={require('../assets/candle.png')}
          />
        </>
      )}
      <View style={[styles.card, keyboard ? styles.cardUp : styles.cardDown]}>
        <Text
          style={[
            styles.title,
            keyboard ? styles.titleOpen : styles.titleClosed
          ]}
        >
          Se Connecter
        </Text>
        <View
          style={[
            styles.inputs,
            keyboard ? styles.inputsOpen : styles.inputsClosed
          ]}
        >
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.blue}
          />
          {!resetting && (
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Mot de Passe"
              placeholderTextColor={theme.colors.blue}
            />
          )}
        </View>
        <View style={styles.actions}>
          {!resetting && (
            <TouchableOpacity style={styles.arrowButton} onPress={signIn}>
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
          )}
          {!resetting && (
            <TouchableOpacity
              onPress={() => setResetting(true)}
              style={styles.reset}
            >
              <Text style={styles.resetTxt}>Mot de passe oublié?</Text>
            </TouchableOpacity>
          )}
          {resetting && (
            <TouchableOpacity
              onPress={resetEmail}
              style={styles.resetButton}
              disabled={sent}
            >
              <Text style={styles.resetButtonText}>
                {sent ? 'Envoyé !' : 'Réinitialiser le mot de passe'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {!keyboard && (
        <TouchableOpacity
          style={styles.register}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ color: theme.colors.white }}>Pas de compte ?</Text>
        </TouchableOpacity>
      )}
      <Snackbar
        visible={show}
        onDismiss={() => dispSnack(false)}
        duration={1000}
        style={styles.snack}
      >
        <Text style={styles.snackTxt}>{snackTxt}</Text>
      </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  actions: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  arrowButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 500,
    display: 'flex',
    elevation: 10,
    height: 90,
    justifyContent: 'center',
    width: 90,
    zIndex: 40
  },
  background: {
    backgroundColor: theme.colors.blue,
    height: '100%'
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    paddingHorizontal: '10%',
    zIndex: 15
  },
  cardDown: {
    height: '60%',
    marginTop: '65%'
  },
  cardUp: {
    height: '110%'
  },
  image: {
    height: '25%',
    position: 'absolute',
    right: '10%',
    top: '8%',
    width: '15%',
    zIndex: 10
  },
  image2: {
    height: '25%',
    left: '10%',
    position: 'absolute',
    top: '8%',
    width: '30%',
    zIndex: 12
  },
  input: {
    backgroundColor: theme.colors.white + '33',
    borderBottomColor: theme.colors.blue,
    borderBottomWidth: 2,
    borderRadius: 3,
    marginVertical: 10,
    opacity: 5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  inputs: {
    marginBottom: '15%'
  },
  inputsClosed: { marginTop: '15%' },
  inputsOpen: { marginTop: '2%' },
  register: {
    alignItems: 'center',
    bottom: 20,
    display: 'flex',
    flexDirection: 'row',
    height: '5%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 2
  },
  reset: {
    alignItems: 'center',
    borderRadius: 20,
    padding: 15
  },
  resetButton: {
    borderColor: theme.colors.blue,
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  resetButtonText: {
    color: theme.colors.blue
  },
  resetTxt: {
    color: theme.colors.blue
  },
  snack: {
    backgroundColor: theme.colors.white
  },
  snackTxt: {
    color: theme.colors.blue
  },
  title: {
    color: theme.colors.blue,
    fontSize: 36,
    textAlign: 'left'
  },
  titleClosed: { marginVertical: '7%' },
  titleOpen: { marginVertical: '12%' }
})

const mapToProps = (state: RootState) => ({
  keyboard: state.keyboard
})

export default connect(mapToProps)(SignInScreen)
