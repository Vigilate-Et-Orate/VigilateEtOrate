import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  ScrollView,
  View,
  RefreshControl
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { TNominisSaint } from 'config/types/Nominis'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { loadData } from 'utils/loadData/loadData'
import { useNavigation } from '@react-navigation/native'

export type PageProps = {
  title: string
  backgroundColor: string
  foregroundColor?: string
  rightComponent?: JSX.Element
  home?: boolean
  back?: boolean
  saint: TNominisSaint | undefined
  children: JSX.Element | JSX.Element[]
}

const Page = ({
  title,
  backgroundColor,
  foregroundColor,
  rightComponent,
  home,
  back,
  saint,
  children
}: PageProps): JSX.Element => {
  const nav = useNavigation()
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    loadData(
      dispatch,
      (_n: number) => {
        _n === _n
      },
      setRefreshing
    )
    setTimeout(() => {
      if (!refreshing) setRefreshing(false)
    }, 5000)
  }

  return (
    <ScrollView
      contentContainerStyle={StyleSheet.compose(styles.background, {
        height: '100%',
        backgroundColor: backgroundColor
      })}
      refreshControl={
        <RefreshControl
          colors={[theme.colors.yellow, theme.colors.blue, theme.colors.red]}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.leftComponent}>
          {back && (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => nav.goBack()}
            >
              <AntDesign
                name="arrowleft"
                size={35}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
          <Image
            style={{ width: 55, height: 50, marginLeft: 25 }}
            source={require('../../assets/newIconolive.png')}
          />
        </View>
        <View>{rightComponent}</View>
      </View>
      {home && (
        <View
          style={[
            styles.saintBar,
            open ? styles.saintBarOpened : styles.saintBar
          ]}
        >
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Text style={{ color: theme.colors.white }}>
              {saint?.saint || ''}
            </Text>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => setOpen(!open)}
            >
              <AntDesign
                name={open ? 'up' : 'down'}
                size={15}
                color={theme.colors.yellow}
              />
            </TouchableOpacity>
          </View>
          {open && (
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (!saint) return
                const suported = await Linking.canOpenURL(saint.url)
                if (suported) await Linking.openURL(saint.url)
              }}
            >
              <Text style={{ color: theme.colors.blue }}>Voir sur Nominis</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View
        style={[
          styles.roundedView,
          foregroundColor
            ? { backgroundColor: foregroundColor }
            : { backgroundColor: theme.colors.white }
        ]}
      >
        {children}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: theme.colors.yellow,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20
  },
  saintBar: {
    marginVertical: 15,
    height: 50,
    flexDirection: 'row',
    backgroundColor: theme.colors.lightBlue,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 15
  },
  saintBarOpened: {
    marginVertical: 15,
    height: 100,
    backgroundColor: theme.colors.lightBlue,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 8,
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  title: {
    color: theme.colors.white,
    fontSize: 24
  },
  leftComponent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15
  },
  roundedView: {
    flex: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20
  }
})

const mapToProps = (state: RootState) => ({
  saint: state.dailyInfos.informations
})

export default connect(mapToProps)(Page)
