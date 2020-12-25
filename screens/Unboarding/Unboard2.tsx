import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { connect, useDispatch } from 'react-redux'

import theme from 'config/theme'
import { WriteIntention } from 'components/intentions/Blocks'
import { postIntention } from 'utils/api/api_firebase'
import { addIntentions } from 'red/actions/IntentionsActions'
import { RootState } from 'red/reducers/RootReducer'

const Unboard = ({ userId }: { userId: string | undefined }): JSX.Element => {
  const dispatch = useDispatch()
  const addIntention = async (intention: string) => {
    await postIntention(intention, userId)
    dispatch(addIntentions(intention, userId))
  }

  return (
    <View style={styles.background}>
      <Text style={styles.title}>
        Vous pouvez ajouter une intention de prière
      </Text>
      <WriteIntention addIntention={addIntention} />
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: '10%',
          justifyContent: 'center'
        }}
      >
        <FontAwesome5 name="pray" size={120} color={theme.colors.green} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.lightGreen,
    height: '100%'
  },
  title: {
    color: theme.colors.white,
    marginBottom: 10,
    marginTop: '20%',
    paddingHorizontal: 25,
    fontSize: 36
  }
})

const mapToProps = (state: RootState) => ({
  userId: state.user.user?.id
})

export default connect(mapToProps)(Unboard)
