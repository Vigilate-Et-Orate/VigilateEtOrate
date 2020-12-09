import React from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import { TLectureAelf } from 'config/types/AelfApi'

import { Header } from 'elements/text/Text'
import Page from 'components/layout/Page'
import { RootState } from 'red/reducers/RootReducer'

const GospelScreen = ({
  evangile
}: {
  evangile: TLectureAelf | undefined
}): JSX.Element => {
  return (
    <Page title="Evangile">
      <ScrollView style={{ paddingTop: 25, paddingHorizontal: 20 }}>
        <Header>{evangile?.titre}</Header>
        <Text style={{ justifyContent: 'flex-end', marginBottom: 15 }}>
          {evangile?.ref}
        </Text>
        <Text style={{ marginBottom: 15 }}>{evangile?.contenu}</Text>
      </ScrollView>
    </Page>
  )
}

const mapToProps = (state: RootState) => ({
  evangile: state.evangile.evangile
})

export default connect(mapToProps)(GospelScreen)
