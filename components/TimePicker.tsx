import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'

import Modal from 'components/layout/Modal'
import theme from 'config/theme'
import { timeToString } from 'utils/time/timeManager'

type TimePickerProps = {
  open: boolean
  onClosePicker: (value: string | undefined) => Promise<void>
}

const TimePicker = ({ open, onClosePicker }: TimePickerProps): JSX.Element => {
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [neuvaine, setNeuvaine] = useState(false)

  const onCloseModal = (validated?: boolean) => {
    const date = new Date(Date.now())
    onClosePicker(
      validated
        ? timeToString({
            hour: hour + date.getTimezoneOffset() / 60,
            minute,
            repeat: !neuvaine,
            daysLeft: neuvaine ? 9 : 0
          })
        : undefined
    )
  }
  const upd8Hours = (value: string) => {
    const nb = +value
    if (nb < 0 || nb > 23) return
    setHour(nb)
  }
  const upd8Mins = (value: string) => {
    const nb = +value
    if (nb < 0 || nb > 60) return
    setMinute(nb)
  }

  return (
    <Modal open={open} onClose={() => onCloseModal()}>
      <View style={styles.actions}>
        <Feather.Button
          name="check"
          backgroundColor={theme.colors.blue}
          onPress={() => onCloseModal(true)}
        >
          <Text style={styles.buttonText}>Valider</Text>
        </Feather.Button>
        <Feather.Button
          name="x"
          backgroundColor={theme.colors.blue}
          onPress={() => onCloseModal()}
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </Feather.Button>
      </View>
      <View style={styles.inputs}>
        <TextInput
          style={styles.input}
          value={hour.toString()}
          onChangeText={upd8Hours}
          keyboardType="number-pad"
        />
        <Text style={styles.twoDots}>:</Text>
        <TextInput
          style={styles.input}
          value={minute.toString()}
          onChangeText={upd8Mins}
          keyboardType="number-pad"
        />
        <View style={styles.neuvaine}>
          <Checkbox
            value={neuvaine}
            onValueChange={setNeuvaine}
            color={theme.colors.white}
          />
          <Text style={styles.neuvaineText}>Neuvaine ?</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  actions: {
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '100%'
  },
  buttonText: {
    color: theme.colors.white
  },
  input: {
    borderBottomColor: theme.colors.white,
    borderBottomWidth: 1,
    borderTopColor: theme.colors.white,
    borderTopWidth: 1,
    color: theme.colors.white,
    fontSize: 32,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  inputs: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30,
    paddingHorizontal: 40
  },
  neuvaine: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20
  },
  neuvaineText: {
    color: theme.colors.white,
    fontSize: 16
  },
  twoDots: {
    color: theme.colors.white,
    fontSize: 32,
    marginHorizontal: 10
  }
})

export default TimePicker
