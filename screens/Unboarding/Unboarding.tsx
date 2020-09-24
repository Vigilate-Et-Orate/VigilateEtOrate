import React, { useState } from 'react'
import { View, Button } from 'react-native'

import theme from 'config/theme'
import Stack from 'components/layout/Routes'

const Unboarding = (): JSX.Element => {
  const [unboarded, setUnboarded] = useState(false)

  if (!unboarded)
    return (
      <View
        style={{
          backgroundColor: theme.colors.blue,
          height: '100%',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Button title="Unboard!" onPress={() => setUnboarded(true)} />
      </View>
    )
  return <Stack />
}

export default Unboarding
