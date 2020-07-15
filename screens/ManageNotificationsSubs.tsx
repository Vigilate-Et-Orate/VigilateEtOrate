import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'

import * as LocalNotification from '../utils/notification/LocalNotification'
import * as Storage from '../utils/storage/StorageManager'

import Title from '../elements/text/Title'
import Text from '../elements/text/Text'
import HorizontalRule from '../elements/layout/HorizontalRule'
import Screen from '../elements/layout/Screen'
import LineElement from '../elements/ui/LineElement'
import * as Grid from '../elements/layout/Grid'
import Button from '../elements/buttons/BaseButton'

const getData = async (setData: Function) => {
  let data = await Storage.getDataAsync(Storage.Stored.SUBS)
  if (!data) return
  setData(JSON.parse(data))
}

type Data = {
  [key: string]: boolean
}

const ManageNotificationsSubs = () => {
  let [data, setData] = useState({} as Data)
  useEffect(() => {
    getData(setData)
  }, [])

  return (
    <Screen>
      <Title>Notifications</Title>
      <HorizontalRule />
      <View>
        <Button title="Unsub from all" onPress={LocalNotification.unsubToAll} />
      </View>
      <HorizontalRule />
      <View style={{ flex: 1 }}>
        {data && Object.keys(data).map((key: string) => {
          return (<LineElement key={key} title={key} activeInitial={data[key]} />)
        })}
      </View>
    </Screen>
  )
}

export default ManageNotificationsSubs