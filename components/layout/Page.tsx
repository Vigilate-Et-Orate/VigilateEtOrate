import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import theme from 'config/theme'

export type PageProps = {
  title: string
  children: JSX.Element
  heart?: boolean
  onPress?: () => Promise<void>
  faved?: boolean
}

const Page = ({
  title,
  heart,
  onPress,
  faved,
  children
}: PageProps): JSX.Element => {
  const navigation = useNavigation()

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        {heart && (
          <TouchableOpacity
            style={{ position: 'absolute', top: '30%', right: '5%' }}
            onPress={onPress}
          >
            <MaterialCommunityIcons
              name="heart"
              color={faved ? theme.colors.red : theme.colors.white}
              size={40}
            />
          </TouchableOpacity>
        )}
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
              source={require('../../assets/newIconolive.png')}
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
          <Text style={{ color: '#f6f4f4', fontSize: 32 }}>{title}</Text>
        </View>
      </View>
      <View style={styles.roundedView}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  header: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30
  },
  roundedView: {
    backgroundColor: '#f6f4f4',
    flex: 5,
    borderRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20
  }
})

export default Page
