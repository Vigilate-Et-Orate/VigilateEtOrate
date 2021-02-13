import React, { useState } from 'react'
import { StyleSheet, View, Text, Vibration } from 'react-native'

import { TIntention } from 'config/types/Intention'
import { WriteIntention, IntentionCard } from 'components/intentions/Blocks'
import theme from 'config/theme'
import { connect, useDispatch } from 'react-redux'
import { RootState } from 'red/reducers/RootReducer'
import { postIntention } from 'utils/api/api_firebase'
import { addIntentions } from 'red/actions/IntentionsActions'
import Page from 'components/layout/Page'

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
    Vibration.vibrate(20)
  }

  return (
    <Page
      title="Mes Intentions"
      backgroundColor={theme.colors.green}
      foregroundColor={theme.colors.blue}
    >
      <Text style={styles.h3}>Ecrire une intention</Text>
      <WriteIntention addIntention={addIntention} />
      <Text style={styles.h3}>Intentions</Text>
      <View>
        {Array.isArray(intentions) &&
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
    </Page>
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
