import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'

import * as Storage from 'utils/storage/StorageManager'
import { LectureAelf, getDailyGospel } from 'utils/aelf/fetchAelf'
import baseStyle from 'config/style'

import { Title, Header } from 'elements/text/Text'

const GospelScreen = () => {
  let [evangile, setEvangile] = useState<LectureAelf>()

  useEffect(() => {
    // Storage.getDataAsync(Storage.Stored.EVANGILE).then((data: string | null) => {
    //   if (!data) return
    //   let res: LectureAelf = JSON.parse(data)
    //   res.
    // })
    getDailyGospel().then((data) => {
      if (!data) return
      let html = data.contenu
      html = html.replace(/<\/p>/gi, '\n')
      html = html.replace(/<[^>]+>/gi, '')
      data.contenu = html
      setEvangile(data)
    })
  })

  return (
    <ScrollView style={{ paddingTop: 25, paddingHorizontal: 20 }}>
      <Header>{evangile?.titre}</Header>
      <Text style={{ justifyContent: 'flex-end', marginBottom: 15 }}>
        {evangile?.ref}
      </Text>
      <Text>{evangile?.contenu}</Text>
    </ScrollView>
  )
}

export default GospelScreen
