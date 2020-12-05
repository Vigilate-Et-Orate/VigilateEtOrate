import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, ToastAndroid } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'

import { TIntention } from 'config/types/Intention'
import { WriteIntention, IntentionCard } from 'components/intentions/Blocks'
import * as Storage from 'utils/storage/StorageManager'
import { buildSlug } from 'utils/slug/slugBuilder'
import theme from 'config/theme'

const IntentionsScreen = (): JSX.Element => {
  const [intentions, setIntentions] = useState([] as TIntention[])
  let _isMounted: boolean

  useFocusEffect(
    useCallback(() => {
      _isMounted = true
      Storage.getDataAsync<TIntention>(Storage.Stored.INTENTIONS).then(
        (data) => {
          if (!data) return
          setIntentions(data)
        }
      )
      return () => {
        if (_isMounted) _isMounted = false
      }
    }, [intentions])
  )

  const addIntention = (title: string, intention: string) => {
    // const tmp = intentions
    // const slug = buildSlug(title)
    // tmp.push({
    //   title,
    //   intention,
    // } as TIntention)
    // Storage.setDataAsync(Storage.Stored.INTENTIONS, JSON.stringify(tmp))
    //   .then(() => {
    //     ToastAndroid.showWithGravity(
    //       'Ajoutée !',
    //       ToastAndroid.SHORT,
    //       ToastAndroid.BOTTOM
    //     )
    //     setIntentions(tmp)
    //   })
    //   .catch(() => {
    //     ToastAndroid.showWithGravity(
    //       'Erreur...',
    //       ToastAndroid.SHORT,
    //       ToastAndroid.BOTTOM
    //     )
    //   })
    // setIntentions(tmp)
  }

  const removeIntention = (slug: string) => {
    // const tmp = intentions.filter((i) => i.slug !== slug)
    // Storage.setDataAsync(Storage.Stored.INTENTIONS, JSON.stringify(tmp))
    //   .then(() => {
    //     ToastAndroid.showWithGravity(
    //       'Enlevée !',
    //       ToastAndroid.SHORT,
    //       ToastAndroid.BOTTOM
    //     )
    //   })
    //   .catch(() => {
    //     ToastAndroid.showWithGravity(
    //       'Erreur...',
    //       ToastAndroid.SHORT,
    //       ToastAndroid.BOTTOM
    //     )
    //   })
  }

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <View style={{ height: '100%', flexDirection: 'column-reverse' }}>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 40,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <View>
              <FontAwesome5 name="pray" size={70} color="white" />
            </View>
            <View style={{ flexDirection: 'column-reverse' }}>
              <Text style={{ fontSize: 32, color: theme.colors.white }}>
                Mes Intentions
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <View
          style={
            intentions.length > 2
              ? styles.roundedView
              : styles.roundedViewHeight
          }
        >
          <Text style={styles.h3}>Ecrire une intention</Text>
          <WriteIntention addIntention={addIntention} />
          <Text style={styles.h3}>Intentions</Text>
          <View>
            {intentions &&
              intentions.length > 0 &&
              intentions.map((int) => {
                return (
                  <IntentionCard
                    key={int.title}
                    intention={int}
                    removeIntention={removeIntention}
                  />
                )
              })}
            {intentions && intentions.length <= 0 && (
              <Text style={{ color: theme.colors.white, paddingLeft: 30 }}>
                Pas d&apos;intentions...
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  h3: {
    color: theme.colors.green,
    fontSize: 25,
    marginVertical: 10
  },
  background: {
    height: '100%',
    backgroundColor: theme.colors.green
  },
  body: {
    height: '125%'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '15%',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30
  },
  roundedView: {
    marginTop: '40%',
    backgroundColor: theme.colors.lightGreen,
    borderRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 35,
    height: '100%'
  },
  roundedViewHeight: {
    marginTop: '40%',
    backgroundColor: theme.colors.lightGreen,
    borderRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 35,
    height: 750
  }
})

export default IntentionsScreen
