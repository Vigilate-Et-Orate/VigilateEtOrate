import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import theme from 'config/theme'
import { TextInput } from 'react-native-gesture-handler'
import { signInCredentials } from 'utils/api/api_server'

const SignInScreen = (): JSX.Element => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    const res = await signInCredentials(email, password)
    if (res) {
      navigation.navigate('Home')
    }
  }

  return (
    <View style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.title}>Se Connecter</Text>
        <View style={styles.inputs}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
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
          <TouchableOpacity style={styles.arrowButton} onPress={signIn}>
            <FontAwesome5
              name="arrow-right"
              size={40}
              color={theme.colors.blue}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.register}>Pas de compte ?</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  card: {
    height: '60%',
    marginTop: '70%',
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    paddingHorizontal: '10%'
  },
  title: {
    textAlign: 'left',
    fontSize: 36,
    color: theme.colors.blue,
    marginVertical: '7%'
  },
  register: {
    position: 'absolute',
    left: 0,
    bottom: 30,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    color: theme.colors.white
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
    marginTop: '15%',
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

export default SignInScreen
