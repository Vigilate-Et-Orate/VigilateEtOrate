import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import theme from 'config/theme'

const Page = (): JSX.Element => {
  const navigation = useNavigation()

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', height: '30%' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={40} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={{ flexDirection: 'row', height: '30%', position: 'relative' }}
        >
          <View style={{ position: 'absolute', top: 0, left: '25%' }}>
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
          <Text style={{ color: '#f6f4f4', fontSize: 32 }}>{'Test'}</Text>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.roundedView}>
          <View
            style={{
              backgroundColor: theme.colors.blue,
              width: 25,
              height: 100
            }}
          ></View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue,
    position: 'relative'
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
    backgroundColor: '#f6f4f4',
    borderRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    height: '100%'
  }
})

export default Page
