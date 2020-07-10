import styled from 'styled-components'
import { Text as BaseText } from 'react-primitives'

interface ITextProps {
  color?: string,
  bold?: boolean
}

const Text = styled(BaseText)<ITextProps>`
  color: black
`

Text.defaultProps = {
  color: 'black'
}

export default Text