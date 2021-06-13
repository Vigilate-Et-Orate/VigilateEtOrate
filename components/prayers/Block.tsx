import React, { useRef, useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Dimensions
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import { TPrayer } from 'config/types/TPrayer'
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
  const slideAnim = useRef(new Animated.Value(0)).current

  const [open, setOpen] = useState(false)

  const removeAllNotif = () => {
    notifs.forEach((n) => {
      removeNotif(n.id)
    })
  }
  const slideOpen = () => {
    const val = Dimensions.get('screen').width - 120
    Animated.timing(slideAnim, {
      toValue: -val,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.ease
    } as Animated.TimingAnimationConfig).start(() => setOpen(true))
  }
  const slideClose = () => {
    setOpen(false)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.ease
    } as Animated.TimingAnimationConfig).start()
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
            onPress={() => toggleFav(prayer.id, fav)}
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
        <Animated.View
          style={[styles.card, { transform: [{ translateX: slideAnim }] }]}
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
            onPress={() => {
              open ? slideClose() : slideOpen()
            }}
          >
            {notifs.length > 0 && (
              <MaterialCommunityIcons
                name="bell"
                size={15}
                color={theme.colors.blue}
              />
            )}
            <MaterialCommunityIcons
              name="dots-vertical"
              size={25}
              backgroundColor={theme.colors.white}
              color={theme.colors.blue}
              borderRadius={100}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      {open && (
        <View>
          {notifs.map((n) => (
            <View key={n.id} style={styles.singleNotifLign}>
              <Text style={{ color: theme.colors.white }}>
                {stringTimeToReadable(n.time as string)}
              </Text>
              <MaterialIcons.Button
                name="notifications-off"
                backgroundColor={theme.colors.blue}
                onPress={() => removeNotif(n.id)}
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
  action: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row-reverse',
    position: 'absolute',
    right: 0,
    top: 0
  },
  actionButton: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    width: '30%'
  },
  actionButtonText: {
    color: theme.colors.white,
    textAlign: 'center'
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '10%'
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    display: 'flex',
    elevation: 15,
    flexDirection: 'row',
    paddingLeft: 20
  },
  container: {
    borderColor: theme.colors.white,
    borderRadius: 21,
    borderWidth: 1,
    marginVertical: 10,
    position: 'relative'
  },
  singleNotifLign: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    width: '100%'
  },
  text: {
    flexDirection: 'column',
    paddingVertical: 15,
    width: '85%'
  },
  title: {
    color: theme.colors.blue,
    fontSize: 20,
    marginBottom: 5
  }
})
