import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { TIntention } from 'config/types/TIntention'
import theme from 'config/theme'
import { connect } from 'react-redux'
import { RootState } from 'red/reducers/RootReducer'

// Types
export type IntentionCardProps = {
  intention: TIntention
  hasNotif: boolean
  onPress: () => void
}

export type WriteIntentionProps = {
  addIntention: (intention: string) => void
  keyboard: boolean
}

// Components
export const IntentionCard = ({
  intention,
  hasNotif,
  onPress
}: IntentionCardProps): JSX.Element => (
  <TouchableOpacity style={styles.cardIntention}>
    <View style={styles.cardIntentionLeft}>
      <Text>{intention.intention}</Text>
    </View>
    <TouchableOpacity style={styles.cardRightButton} onPress={onPress}>
      {hasNotif && (
        <MaterialCommunityIcons
          name="bell"
          size={15}
          color={theme.colors.blue}
        />
      )}
      <MaterialCommunityIcons name="dots-vertical" size={25} color="green" />
    </TouchableOpacity>
  </TouchableOpacity>
)

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
    backgroundColor: theme.colors.green,
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
    alignItems: 'center'
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
