import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import {images} from '../../../constants'

import styles from '../../../components/common/header/screenheader.style'

const Welcome = () => {
  return (
    <View>
      <Text style={styles.logoImg("100%")}>Welcome to WhatsApp Roulette</Text>
        <Image 
          source={images.whatsAppLogo} 
          resizeMode="cover"
          style={styles.logoImg("100%")}
        />
    </View>
  )
}

export default Welcome