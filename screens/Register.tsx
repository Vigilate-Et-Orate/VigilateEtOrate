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
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { connect, useDispatch } from 'react-redux'
import firebase from 'firebase'

import theme from 'config/theme'
import { userLogin } from 'red/actions/UserActions'
import { RootState } from 'red/reducers/RootReducer'
import { registerCredentials } from 'utils/api/api_server'
import { loadData } from 'utils/loadData/loadData'
import { formatEmail } from 'screens/SignIn'

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
    let _email = formatEmail(email)
    setEmail(_email)
    const res = await registerCredentials(_email, firstname, lastname, password)
    if (!res) setLoading(false)
    await firebase.auth().signInWithEmailAndPassword(_email, password)
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
          <Image style={styles.image2} source={require('../assets/icon.png')} />
          <Image
            style={styles.image}
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
  actions: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row-reverse'
  },
  arrowButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 500,
    display: 'flex',
    elevation: 7,
    height: 90,
    justifyContent: 'center',
    width: 90
  },
  background: {
    backgroundColor: theme.colors.blue,
    height: '100%'
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    paddingHorizontal: '10%',
    zIndex: 30
  },
  cardDown: {
    height: '60%',
    marginTop: '65%'
  },
  cardUp: {
    height: '100%',
    marginTop: '5%'
  },
  hidden: {
    display: 'none'
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
    marginBottom: '15%',
    marginTop: '8%'
  },
  register: {
    alignItems: 'center',
    bottom: 20,
    display: 'flex',
    flexDirection: 'row',
    height: '6%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 40
  },
  title: {
    color: theme.colors.blue,
    fontSize: 36,
    marginVertical: '7%',
    textAlign: 'left'
  }
})

const mapToProps = (state: RootState) => ({
  keyboard: state.keyboard
})

export default connect(mapToProps)(RegisterScreen)
