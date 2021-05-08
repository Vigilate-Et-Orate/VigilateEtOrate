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
import { updateUser } from 'red/actions/UserActions'
import { RootState } from 'red/reducers/RootReducer'
import { loadData } from 'utils/loadData/loadData'
import { formatEmail } from 'screens/SignIn'
import VOFire from 'utils/api/api_firebase'

const RegisterScreen = ({ keyboard }: { keyboard: boolean }): JSX.Element => {
  const navigation = useNavigation()
  const api = new VOFire()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [pwdError, setPwdError] = useState(false)
  const [firstname, setFirsname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [snackTxt, setSnackTxt] = useState('')
  const [show, dispSnack] = useState(false)

  /* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
  const register = async () => {
    setLoading(true)
    const _email = formatEmail(email)
    setEmail(_email)
    if (password != passwordConfirmation) {
      setLoading(false)
      setPwdError(true)
      setSnackTxt('Les mots de passes sont différents')
      dispSnack(true)
      return
    }
    const user = {
      id: '',
      email: _email,
      firstname: firstname,
      lastname: lastname,
      admin: false
    }
    const res = await api.users.create(user, password)
    if (!res) setLoading(false)
    if (typeof res == 'string') {
      setSnackTxt(res)
      dispSnack(true)
      setLoading(false)
      return
    }
    if (res) {
      dispatch(updateUser(res, true))
      setTimeout(() => {}, 500)
      loadData(dispatch, () => {})
      setLoading(false)
      navigation.navigate('Home')
    }
  }
  /* eslint-enable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
  const validatePwd = () => {
    if (password != passwordConfirmation) setPwdError(true)
    else if (pwdError == true) setPwdError(false)
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
          Créer un compte
        </Text>
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
            onChangeText={(txt: string) => {
              validatePwd()
              setPassword(txt)
            }}
            style={[
              styles.input,
              pwdError ? { borderBottomColor: theme.colors.red } : {}
            ]}
            placeholder="Mot de Passe"
            placeholderTextColor={theme.colors.blue}
          />
          <TextInput
            secureTextEntry
            value={passwordConfirmation}
            onChangeText={(txt: string) => {
              validatePwd()
              setPasswordConfirmation(txt)
            }}
            style={[
              styles.input,
              pwdError ? { borderBottomColor: theme.colors.red } : {}
            ]}
            placeholder="Confirmation du Mot de Passe"
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
      <Snackbar
        style={styles.snack}
        visible={show}
        onDismiss={() => dispSnack(false)}
        duration={1000}
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
    height: '65%',
    marginTop: '50%'
  },
  cardUp: {
    height: '110%',
    marginTop: '0%'
  },
  hidden: {
    display: 'none'
  },
  image: {
    height: '25%',
    position: 'absolute',
    right: '10%',
    top: '2%',
    width: '15%',
    zIndex: 10
  },
  image2: {
    height: '25%',
    left: '10%',
    position: 'absolute',
    top: '2%',
    width: '30%',
    zIndex: 12
  },
  input: {
    backgroundColor: theme.colors.white + '33',
    borderBottomColor: theme.colors.blue,
    borderBottomWidth: 2,
    borderRadius: 3,
    marginVertical: 7,
    opacity: 5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  inputs: {
    marginBottom: '10%',
    marginTop: '2%'
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
  titleClosed: { marginTop: '7%' },
  titleOpen: { marginTop: '12%' }
})

const mapToProps = (state: RootState) => ({
  keyboard: state.keyboard
})

export default connect(mapToProps)(RegisterScreen)
