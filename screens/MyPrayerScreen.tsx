import React, { useState, useEffect } from 'react'
import { ScrollView, Text } from 'react-native'

import * as Storage from 'utils/storage/StorageManager'
import { Header } from 'elements/text/Text'
import { MyPrayer } from 'config/types/Prayer'

const MyPrayerPage = () => {
  const [myPrayer, setMyPrayer] = useState<MyPrayer>()
  let _isMounted: boolean

  useEffect(() => {
    _isMounted = true
    Storage.getDataAsync(Storage.Stored.MY_PRAYER).then((data) => {
      if (!data) return
      const parsed = JSON.parse(data)
      setMyPrayer(parsed)
    })
    return () => {
      _isMounted = false
    }
  })

  return (
    <ScrollView style={{ marginHorizontal: 20, marginTop: 20 }}>
      <Header>{myPrayer?.title}</Header>
      <Text style={{ fontSize: 14, marginTop: 20 }}>{myPrayer?.content}</Text>
    </ScrollView>
  )
}

export default MyPrayerPage