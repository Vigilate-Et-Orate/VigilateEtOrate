import React from 'react'
import { Text, Touchable, View } from 'react-primitives'
import styled from 'styled-components'

const ButtonView = styled(View)`
  background-color: #35415A;
  border-radius: 4px;
  height: 45px;
  margin-bottom: 15px;
  padding: 12px;
  margin-right: 20px;
  margin-left: 20px;
`

const ButtonText = styled(Text)`
  color: white;
  text-align: center;
  font-size: 16px;
`

const Button = ({ title, onPress }: any) => (
  <Touchable onPress={onPress}>
    <ButtonView>
      <ButtonText>{title}</ButtonText>
    </ButtonView>
  </Touchable>
)

export default Button