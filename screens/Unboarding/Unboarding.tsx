import React from 'react'
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native'

import theme from 'config/theme'
import { useNavigation } from '@react-navigation/native'

const Unboarding = (): JSX.Element => {
  const navigation = useNavigation()

  return (
    <View>
      <Image
        style={{
          width: '100%',
          height: '100%'
        }}
        source={require('../../assets/Unboarding.png')}
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
    position: 'absolute',
    zIndex: 40,
    elevation: 40,
    top: '30%',
    backgroundColor: theme.colors.lightBlue,
    left: '15%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50
  },
  text: {
    fontSize: 22,
    color: theme.colors.white
  }
})

export default Unboarding
