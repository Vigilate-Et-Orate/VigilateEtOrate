import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity
} from 'react-native'

import theme from 'config/theme'
import { MyPrayer } from 'config/types/Prayer'
import * as Storage from 'utils/storage/StorageManager'

export type PersonnalBlockProps = {
  settings: boolean
}

export const MyPrayerBlock = ({
  settings
}: {
  settings?: boolean
}): JSX.Element => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const save = async (e: any) => {
    e.preventDefault()
    const myPrayer: MyPrayer = {
      title,
      content
    }
    await Storage.setDataAsync(
      Storage.Stored.MY_PRAYER,
      JSON.stringify(myPrayer)
    )
    ToastAndroid.showWithGravity(
      'Ajoutée !',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    )
  }

  useEffect(() => {
    Storage.getDataAsync(Storage.Stored.MY_PRAYER).then((data) => {
      if (!data) return
      const parsed: MyPrayer = JSON.parse(data)
      setContent(parsed.content)
      setTitle(parsed.title)
    })
  }, [])

  return (
    <View
      style={[
        styles.card,
        settings ? { elevation: 0, paddingHorizontal: 5 } : {}
      ]}
    >
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor={theme.colors.blue}
        placeholder="Titre de votre prière"
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        style={styles.input}
        placeholderTextColor={theme.colors.blue}
        placeholder="Votre prière"
      />
      <View style={{ flexDirection: 'row-reverse' }}>
        <TouchableOpacity style={styles.button} onPress={save}>
          <Text style={{ color: theme.colors.blue }}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const FirstnameBlock = ({
  settings
}: {
  settings?: boolean
}): JSX.Element => {
  const [firstname, setFirstname] = useState('')

  const save = async (e: any) => {
    e.preventDefault()
    await Storage.setDataAsync(Storage.Stored.FIRSTNAME, firstname)
    ToastAndroid.showWithGravity(
      "C'est tout bon!",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    )
  }

  useEffect(() => {
    Storage.getDataAsync(Storage.Stored.FIRSTNAME).then((data) => {
      if (!data) return
      setFirstname(data)
    })
  })

  return (
    <View
      style={[
        styles.card,
        settings ? { elevation: 0, paddingHorizontal: 5 } : {}
      ]}
    >
      <TextInput
        value={firstname}
        onChangeText={setFirstname}
        style={styles.input}
        placeholderTextColor={theme.colors.blue}
        placeholder="Prénom"
      />
      <View style={{ flexDirection: 'row-reverse' }}>
        <TouchableOpacity style={styles.button} onPress={save}>
          <Text style={{ color: theme.colors.blue }}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    backgroundColor: theme.colors.white + 'e4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    elevation: 15,
    flexDirection: 'column',
    borderRadius: 20
  },
  input: {
    backgroundColor: theme.colors.white + '33',
    opacity: 5,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.yellow
  },
  button: {
    backgroundColor: theme.colors.yellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20
  }
})
