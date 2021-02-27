import theme from 'config/theme'
import React from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

type TBaseModal = {
  open: boolean
  onClose: () => void
  children: JSX.Element | JSX.Element[]
}

const BaseModal = ({ children, open, onClose }: TBaseModal): JSX.Element => (
  <Modal
    visible={open}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.container}>
      <View style={styles.modal}>{children}</View>
      <TouchableOpacity
        onPress={onClose}
        style={styles.dissmiss}
      ></TouchableOpacity>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparentBlack,
    display: 'flex',
    flexDirection: 'column-reverse',
    height: '100%'
  },
  dissmiss: {
    height: '60%'
  },
  modal: {
    backgroundColor: theme.colors.blue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    height: '40%',
    paddingHorizontal: 25,
    paddingTop: 15
  }
})

export default BaseModal
