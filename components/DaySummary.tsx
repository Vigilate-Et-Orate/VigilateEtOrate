import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Text } from 'react-native'
import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { TNotif } from 'config/types/TNotif'
import { TIntention } from 'config/types/Intention'
import { TPrayer } from 'config/types/Prayer'
import { stringToTimestamp, timeToTimestamp } from 'utils/time/timeManager'

type DayNotif = {
  time: number
  data: {
    text: string
    key: string
  }
}

const DayLign = ({ time, data }: DayNotif) => {
  const date = new Date(time)
  const dateSting = date.getHours() + ':' + date.getMinutes()

  return (
    <View style={styles.lignContainer}>
      <View style={styles.time}>
        <Text>{dateSting}</Text>
      </View>
      <View style={styles.card}>
        {data && <Text style={styles.cardText}>{data.text}</Text>}
      </View>
    </View>
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
        if (!int) return { time, data: { text: '', key: '' } }
        return {
          time,
          data: { text: int.intention, key: n.itemId as string }
        }
      } else if (n.type === 'prayer') {
        const prayer = prayers.find(
          (p) => p.notificationContent === n.notificationContent
        )
        if (!prayer) return { time, data: { text: '', key: '' } }
        return {
          time,
          data: { text: prayer.displayName, key: n.itemId as string }
        }
      }
      return { time, data: { text: '', key: '' } }
    })
    if (!populated) return
    populated.sort((a, b) => a?.time - b?.time)
    setDay(populated)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.bar}></View>
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
  lignContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 15,
    marginVertical: 6
  },
  time: {
    width: '15%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  },
  timeText: {
    color: theme.colors.white
  },
  card: {
    width: '80%',
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    elevation: 10,
    display: 'flex',
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  cardText: {
    color: theme.colors.blue
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  bar: {
    borderColor: theme.colors.white,
    height: 250,
    borderWidth: 2,
    borderRadius: 2
  },
  summary: {
    width: '100%'
  }
})

const mapToProps = (state: RootState) => ({
  notifs: state.notifs.notifs,
  intentions: state.intentions.intentions,
  prayers: state.prayers.prayers
})

export default connect(mapToProps)(DaySummary)
