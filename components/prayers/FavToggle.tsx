import theme from 'config/theme'
import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

type FavToggleProps = {
  filter: (fav: boolean) => void
}

const FavToggle = ({ filter }: FavToggleProps): JSX.Element => {
  const [fav, setFav] = useState(false)

  const handleToggle = () => {
    setFav(!fav)
    filter(fav)
  }

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={[
        styles.container,
        fav ? styles.containerFav : styles.containerNotFav
      ]}
    >
      <View style={styles.background}>
        <Text style={styles.backgroundTxt}>{fav ? 'Tout' : 'Favoris'}</Text>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonTxt}>{fav ? 'Favoris' : 'Tout'}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  backgroundTxt: {
    color: theme.colors.blue,
    fontSize: 12
  },
  button: {
    backgroundColor: theme.colors.blue,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  buttonTxt: {
    color: theme.colors.yellow
  },
  container: {
    alignItems: 'center',
    borderColor: theme.colors.blue,
    borderRadius: 20,
    borderWidth: 2,
    padding: 2
  },
  containerFav: {
    flexDirection: 'row'
  },
  containerNotFav: {
    flexDirection: 'row-reverse'
  }
})

export default FavToggle
