import theme from 'config/theme'
import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

type TBaseModal = {
  open: boolean
  onClose: () => void
  children: JSX.Element | JSX.Element[]
  intention?: boolean
}

const BaseModal = ({ children, open, onClose, intention }: TBaseModal) => (
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    backgroundColor: '#000000a4'
  },
  modal: {
    backgroundColor: theme.colors.blue,
    height: '40%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 15,
    paddingHorizontal: 25,
    display: 'flex',
    flexDirection: 'column'
  },
  dissmiss: {
    height: '60%'
  }
})

export default BaseModal
