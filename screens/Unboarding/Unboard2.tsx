import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import theme from 'config/theme'
import * as Storage from 'utils/storage/StorageManager'
import { WriteIntention } from 'components/intentions/Blocks'
import { buildSlug } from 'utils/slug/slugBuilder'

const Unboard = (): JSX.Element => {
  const addIntention = (title: string, intention: string) => {
    const slug = buildSlug(title)
    Storage.getDataAsync(Storage.Stored.INTENTIONS).then((data) => {
      if (!data) return
      const intentions = JSON.parse(data)
      intentions.push({
        title,
        intention,
        slug
      })
      Storage.setDataAsync(
        Storage.Stored.INTENTIONS,
        JSON.stringify(intentions)
      )
    })
  }

  return (
    <View style={styles.background}>
      <Text style={styles.title}>
        Vous pouvez ajouter une intention de prière
      </Text>
      <WriteIntention addIntention={addIntention} />
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: '10%',
          justifyContent: 'center'
        }}
      >
        <FontAwesome5 name="pray" size={120} color={theme.colors.green} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.lightGreen,
    height: '100%'
  },
  title: {
    color: theme.colors.white,
    marginBottom: 10,
    marginTop: '20%',
    paddingHorizontal: 25,
    fontSize: 36
  }
})

export default Unboard
