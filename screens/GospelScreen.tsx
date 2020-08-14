import React, { useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native'

import { LectureAelf, getDailyGospel } from 'utils/aelf/fetchAelf'

import { Header } from 'elements/text/Text'

const GospelScreen = (): JSX.Element => {
  const [evangile, setEvangile] = useState<LectureAelf>()
  let _isMounted: boolean

  useEffect(() => {
    _isMounted = true
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
    return () => {
      if (_isMounted) _isMounted = false
    }
  })

  return (
    <ScrollView style={{ paddingTop: 25, paddingHorizontal: 20 }}>
      <Header>{evangile?.titre}</Header>
      <Text style={{ justifyContent: 'flex-end', marginBottom: 15 }}>
        {evangile?.ref}
      </Text>
      <Text style={{ marginBottom: 15 }}>{evangile?.contenu}</Text>
    </ScrollView>
  )
}

export default GospelScreen
