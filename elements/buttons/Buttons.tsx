import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle
} from 'react-native'

export type ButtonProps = {
  children: any
  onPress: () => void
  style: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  roundedFilled: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 50
  }
})

export const RoundedFilledButton = ({
  children,
  onPress,
  style
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={StyleSheet.compose(style, styles.roundedFilled)}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  )
}
