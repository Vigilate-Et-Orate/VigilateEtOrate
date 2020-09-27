import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Image,
  ScrollView
} from 'react-native'
import { BlurView } from 'expo-blur'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import * as Storage from 'utils/storage/StorageManager'
import theme from 'config/theme'

const Settings = (): JSX.Element => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={styles.background}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <BlurView intensity={300} style={styles.modal}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                backgroundColor: theme.colors.blue,
                padding: 5,
                borderRadius: 30
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={theme.colors.white}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginBottom: 10,
                color: theme.colors.blue,
                fontSize: 18
              }}
            >
              Ceci est une opération destructive. Attention cela supprimera
              toutes vos données et souscriptions !
            </Text>
            <Text style={{ color: theme.colors.red, fontSize: 16 }}>
              Êtes vous sûr de vouloir tout effacer ?
            </Text>
            <View style={{ flexDirection: 'row-reverse', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  Storage.clear()
                  setModalVisible(!modalVisible)
                  ToastAndroid.showWithGravity(
                    'Cache supprimé',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  )
                }}
              >
                <Text style={{ color: theme.colors.white, fontSize: 18 }}>
                  Oui
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
      <View style={styles.header}>
        <View
          style={{ flexDirection: 'row', height: '60%', position: 'relative' }}
        >
          <View style={{ position: 'absolute', top: 20, left: '20%' }}>
            <Image
              style={{ width: 80, height: 70 }}
              source={require('../assets/newIconolive.png')}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
            height: '40%',
            paddingHorizontal: 40
          }}
        >
          <Text style={{ color: '#f6f4f4', fontSize: 32 }}>Paramètres</Text>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '12%',
            left: '2%',
            elevation: 20,
            zIndex: 90
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={40}
            color={theme.colors.white}
          />
        </TouchableOpacity>
        <View style={styles.roundedView}>
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Button
              onPress={() => {
                setModalVisible(true)
              }}
              color={theme.colors.red}
              title="Clear Cache and Notification Subscriptions"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    paddingTop: '45%',
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  modalButton: {
    borderRadius: 30,
    backgroundColor: theme.colors.red,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  body: {
    height: '125%'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '15%',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30
  },
  roundedView: {
    marginTop: '40%',
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    paddingTop: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 35,
    height: '100%'
  }
})

export default Settings
