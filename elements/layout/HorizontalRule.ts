import { View } from 'react-primitives'
import styled from 'styled-components'

const HorizontalRule = styled(View)`
  border-bottom-color: ${(props: any) => props.theme.colors.ultraLightGrey};
  border-bottom-width: 1px;
  height: 0px;
  overflow: visible;
  margin-bottom: 20px;
`

export default HorizontalRule