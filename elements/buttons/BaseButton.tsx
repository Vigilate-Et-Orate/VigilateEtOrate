import React from 'react'
import {
  Button as BaseButton,
  NativeSyntheticEvent,
  NativeTouchEvent
} from 'react-native'

import theme from 'config/theme'

type ButtonProps = {
  title: string
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const Button = ({ title, onPress }: ButtonProps) => (
  <BaseButton title={title} onPress={onPress} color={theme.colors.blue} />
)

const AccentButton = ({ title, onPress }: ButtonProps) => (
  <BaseButton title={title} onPress={onPress} color={theme.colors.red} />
)

export default Button
