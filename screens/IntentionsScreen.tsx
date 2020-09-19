import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid
} from 'react-native'

import { Title, Header } from 'elements/text/Text'
import { Intention } from 'config/types/Intention'
import * as Storage from 'utils/storage/StorageManager'
import { buildSlug } from 'utils/slug/slugBuilder'
import theme from 'config/theme'

type IntentionCardProps = {
  intention: Intention
}

const IntentionCard = ({ intention }: IntentionCardProps): JSX.Element => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={styles.cardIntention}
      onPress={() => navigation.navigate('Intention', { intention })}
    >
      <View>
        <Text style={styles.title}>{intention.title}</Text>
        <Text>{intention.intention}</Text>
      </View>
    </TouchableOpacity>
  )
}

type WriteIntentionProps = {
  addIntention: (title: string, intention: string) => void
}

const WriteIntentionBloc = ({ addIntention }: WriteIntentionProps) => {
  const [title, onTitleChange] = useState('')
  const [intention, onIntentionChange] = useState('')

  return (
    <View style={styles.card}>
      <Header>Ecrire une intention</Header>
      <TextInput
        style={styles.input}
        onChangeText={onTitleChange}
        value={title}
        placeholder="Titre de l'intention"
      />
      <TextInput
        style={styles.input}
        onChangeText={onIntentionChange}
        value={intention}
        placeholder="Intention"
      />
      <View style={{ flexDirection: 'row-reverse' }}>
        <Button
          title="Ajouter"
          color={theme.colors.blue}
          onPress={() => {
            addIntention(title, intention)
            onTitleChange('')
            onIntentionChange('')
          }}
        />
      </View>
    </View>
  )
}

const IntentionsScreen = () => {
  const [intentions, setIntentions] = useState([] as Intention[])

  useEffect(() => {
    Storage.getDataAsync(Storage.Stored.INTENTIONS).then((data) => {
      if (!data) return
      const parsed = JSON.parse(data)
      if (parsed) setIntentions(parsed)
    })
  }, [intentions])

  const addIntention = (title: string, intention: string) => {
    const tmp = intentions
    tmp.push({
      title,
      intention
    } as Intention)
    const slug = buildSlug(title)
    Storage.setDataAsync(Storage.Stored.INTENTIONS, JSON.stringify(tmp))
      .then(() => {
        ToastAndroid.showWithGravity(
          'Ajouté!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
        setIntentions(tmp)
        return true
      })
      .catch(() => {
        ToastAndroid.showWithGravity(
          'Erreur...',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
      })
  }

  const removeIntention = (slug: string) => {
    if (!slug) return
  }

  return (
    <ScrollView style={{ paddingHorizontal: 10 }}>
      <Title>Mes Intentions</Title>
      <WriteIntentionBloc addIntention={addIntention} />
      <View style={styles.card}>
        {intentions &&
          intentions.length > 0 &&
          intentions.map((int: Intention) => {
            return <IntentionCard key={int.slug} intention={int} />
          })}
        {intentions && intentions.length <= 0 && (
          <Text>Pas d&apos;intentions...</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  button: {
    color: '#35415A'
  },
  card: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    margin: 10,
    flexDirection: 'column'
  },
  cardIntention: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 15,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    flexDirection: 'column'
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: theme.colors.blue
  },
  title: {
    fontSize: 24,
    marginBottom: 6,
    color: theme.colors.blue
  }
})

export default IntentionsScreen
