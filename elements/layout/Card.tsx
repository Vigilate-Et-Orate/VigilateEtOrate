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
  title?: string
  body: string
  onPress: (ev: GestureResponderEvent) => void | null
}

type WelcomeCardProps = {
  evangile: string
}

const Card = ({ title, body, onPress }: CardProps): JSX.Element => {
  return (
    <View>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {title && <Text style={styles.Title}>{title}</Text>}
        <Text style={styles.description}>{body}</Text>
      </TouchableOpacity>
    </View>
  )
}

export const WelcomeCard = ({ evangile }: WelcomeCardProps): JSX.Element => {
  const navigation = useNavigation()
  return (
    <View style={styles.card}>
      <Text style={styles.Title}>Phrase de l&apos;Evangile du Jour</Text>
      <Text style={styles.description}>{evangile}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Evangile')}
      >
        <Text style={styles.see}>Voir l&apos;Evangile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  Title: {
    color: theme.colors.blue,
    fontSize: 18,
    marginBottom: 3
  },
  button: {
    alignSelf: 'flex-end',
    padding: 5
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    elevation: 15,
    margin: 5,
    paddingBottom: 7,
    paddingHorizontal: 12,
    paddingTop: 12
  },
  description: {
    color: theme.colors.blue,
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 8
  },
  see: {
    alignItems: 'flex-end',
    backgroundColor: theme.colors.blue,
    borderRadius: 20,
    color: theme.colors.yellow,
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 10
  }
})

export default Card
