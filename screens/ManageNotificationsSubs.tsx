import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'

import * as LocalNotification from 'utils/notification/LocalNotification'
import * as Storage from 'utils/storage/StorageManager'

import { Title } from 'elements/text/Text'
import LineElement from 'elements/ui/LineElement'
import Button from 'elements/buttons/BaseButton'

const ManageNotificationsSubs = () => {
  let [data, setData] = useState([] as LocalNotification.Sub[])
  useEffect(() => {
    Storage.getDataAsync(Storage.Stored.SUBS).then((res) => {
      if (!res) {
        setData([])
        return
      }
      setData(JSON.parse(res))
    })
  }, [data])

  return (
    <View>
      <Title>Notifications</Title>
      <View>
        <Button title="Unsub from all" onPress={LocalNotification.unsubToAll} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {data &&
          data.map((elem: LocalNotification.Sub) => {
            return (
              <LineElement
                key={elem.name}
                title={elem.name}
                activeInitial={elem.active}
              />
            )
          })}
      </ScrollView>
    </View>
  )
}

export default ManageNotificationsSubs
