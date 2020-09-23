import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import * as Analytics from 'expo-firebase-analytics'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import { Intention } from 'config/types/Intention'
import { RoundedFilledButton } from 'elements/buttons/Buttons'
import theme from 'config/theme'

// Types
export type IntentionCardProps = {
  intention: Intention
  removeIntention: (slug: string) => void
  key: string
}

export type WriteIntentionProps = {
  addIntention: (title: string, intention: string) => void
}

// Components
export const IntentionCard = ({
  intention,
  removeIntention,
  key
}: IntentionCardProps): JSX.Element => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      key={key}
      style={styles.cardIntention}
      onLongPress={() => navigation.navigate('Intention', { intention })}
    >
      <View style={styles.cardIntentionLeft}>
        <Text style={styles.title}>{intention.title}</Text>
        <Text>{intention.intention}</Text>
      </View>
      <TouchableOpacity
        style={styles.cardRightButton}
        onPress={() => {
          Analytics.logEvent('intention', {
            type: 'dismissed'
          })
          removeIntention(intention.slug)
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <MaterialIcons name="done" size={20} color="green" />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export const WriteIntention = ({
  addIntention
}: WriteIntentionProps): JSX.Element => {
  const [title, onTitleChange] = useState('')
  const [intention, onIntentionChange] = useState('')

  return (
    <View style={styles.card}>
      <TextInput
        placeholderTextColor={theme.colors.green}
        style={styles.input}
        onChangeText={onTitleChange}
        value={title}
        placeholder="Titre de l'intention"
      />
      <TextInput
        placeholderTextColor={theme.colors.green}
        style={styles.input}
        onChangeText={onIntentionChange}
        value={intention}
        placeholder="Intention"
      />
      <View style={{ flexDirection: 'row-reverse', marginTop: 25 }}>
        <RoundedFilledButton
          style={{ backgroundColor: theme.colors.lightGreen }}
          onPress={() => {
            Analytics.logEvent('intention', {
              type: 'new'
            })
            addIntention(title, intention)
            onTitleChange('')
            onIntentionChange('')
          }}
        >
          <Text>Ajouter</Text>
        </RoundedFilledButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 6,
    color: theme.colors.green
  },
  cardRightButton: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    paddingHorizontal: 5
  },
  cardIntentionLeft: {
    flex: 10,
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: theme.colors.green + 'c4',
    paddingVertical: 10,
    paddingRight: 10
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 15,
    backgroundColor: theme.colors.white + 'd4',
    shadowOffset: { width: 0, height: 5 },
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 20,
    margin: 10,
    flexDirection: 'column'
  },
  cardIntention: {
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: theme.colors.green,
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    marginVertical: 5,
    flexDirection: 'row'
  },
  input: {
    backgroundColor: theme.colors.white + 'a4',
    opacity: 5,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.green
  }
})
