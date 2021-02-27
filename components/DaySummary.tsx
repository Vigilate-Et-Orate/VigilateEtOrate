import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { TNotif } from 'config/types/TNotif'
import { TIntention } from 'config/types/TIntention'
import { TPrayer } from 'config/types/TPrayer'
import {
  stringToTimestamp,
  timestampToReadable,
  timeToTimestamp
} from 'utils/time/timeManager'
import { useNavigation } from '@react-navigation/native'

type DayNotif = {
  time: number
  data: {
    text: string
    key: string
    smug?: string
    prayer: boolean
  }
}

const empty: DayNotif = {
  time: 0,
  data: {
    text: '',
    key: '',
    smug: '',
    prayer: false
  }
}

const DayLign = ({ time, data }: DayNotif) => {
  const navigation = useNavigation()
  const nav = () => {
    if (data.prayer && data.smug)
      navigation.navigate('Prayer', { prayer: data.smug })
  }

  return (
    <TouchableOpacity
      style={styles.lignContainer}
      disabled={!data.prayer}
      onPress={nav}
    >
      <View style={styles.time}>
        <Text>{timestampToReadable(time)}</Text>
      </View>
      <View style={styles.card}>
        {data && <Text style={styles.cardText}>{data.text}</Text>}
      </View>
    </TouchableOpacity>
  )
}

const DaySummary = ({
  notifs,
  intentions,
  prayers
}: {
  notifs: TNotif[]
  intentions: TIntention[]
  prayers: TPrayer[]
}) => {
  const [day, setDay] = useState<DayNotif[]>([])

  useEffect(() => {
    const populated = notifs.map((n) => {
      const time =
        typeof n.time === 'string'
          ? stringToTimestamp(n.time)
          : timeToTimestamp(n.time)
      if (n.type === 'intention') {
        const int = intentions.find((i) => i.id === n.itemId)
        if (!int) return empty
        return {
          time,
          data: { text: int.intention, key: n.itemId as string, prayer: false }
        }
      } else if (n.type === 'prayer') {
        const prayer = prayers.find(
          (p) => p.notificationContent === n.notificationContent
        )
        if (!prayer) return empty
        return {
          time,
          data: {
            text: prayer.displayName,
            key: (n.itemId as string) + time,
            prayer: true,
            smug: prayer.name
          }
        }
      }
      return empty
    })
    if (!populated) return
    populated.sort((a, b) => a?.time - b?.time)
    setDay(populated)
  }, [notifs])

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          day.length > 5 ? { height: 52 * day.length } : styles.containerHeight
        ]}
      ></View>
      <View style={styles.summary}>
        {day &&
          day.map((d) => (
            <DayLign key={d.data?.key} time={d.time} data={d.data} />
          ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    borderColor: theme.colors.white,
    borderRadius: 2,
    borderWidth: 2
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    display: 'flex',
    elevation: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: '80%'
  },
  cardText: {
    color: theme.colors.blue
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  containerHeight: {
    height: 250
  },
  lignContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    marginVertical: 6,
    paddingHorizontal: 15,
    width: '100%'
  },
  summary: {
    width: '100%'
  },
  time: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 10,
    width: '15%'
  }
})

const mapToProps = (state: RootState) => ({
  notifs: state.notifs.notifs,
  intentions: state.intentions.intentions,
  prayers: state.prayers.prayers
})

export default connect(mapToProps)(DaySummary)
