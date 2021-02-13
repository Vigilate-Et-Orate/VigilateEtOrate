import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import * as Analytics from 'expo-firebase-analytics'
import { MaterialIcons } from '@expo/vector-icons'

import { TIntention } from 'config/types/Intention'
import theme from 'config/theme'
import { removeIntentions } from 'utils/api/api_firebase'
import { connect, useDispatch } from 'react-redux'
import { deleteIntentions } from 'red/actions/IntentionsActions'
import { RootState } from 'red/reducers/RootReducer'

// Types
export type IntentionCardProps = {
  intention: TIntention
  onLongPress: () => void
}

export type WriteIntentionProps = {
  addIntention: (intention: string) => void
  keyboard: boolean
}

// Components
export const IntentionCard = ({
  intention,
  onLongPress
}: IntentionCardProps): JSX.Element => {
  const dispatch = useDispatch()

  return (
    <TouchableOpacity style={styles.cardIntention} onLongPress={onLongPress}>
      <View style={styles.cardIntentionLeft}>
        <Text>{intention.intention}</Text>
      </View>
      <TouchableOpacity
        style={styles.cardRightButton}
        onPress={() => {
          Analytics.logEvent('intention', {
            type: 'dismissed'
          })
          removeIntentions(intention.id)
          dispatch(deleteIntentions(intention))
        }}
      >
        <MaterialIcons name="done" size={20} color="green" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const WriteIntentionComp = ({
  addIntention,
  keyboard
}: WriteIntentionProps): JSX.Element => {
  const [intention, onIntentionChange] = useState('')

  const handleAddingIntention = () => {
    addIntention(intention)
    onIntentionChange('')
  }

  return (
    <View style={styles.card}>
      <TextInput
        placeholderTextColor={theme.colors.white + 'd4'}
        style={[
          styles.input,
          keyboard || intention !== '' ? { width: '75%' } : { width: '100%' }
        ]}
        onChangeText={onIntentionChange}
        value={intention}
        multiline
        placeholder="Ajouter une intention"
      />
      {(keyboard || intention !== '') && (
        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddingIntention}
          >
            <Text style={{ color: theme.colors.white }}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
const mapToProps = (state: RootState) => ({
  keyboard: state.keyboard
})
export const WriteIntention = connect(mapToProps)(WriteIntentionComp)

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 6,
    color: theme.colors.green
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: theme.colors.green,
    borderRadius: 20,
    elevation: 12
  },
  cardRightButton: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    paddingHorizontal: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c4c4'
  },
  cardIntentionLeft: {
    flex: 10,
    flexDirection: 'column',
    paddingVertical: 10,
    paddingRight: 10
  },
  card: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: theme.colors.blue,
    borderWidth: 1,
    borderColor: theme.colors.white + 'd4',
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  cardIntention: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 17,
    backgroundColor: theme.colors.white + 'd4',
    marginVertical: 5,
    flexDirection: 'row'
  },
  input: {
    opacity: 5,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: theme.colors.white
  }
})
