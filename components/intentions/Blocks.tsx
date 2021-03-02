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

import { TIntention } from 'config/types/TIntention'
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
          keyboard || intention !== ''
            ? styles.inputClosedWidth
            : styles.inputOpenedWidth
        ]}
        onChangeText={onIntentionChange}
        value={intention}
        multiline
        placeholder="Ajouter une intention"
      />
      {(keyboard || intention !== '') && (
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddingIntention}
          >
            <Text style={styles.buttonText}>Ajouter</Text>
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
  button: {
    backgroundColor: theme.colors.purple,
    borderRadius: 20,
    elevation: 12,
    paddingHorizontal: 15,
    paddingVertical: 7
  },
  buttonText: {
    color: theme.colors.white
  },
  buttonView: {
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.white + 'd4',
    borderRadius: 30,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  cardIntention: {
    backgroundColor: theme.colors.white + 'd4',
    borderRadius: 30,
    elevation: 17,
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 25,
    paddingVertical: 10
  },
  cardIntentionLeft: {
    flex: 10,
    flexDirection: 'column',
    paddingVertical: 10,
    paddingRight: 10
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
    backgroundColor: theme.colors.gray
  },
  input: {
    borderRadius: 3,
    color: theme.colors.white,
    opacity: 5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  inputClosedWidth: {
    width: '75%'
  },
  inputOpenedWidth: {
    width: '100%'
  }
})
