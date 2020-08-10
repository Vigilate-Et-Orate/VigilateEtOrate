import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Button, View } from 'react-native'

import { Title } from 'elements/text/Text'

const PrayersScreen = () => {
  const navigation = useNavigation()

  return (
    <View>
      <Title>Prayers</Title>
      <Button
        color={styles.button.color}
        title="Angelus"
        onPress={() => navigation.navigate('Angelus')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    color: '#35415A'
  }
})

export default PrayersScreen
