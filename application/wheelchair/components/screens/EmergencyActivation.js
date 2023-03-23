import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  Button,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { text } from '../../helpers/en' 

const EmergencyActivation = ({lang}) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const socket = io('http://localhost:5003');

    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('message', data => {
      console.log('Received message:', data);
    });
    setContacts();
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSendMessage = () => {
    fetch('http://127.0.0.1:5003/send')
      .then(r => r.json())
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  };
  // const phoneNumber = '6478635069';
  const setContacts = async () => {
    const contacts = await AsyncStorage.getItem('emergencyContacts');
    if (contacts) {
      setUsers(JSON.parse(contacts).users);
    }
  };
  const handleCallPress = number => {
    Linking.openURL(`tel:${number}`);
  };
  return (
    <View>
      {/* <TouchableOpacity
          onPress={() => handleSendMessage()}
            >
            <Text
              >
              send message
            </Text>
          </TouchableOpacity> */}
      <View style={styles.emergencyContactsContainer}>
        <View style={styles.emergencyContacts}>
          <View>
            <Text
              style={
                styles.textStyle
              }>{text[lang].police}</Text>
          </View>
          <Button
            onPress={() => handleCallPress('911')}
            title={text[lang].call}
            color="#841584"
          />
        </View>
        {users.map((user, index) => (
          <View key={index} style={styles.emergencyContacts}>
            <Text style={styles.textStyle}>{`${user.firstName} ${user.lastName}`}</Text>
            <Button
              style={styles.callBtnStyle}
              onPress={() => handleCallPress(user.mobileNumber)}
              title={text[lang].call}
              color="#841584"
            />
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  emergencyContactsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  textStyle: {
    color: 'black',
  },
  emergencyContacts: {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 5,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: '#000',
  },
  callBtnStyle: {
    width: 80
  } 
});
export default EmergencyActivation;
