import React from 'react'
import { Text as BaseText, StyleSheet } from 'react-native'

import theme from 'config/theme'

type Props = {
  children: any
}

const Text = ({ children }: Props) => (
  <BaseText style={styles.Text}>{children}</BaseText>
)

const Title = ({ children }: Props) => (
  <BaseText style={styles.Title}>{children}</BaseText>
)

const Header = ({ children }: Props) => (
  <BaseText style={styles.Header}>{children}</BaseText>
)

const styles = StyleSheet.create({
  Text: {},
  Title: {
    fontSize: 35,
    marginVertical: 20,
    color: theme.colors.blue,
    fontWeight: '200'
  },
  Header: {
    color: theme.colors.blue,
    fontSize: 24
  }
})

export { Text, Title, Header }
