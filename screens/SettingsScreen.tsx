import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Image,
  ScrollView
} from 'react-native'
import { BlurView } from 'expo-blur'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'

import * as Storage from 'utils/storage/StorageManager'
import theme from 'config/theme'
import {
  MyPrayerBlock,
  FirstnameBlock
} from 'components/prayers/PersonnalBlock'
import { PrayerBlockManageNotification } from 'components/prayers/Block'
import { Prayer } from 'config/types/Prayer'
import * as LocalNotification from 'utils/notification/LocalNotification'

const HorizontalLine = (): JSX.Element => (
  <View
    style={{
      borderBottomColor: theme.colors.blue,
      borderBottomWidth: 1,
      marginVertical: 20
    }}
  ></View>
)

const Settings = (): JSX.Element => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  const [data, setData] = useState<Prayer[]>()
  const [date, setDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState('')
  let _isMounted: boolean

  const onReactivate = (name: string) => {
    setCurrentPrayer(name)
    setShow(true)
  }

  const onDateChange = (event: any, selectedDate?: Date | undefined) => {
    if (!event) return
    const currentDate = selectedDate || date
    setDate(currentDate)
    setShow(false)
    LocalNotification.registerForPrayer(currentPrayer, currentDate)
    setCurrentPrayer('')
  }

  useEffect(() => {
    _isMounted = true
    Storage.getDataAsync(Storage.Stored.SUBS).then((res) => {
      if (!res) {
        setData([])
        return
      }
      setData(JSON.parse(res))
    })
    return () => {
      if (_isMounted) _isMounted = false
    }
  }, [])

  return (
    <View style={styles.background}>
      {show && (
        <DateTimePicker
          mode="time"
          value={date}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
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
                  navigation.goBack()
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
            top: '3%',
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
          <Text style={styles.title}>Prénom</Text>
          <FirstnameBlock settings />
          <Text style={styles.title}>Ma Prière Personnelle</Text>
          <MyPrayerBlock settings />
          <HorizontalLine />
          <Text style={styles.title}>Données de l&apos;application</Text>
          <Text>
            Les données dont les intentions, les rappels, les prières favorites,
            votre prière personnelle. Ici vous pouvez toutes ces données.{' '}
            <Text style={{ color: theme.colors.red, fontSize: 16 }}>
              Attention
            </Text>{' '}
            c&apos;est irréversible !
          </Text>
          <View style={{ flexDirection: 'row-reverse' }}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: theme.colors.white, fontSize: 16 }}>
                Suprimer
              </Text>
            </TouchableOpacity>
          </View>
          <HorizontalLine />
          <Text style={styles.title}>Notifications</Text>
          {data &&
            data.map((p: Prayer) => {
              return (
                <PrayerBlockManageNotification
                  onReactivate={onReactivate}
                  prayer={p}
                  key={p.name}
                />
              )
            })}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  deleteButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: theme.colors.red,
    marginRight: 25
  },
  title: {
    fontSize: 24,
    color: theme.colors.blue,
    marginVertical: 10
  },
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
    flexDirection: 'column',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 35
  }
})

export default Settings
