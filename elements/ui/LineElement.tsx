import { View, Text, Touchable } from 'react-primitives'
import styled from 'styled-components'
import React, { useState } from 'react'


const StyledText = styled(Text)`
  font-size: 24px;
  color: black;
  margin-left: 10px;
  margin-right: 10px;
`

type ButtonSwitch = {
  active: boolean
}

const ButtonView = styled(View)<ButtonSwitch>`
  background-color: ${props => props.active ? '#CA2D02' : '#35415A'};
  border-radius: 15px;
  height: 45px;
  margin-bottom: 15px;
  padding: 12px;
`

const ButtonText = styled(Text)`
  color: white;
  text-align: center;
  font-size: 16px;
`

const StyledTouchable = styled(Touchable)`
  border: 2px solid red;
`

const Button = ({ title, onPress, active }: any) => {
  return (
    <StyledTouchable onPress={onPress} style={{ flex: 1 }}>
      <ButtonView active={active}>
        <ButtonText>{title}</ButtonText>
      </ButtonView>
    </StyledTouchable>
  )
}

const capitalise = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

type Props = {
  title: string,
  activeInitial: boolean
}

const LineElement = ({ title, activeInitial }: Props) => {
  let [active, setActive] = useState(activeInitial)

  return (
    <View style={{ flex: 1, flexDirection: 'row'}}>
      <View style={{ width: '60%' }}>
        <StyledText>{capitalise(title)}</StyledText>
      </View>
      <View style={{ width: '40%' }}>
        <Button
          title={active ? 'Deactivate' : 'Register'}
          onPress={() => setActive(!active)}
          active={active} />
      </View>
    </View>
  )
}

export default LineElement 