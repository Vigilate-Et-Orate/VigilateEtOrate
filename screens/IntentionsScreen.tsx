import React, { useState } from 'react'
import {
  Text,
  View,
  Share,
  Vibration,
  StyleSheet,
  TextInput
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import * as Analytics from 'expo-firebase-analytics'

import Modal from 'components/layout/Modal'
import { TIntention } from 'config/types/TIntention'
import { WriteIntention, IntentionCard } from 'components/intentions/Blocks'
import theme from 'config/theme'
import { connect, useDispatch } from 'react-redux'
import { RootState } from 'red/reducers/RootReducer'
import VOFire from 'utils/api/api_firebase'
import {
  addIntentions,
  deleteIntentions,
  updateIntentions
} from 'red/actions/IntentionsActions'
import Page from 'components/layout/Page'
import TimePicker from 'components/TimePicker'
import { addNotif, removeNotif } from 'red/actions/NotifsActions'
import { TNotif } from 'config/types/TNotif'

const IntentionsScreen = ({
  intentions,
  userId,
  notifs
}: {
  intentions: TIntention[]
  userId: string | undefined
  token: string
  notifs: TNotif[]
}): JSX.Element => {
  const dispatch = useDispatch()
  const api = new VOFire()
  const [open, openModal] = useState(false)
  const [preDelete, openPreDelete] = useState(false)
  const [show, setShow] = useState(false)
  const [selectedIntention, setSI] = useState<TIntention>()
  const [edit, setEdit] = useState(false)
  const [intentionEdit, setIE] = useState('')

  const addIntention = async (intention: string) => {
    Analytics.logEvent('addIntention')
    await api.intentions.create(intention)
    dispatch(addIntentions(intention, userId))
  }
  const deleteIntention = async () => {
    Analytics.logEvent('deleteIntention')
    if (!selectedIntention) return
    api.intentions.delete(selectedIntention.id)
    dispatch(deleteIntentions(selectedIntention))
    openModal(false)
  }
  const editIntention = async () => {
    setIE(selectedIntention?.intention || '')
    setEdit(!edit)
  }
  const updateInt = async () => {
    Analytics.logEvent('updateIntention')
    if (!selectedIntention) return
    const intTmp = intentions
    const index = intTmp.findIndex((i) => i.id === selectedIntention.id)
    intTmp[index].intention = intentionEdit
    dispatch(updateIntentions(intTmp))
    api.intentions.update(intTmp[index])
    setEdit(false)
  }
  const shareIntention = async () => {
    try {
      await Share.share({
        message: `Voici une intention: ${selectedIntention?.intention}`
      })
      openModal(false)
    } catch (e) {
      console.error(e.message)
    }
  }
  const focusIntention = (id: string) => {
    const int = intentions.find((i) => i.id == id)
    setSI(int)
    openModal(true)
    Vibration.vibrate(20)
  }
  const addTheNotif = async (time: string | undefined) => {
    Analytics.logEvent('notifAddIntention')
    if (!time || !selectedIntention) {
      setShow(false)
      return
    }
    const n = await api.notifications.create(
      selectedIntention.id,
      'intention',
      time,
      'default'
    )
    if (!n) return
    dispatch(addNotif(n))
    setShow(false)
  }
  const removeNotifi = () => {
    const id = selectedIntention?.id
    const notif = notifs.find((n) => n.item === id)
    if (!notif) return
    const res = api.notifications.delete(notif.id)
    if (!res) return
    dispatch(removeNotif(notif))
    openModal(false)
  }
  const hasNotif = (id: string): boolean => {
    const n = notifs.find((n) => n.item === id)
    return n ? true : false
  }

  return (
    <Page
      title="Mes Intentions"
      backgroundColor={theme.colors.green}
      foregroundColor={theme.colors.blue}
    >
      <Modal
        open={open}
        onClose={() => {
          Vibration.vibrate(20)
          openModal(!open)
          setEdit(false)
        }}
      >
        <View style={styles.container}>
          <View style={styles.actions}>
            <Feather.Button
              backgroundColor={theme.colors.blue}
              name="trash"
              size={20}
              onPress={() => openPreDelete(true)}
            />
            <Feather.Button
              backgroundColor={theme.colors.blue}
              name="edit-3"
              size={20}
              onPress={editIntention}
            />
            <Feather.Button
              backgroundColor={theme.colors.blue}
              name="share-2"
              size={20}
              onPress={shareIntention}
            />
            {!hasNotif(selectedIntention?.id || '') && (
              <Feather.Button
                name="bell"
                backgroundColor={theme.colors.blue}
                size={20}
                onPress={() => setShow(true)}
              />
            )}
            {hasNotif(selectedIntention?.id || '') && (
              <Feather.Button
                name="bell-off"
                backgroundColor={theme.colors.blue}
                size={20}
                onPress={removeNotifi}
              />
            )}
            {edit && (
              <Feather.Button
                backgroundColor={theme.colors.blue}
                name="save"
                size={20}
                onPress={updateInt}
              >
                <Text style={styles.buttonText}>Sauvegarder</Text>
              </Feather.Button>
            )}
          </View>
          {edit ? (
            <TextInput
              value={intentionEdit}
              onChangeText={setIE}
              style={styles.inputEditing}
              multiline
            />
          ) : (
            <Text style={styles.modalText}>{selectedIntention?.intention}</Text>
          )}
        </View>
      </Modal>
      <Modal open={preDelete} onClose={() => openPreDelete(!preDelete)}>
        <View style={styles.container}>
          <View style={styles.actionsDelete}>
            <Feather
              name="trash"
              size={20}
              color={theme.colors.white}
              onPress={() => {
                removeNotifi()
                deleteIntention()
                openPreDelete(false)
              }}
            >
              <Text style={styles.buttonText}>Oui supprimer</Text>
            </Feather>
            <Feather
              name="x"
              size={20}
              color={theme.colors.white}
              onPress={() => openPreDelete(false)}
            >
              <Text style={styles.buttonText}>Oups ! Non je ne veux pas</Text>
            </Feather>
          </View>
          <Text style={styles.modalText}>
            Etes vous sûr de vouloir supprimer cette intention ?
          </Text>
        </View>
      </Modal>
      <TimePicker open={show} onClosePicker={addTheNotif} />
      <View>
        {intentions &&
          intentions.map((int) => (
            <IntentionCard
              key={int.id}
              intention={int}
              hasNotif={hasNotif(int.id)}
              onPress={() => focusIntention(int.id)}
            />
          ))}
      </View>
      <WriteIntention addIntention={addIntention} />
    </Page>
  )
}

const styles = StyleSheet.create({
  actions: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginBottom: 15
  },
  actionsDelete: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 14,
    marginLeft: 5
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputEditing: {
    borderColor: theme.colors.white + '12',
    borderWidth: 1,
    color: theme.colors.white,
    paddingHorizontal: 5,
    width: '100%'
  },
  modalText: {
    color: theme.colors.white,
    fontSize: 14
  }
})

const mapToProps = (state: RootState) => ({
  intentions: state.intentions.intentions,
  userId: state.user.user?.id,
  notifs: state.notifs.notifs
})

export default connect(mapToProps)(IntentionsScreen)
