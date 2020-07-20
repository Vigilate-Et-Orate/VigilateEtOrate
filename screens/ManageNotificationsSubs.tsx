import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'

import * as LocalNotification from '../utils/notification/LocalNotification'
import * as Storage from '../utils/storage/StorageManager'

import Title from '../elements/text/Title'
import Text from '../elements/text/Text'
import HorizontalRule from '../elements/layout/HorizontalRule'
import Screen from '../elements/layout/Screen'
import LineElement from '../elements/ui/LineElement'
import Button from '../elements/buttons/BaseButton'

const ManageNotificationsSubs = () => {
  let [data, setData] = useState([] as LocalNotification.Sub[])
  useEffect(() => {
    Storage.getDataAsync(Storage.Stored.SUBS).then(res => {
      if (!res) {
        setData([])
        return
      }
      setData(JSON.parse(res))
    })
  }, [data])


  return (
    <Screen>
      <Title>Notifications</Title>
      <HorizontalRule />
      <View>
        <Button title="Unsub from all" onPress={LocalNotification.unsubToAll} />
      </View>
      <HorizontalRule />
      <ScrollView style={{ flex: 1 }}>
        {data && data.map((elem: LocalNotification.Sub) => {
          return (<LineElement key={elem.name} title={elem.name} activeInitial={elem.active} />)
        })}
      </ScrollView>
    </Screen>
  )
}

export default ManageNotificationsSubs