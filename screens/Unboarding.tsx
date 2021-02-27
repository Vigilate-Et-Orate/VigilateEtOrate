import React from 'react'
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import theme from 'config/theme'

const Unboarding = (): JSX.Element => {
  const navigation = useNavigation()

  return (
    <View>
      <Image
        style={styles.image}
        source={require('../assets/Unboarding.png')}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.text}>Continuer</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 50,
    elevation: 40,
    left: '15%',
    paddingHorizontal: 30,
    paddingVertical: 15,
    position: 'absolute',
    top: '30%',
    zIndex: 40
  },
  image: {
    height: '100%',
    width: '100%'
  },
  text: {
    color: theme.colors.white,
    fontSize: 22
  }
})

export default Unboarding
