import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent
} from 'react-native'

import theme from 'config/theme'
import { useNavigation } from '@react-navigation/native'

type CardProps = {
  title: string
  body: string
  onPress: (ev: GestureResponderEvent) => void | null
}

type WelcomeCardProps = {
  saint: string
  evangile: string
}

const Card = ({ title, body, onPress }: CardProps) => {
  return (
    <View>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Text style={styles.Title}>{title}</Text>
        <Text style={styles.description}>{body}</Text>
      </TouchableOpacity>
    </View>
  )
}

export const WelcomeCard = ({ saint, evangile }: WelcomeCardProps) => {
  const navigation = useNavigation()
  return (
    <View style={styles.card}>
      <Text style={styles.Title}>Saint Du Jour</Text>
      <Text style={styles.description}>{saint}</Text>
      <Text style={styles.Title}>Phrase de l'Evangile du Jour</Text>
      <Text style={styles.description}>{evangile}</Text>
      <TouchableOpacity
        style={{ alignSelf: 'flex-end', padding: 10 }}
        onPress={() => navigation.navigate('PersonnalPrayer')}
      >
        <Text style={styles.see}>
          Voir l'Evangile
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    margin: 10,
    shadowOffset: {
      width: 50,
      height: 50
    },
    shadowColor: theme.colors.gray
  },
  Title: {
    fontSize: 20,
    marginBottom: 5,
    color: theme.colors.blue
  },
  see: {
    marginVertical: 5,
    alignItems: 'flex-end',
    color: theme.colors.red
  },
  description: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 12,
    color: theme.colors.gray
  }
})

export default Card
