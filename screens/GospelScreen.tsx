import React from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'

import { TLectureAelf } from 'config/types/TAelfApi'

import Page from 'components/layout/Page'
import { RootState } from 'red/reducers/RootReducer'
import theme from 'config/theme'

const GospelScreen = ({
  evangile
}: {
  evangile: TLectureAelf | undefined
}): JSX.Element => {
  return (
    <Page title="Evangile" backgroundColor={theme.colors.blue}>
      <ScrollView style={styles.view}>
        <Text style={styles.title}>{evangile?.titre}</Text>
        <Text style={styles.reference}>{evangile?.ref}</Text>
        <Text style={styles.content}>{evangile?.contenu}</Text>
      </ScrollView>
    </Page>
  )
}

const styles = StyleSheet.create({
  content: { marginBottom: 15 },
  reference: { justifyContent: 'flex-end', marginBottom: 15 },
  title: { fontSize: 26 },
  view: { paddingHorizontal: 20, paddingTop: 25 }
})

const mapToProps = (state: RootState) => ({
  evangile: state.evangile.evangile
})

export default connect(mapToProps)(GospelScreen)
