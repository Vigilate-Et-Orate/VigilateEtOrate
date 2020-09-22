import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  ScrollView
} from 'react-native'
import * as Analytics from 'expo-firebase-analytics'

import * as Storage from 'utils/storage/StorageManager'
import { MyPrayer } from 'config/types/Prayer'
import { Header } from 'elements/text/Text'
import theme from 'config/theme'

const Profile = (): JSX.Element => {
  const [modalVisible, setModalVisible] = useState(false)
  const [firstName, onFirstNameChange] = useState('')
  const [prayerTitle, onPrayerTitleChange] = useState('')
  const [prayerContent, onPrayerContentChange] = useState('')

  useEffect(() => {
    Storage.getDataAsync(Storage.Stored.MY_PRAYER).then((data) => {
      if (!data) return
      const myPrayer: MyPrayer = JSON.parse(data)
      onPrayerTitleChange(myPrayer.title)
      onPrayerContentChange(myPrayer.content)
    })
    Storage.getDataAsync(Storage.Stored.FIRSTNAME).then((data) => {
      if (!data) return
      onFirstNameChange(data)
    })
  }, [])

  const saveAllData = () => {
    const prayer: MyPrayer = {
      title: prayerTitle,
      content: prayerContent
    }
    Storage.setDataAsync(Storage.Stored.MY_PRAYER, JSON.stringify(prayer))
    Storage.setDataAsync(Storage.Stored.FIRSTNAME, firstName)
    Analytics.logEvent('profile', {
      type: 'updatedPersonnal Information'
    })
    ToastAndroid.showWithGravity(
      'Sauvergardé avec succès !',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    )
  }

  return (
    <ScrollView style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end' }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>X</Text>
            </TouchableOpacity>
            <Text style={{ marginBottom: 10 }}>
              Ceci est une opération destructive. Attention cela supprimera
              toutes vos données et souscriptions !
            </Text>
            <Button
              color="red"
              title="Oui Supprimer toutes les souscriptions"
              onPress={() => {
                Storage.clear()
                setModalVisible(!modalVisible)
                ToastAndroid.showWithGravity(
                  'Cache supprimé',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                )
              }}
            />
          </View>
        </View>
      </Modal>
      <View style={{ marginBottom: 15 }}>
        <Header>Informations Personnelles</Header>
        <Text style={styles.Label}>Prénom</Text>
        <TextInput
          style={styles.Input}
          onChangeText={onFirstNameChange}
          value={firstName}
        />
      </View>
      <View style={{ marginBottom: 15 }}>
        <Header>Ma Prière Personnelle</Header>
        <Text style={styles.Label}>Titre</Text>
        <TextInput
          style={styles.Input}
          onChangeText={onPrayerTitleChange}
          value={prayerTitle}
        />
        <Text style={styles.Label}>La Prière</Text>
        <TextInput
          style={styles.Input}
          onChangeText={onPrayerContentChange}
          value={prayerContent}
          multiline
        />
      </View>
      <View style={{ flexDirection: 'row-reverse', marginBottom: 20 }}>
        <View style={{ width: '40%' }}>
          <Button
            title="Enregistrer"
            color={theme.colors.yellow}
            onPress={saveAllData}
          />
        </View>
      </View>
      <Button
        onPress={() => {
          setModalVisible(true)
        }}
        color={theme.colors.red}
        title="Clear Cache and Notification Subscriptions"
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  Input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: theme.colors.blue
  },
  TextInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: theme.colors.blue,
    height: 150
  },
  Label: {
    marginLeft: 10,
    color: theme.colors.blue,
    fontSize: 14,
    marginTop: 10
  }
})

export default Profile
