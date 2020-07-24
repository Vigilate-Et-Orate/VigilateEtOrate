import React from 'react'
import { ScrollView, Text } from 'react-native'

import Title from 'elements/text/Title'
import Screen from 'elements/layout/Screen'
import HorizontalRule from 'elements/layout/HorizontalRule'

const Angelus = () => {
  return (
    <Screen>
      <Title>Angelus</Title>
      <HorizontalRule />
      <Text>L'ange du Seigneur porta l'annonce à Marie</Text>
      <Text style={{ color: 'gray' }}>Qu'elle serait la mère du Sauveur</Text>
      <Text>Me voici dit Marie, je suis la servante du Seigneur</Text>
      <Text style={{ color: 'gray' }}>Qu'il me soit fait selon sa parole</Text>
      <Text>Et le verbe s'est fait cher, conçu du saint esprit</Text>
      <Text style={{ color: 'gray' }}>Et il a habité parmis nous</Text>
      <Text>Priez pour nous Sainte Mère de Dieu</Text>
      <Text style={{ color: 'gray' }}>
        Afin que nous soyons rendus dignes des promesses de notre Seigneur Jésus
        Christ
      </Text>
      <Text>Prions</Text>
      <Text style={{ color: 'gray' }}>
        Répendez s'il vous plaît Seigneur votre grâce en nos âmes afin qu'ayant
        connu par le message de l'ange, l'incarnation de Jésus Christ votre
        fils, nous arrivions par sa passion et par sa croix, à la gloire de sa
        resurection, par le même Jésus Christ notre Seigneur
      </Text>
      <Text>Amen</Text>
    </Screen>
  )
}

export default Angelus
