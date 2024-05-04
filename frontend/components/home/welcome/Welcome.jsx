import React from 'react'

import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import {useRouter} from 'expo-router'

import styles from './welcome.style'
import {COLORS, icons, images, SIZES, FONTS} from '../../../constants'	

const Welcome = () => {
  const router = useRouter();

  const [pep, setPep] = useState([""]);

  return (
    <View>
      <Text style={styles.logoImg("100%")}>Welcome to WhatsApp Roulette</Text>
        <Image 
          source={images.whatsAppLogo} 
          resizeMode="cover"
          style={styles.logoImg("100%")}
        />
      <View style={styles.container}>
        <Text style={styles.userName}>Hello "NAME"</Text>
        <Text style={styles.welcomeMessage}>Find your job</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
        <TextInput style={styles.searchInput} placeholder='JOIN PARTY' onChangeText={(text) => {setPep(text);}}>
        </TextInput>
        </View>
      </View>
    </View>
  )
}

export default Welcome