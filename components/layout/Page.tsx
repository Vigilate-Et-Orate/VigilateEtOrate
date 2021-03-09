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
import { TNominisSaint } from 'config/types/TNominis'
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
  refresh?: boolean
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
  refresh,
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
      contentContainerStyle={[
        styles.background,
        {
          backgroundColor: backgroundColor
        }
      ]}
      refreshControl={
        refresh ? (
          <RefreshControl
            colors={[theme.colors.yellow, theme.colors.blue, theme.colors.red]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      <View style={styles.header}>
        <View style={styles.leftComponent}>
          {back && (
            <TouchableOpacity
              style={styles.backButton}
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
            style={styles.logo}
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
          <View style={styles.saintTopOfBar}>
            <Text style={styles.saintText}>{saint?.saint || ''}</Text>
            <TouchableOpacity
              style={styles.saintButton}
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
              <Text style={styles.nominisText}>Voir sur Nominis</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View
        style={[
          styles.roundedView,
          foregroundColor
            ? { backgroundColor: foregroundColor }
            : styles.defaultBackgroundColor
        ]}
      >
        {children}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 10
  },
  background: {
    backgroundColor: theme.colors.blue,
    height: '100%'
  },
  button: {
    backgroundColor: theme.colors.yellow,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  defaultBackgroundColor: { backgroundColor: theme.colors.white },
  header: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 25,
    paddingTop: 30
  },
  leftComponent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  logo: {
    height: 50,
    marginLeft: 25,
    width: 55
  },
  nominisText: {
    color: theme.colors.blue
  },
  roundedView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 12,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  saintBar: {
    alignItems: 'center',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 10,
    display: 'flex',
    elevation: 8,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 2
  },
  saintBarOpened: {
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 10,
    display: 'flex',
    elevation: 8,
    flexDirection: 'column',
    height: 100,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  saintButton: { padding: 5 },
  saintText: { color: theme.colors.white },
  saintTopOfBar: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  title: {
    color: theme.colors.white,
    fontSize: 24
  }
})

const mapToProps = (state: RootState) => ({
  saint: state.dailyInfos.informations
})

export default connect(mapToProps)(Page)
