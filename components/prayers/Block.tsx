import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import { TPrayer } from 'config/types/Prayer'
import theme from 'config/theme'
import { TNotif } from 'config/types/TNotif'
import { stringTimeToReadable } from 'utils/time/timeManager'

export type PrayerBlockProps = {
  prayer: TPrayer
  fav: boolean
  notifs: TNotif[]
  toggleFav: (id: string, fav: boolean) => Promise<void>
  addNotification: (prayer: TPrayer) => void
  removeNotif: (id: string) => void
}

export type PrayerBlockRegisterProps = {
  prayer: TPrayer
  index: number
  inpair?: boolean
  onPress: () => Promise<void>
  notif?: boolean
  time?: string
}

export const PrayerBlock = ({
  prayer,
  fav,
  notifs,
  toggleFav,
  addNotification,
  removeNotif
}: PrayerBlockProps): JSX.Element => {
  const navigation = useNavigation()

  const [open, setOpen] = useState(false)

  const removeAllNotif = () => {
    notifs.forEach((n) => {
      removeNotif(n._id)
    })
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.action}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => addNotification(prayer)}
          >
            <MaterialIcons
              name="notifications-on"
              size={25}
              color={theme.colors.white}
            />
            <Text style={styles.actionButtonText}>
              Ajouter une notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={removeAllNotif}
          >
            <MaterialIcons
              name="notifications-off"
              size={25}
              color={theme.colors.white}
            />
            <Text style={styles.actionButtonText}>Arrêt des notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFav(prayer._id, fav)}
          >
            <MaterialCommunityIcons
              name="heart"
              size={25}
              color={fav ? theme.colors.red : theme.colors.white}
            />
            <Text style={styles.actionButtonText}>
              {fav ? 'Retirer' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.card,
            open ? { transform: [{ translateX: -280 }] } : {}
          ]}
        >
          <TouchableOpacity
            style={styles.text}
            onPress={() =>
              navigation.navigate('Prayer', { prayer: prayer.name })
            }
          >
            <Text style={styles.title}>{prayer.displayName}</Text>
            <Text>{prayer.description}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actions}
            onPress={() => setOpen(!open)}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={25}
              backgroundColor={theme.colors.white}
              color={theme.colors.blue}
              borderRadius={100}
            />
          </TouchableOpacity>
        </View>
      </View>
      {open && (
        <View>
          {notifs.map((n) => (
            <View key={n._id} style={styles.singleNotifLign}>
              <Text style={{ color: theme.colors.white }}>
                {stringTimeToReadable(n.time as string)}
              </Text>
              <MaterialIcons.Button
                name="notifications-off"
                backgroundColor={theme.colors.blue}
                onPress={() => removeNotif(n._id)}
              >
                <Text style={{ color: theme.colors.white }}>Supprimer</Text>
              </MaterialIcons.Button>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  singleNotifLign: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25
  },
  container: {
    marginVertical: 10,
    borderColor: '#fff',
    borderWidth: 1,
    position: 'relative',
    borderRadius: 21
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    alignItems: 'center',
    padding: 10
  },
  actionButtonText: {
    color: theme.colors.white,
    textAlign: 'center'
  },
  action: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  card: {
    paddingLeft: 20,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    elevation: 15,
    display: 'flex',
    flexDirection: 'row'
  },
  text: {
    paddingVertical: 15,
    width: '85%',
    flexDirection: 'column'
  },
  actions: {
    width: '10%',
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    color: theme.colors.blue
  }
})
