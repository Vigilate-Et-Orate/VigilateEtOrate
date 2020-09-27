import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import theme from 'config/theme'

const Unboard = createMaterialTopTabNavigator()

// Unboard Screens
import Unboard1 from 'screens/Unboarding/Unboard1'
import Unboard2 from 'screens/Unboarding/Unboard2'
import Unboard3 from 'screens/Unboarding/Unboard3'

type TabBarProps = {
  state: any
  descriptors: any
  navigation: any
}

const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View
      style={{
        elevation: 0,
        position: 'absolute',
        bottom: 80,
        left: '10%',
        borderRadius: 40,
        width: '80%',
        flexDirection: 'row',
        height: 10,
        zIndex: 40,
        backgroundColor: theme.colors.yellow + '00'
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]

        const isFocused = state.index == index

        const onPressNav = () => {
          const event = navigation.emit({
            type: 'typePress',
            target: route.key,
            canPreventDefault: true
          })

          if (!isFocused && !event.defaultPrevented)
            navigation.navigate(route.name)
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          })
        }

        return (
          <TouchableOpacity
            testID={options.tabBarTestID}
            onPress={onPressNav}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.colors.white,
              marginHorizontal: 10,
              borderRadius: 10,
              elevation: isFocused ? 7 : 0
            }}
            key={route.key}
          ></TouchableOpacity>
        )
      })}
    </View>
  )
}

const Routes = (): JSX.Element => {
  return (
    <Unboard.Navigator
      keyboardDismissMode="none"
      tabBar={(props) => <TabBar {...props} />}
    >
      <Unboard.Screen name="Un1" component={Unboard1} />
      <Unboard.Screen name="Un2" component={Unboard2} />
      <Unboard.Screen name="Un3" component={Unboard3} />
    </Unboard.Navigator>
  )
}

export default Routes
