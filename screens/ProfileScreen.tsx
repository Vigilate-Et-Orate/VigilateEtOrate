import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from 'react-native'

import * as Storage from 'utils/storage/StorageManager'

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={{ paddingHorizontal: '20%', marginTop: 20 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Closing Modal')
        }}
      >
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
      <Button
        onPress={() => {
          setModalVisible(true)
          // Storage.clear()
        }}
        color="red"
        title="Clear Cache and Notification Subscriptions"
      />
    </View>
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
  }
})

export default Profile
