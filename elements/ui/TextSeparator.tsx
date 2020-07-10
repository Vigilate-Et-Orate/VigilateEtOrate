import React from 'react'
import styled from 'styled-components'
import { View } from 'react-primitives'

import Text from '../text/Text'

const StyledView = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${props => props.theme.colors.ultraLightGrey};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0 30px;
`

const StyledAbsoluteView = styled(View)`
  padding: 0 10px;
  height: 30px;
  background-color: #EBEBEB;
`

const StyledText = styled(Text)`
  font-size: 22px;
`

const TextSeparator = ({ children }: any) => {
  <StyledView>
    <StyledAbsoluteView>
      <StyledText color="white">{children}</StyledText>
    </StyledAbsoluteView>
  </StyledView>
}

export default TextSeparator