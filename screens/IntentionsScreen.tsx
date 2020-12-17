import React, { useCallback, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Modal } from 'react-native'
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'

import { TIntention } from 'config/types/Intention'
import { WriteIntention, IntentionCard } from 'components/intentions/Blocks'
import theme from 'config/theme'
import { connect, useDispatch } from 'react-redux'
import { RootState } from 'red/reducers/RootReducer'
import { postIntention } from 'utils/api/api_firebase'
import { addIntentions } from 'red/actions/IntentionsActions'
import {
  TouchableHighlight,
  TouchableOpacity
} from 'react-native-gesture-handler'

const IntentionsScreen = ({
  intentions,
  userId
}: {
  intentions: TIntention[]
  userId: string | undefined
}): JSX.Element => {
  const dispatch = useDispatch()
  const [open, openModal] = useState(false)
  const [selectedIntention, setSI] = useState<TIntention>()

  const addIntention = async (intention: string) => {
    await postIntention(intention, userId)
    dispatch(addIntentions(intention, userId))
  }
  const focusIntention = (id: string) => {
    const int = intentions.find((i) => i.id == id)
    setSI(int)
    openModal(true)
  }

  return (
    <View style={styles.background}>
      <Modal animationType="fade" visible={open} transparent>
        <View style={styles.modalCenter}>
          <View style={styles.modal}>
            <Text>{selectedIntention?.intention || ''}</Text>
            <TouchableHighlight
              style={styles.modalClose}
              onPress={() => openModal(false)}
            >
              <Text style={{ color: theme.colors.white }}>Fermer</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
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
            intentions.length > 6
              ? styles.roundedView
              : styles.roundedViewHeight
          }
        >
          <Text style={styles.h3}>Ecrire une intention</Text>
          <WriteIntention addIntention={addIntention} />
          <Text style={styles.h3}>Intentions</Text>
          <View>
            {intentions.length !== 0 &&
              intentions.map((int) => (
                <IntentionCard
                  key={int.id}
                  intention={int}
                  onLongPress={() => focusIntention(int.id)}
                />
              ))}
            {intentions.length <= 0 && (
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
  modalClose: {
    display: 'flex',
    alignSelf: 'center',
    marginTop: 15,
    backgroundColor: theme.colors.green,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 40,
    elevation: 10
  },
  modal: {
    width: '80%',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderRadius: 20,
    elevation: 15,
    shadowColor: '#f00',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 5,
      height: 7
    }
  },
  modalCenter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000a0'
  },
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

const mapToProps = (state: RootState) => ({
  intentions: state.intentions.intentions,
  userId: state.user.user?.id
})

export default connect(mapToProps)(IntentionsScreen)
