import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';


const INITIAL_UPDATE_INTERVAL = 10;

export default function GyroscopeComponent({services}) {
    const [subscription, setSubscription] = React.useState(null);
    
    // function to subscribe to gyroscope data
    const _subscribe = () => {
      setSubscription(
        Gyroscope.addListener(gyroscopeData => {
          if (readyState === ReadyState.OPEN) {
            sendMessage(`${gyroscopeData.x.toFixed(0)},${gyroscopeData.y.toFixed(0)},${gyroscopeData.z.toFixed(0)}`);
          }
        })
      );
  
      Gyroscope.setUpdateInterval(INITIAL_UPDATE_INTERVAL);
    };
    const _unsubscribe = () => {
      subscription && subscription.remove();
      setSubscription(null);
    };
    

    // Sets update interval for the gyroscope sensor
    const _setUpdateInterval = (value) => {
        if (Number(value) > 0) {
            Gyroscope.setUpdateInterval(Number(value));
        } else {
            Gyroscope.setUpdateInterval(10);
        }
    };
    // Websocket Hook connection through zero conf
    const {
      sendMessage,
      readyState,
      getWebSocket
    } = useWebSocket(`ws://${services.host}:${services.port}${services.txt.path}/app`, {
      onOpen: () => console.log('opened'),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => {
        console.log('closeEvent', closeEvent);
        return true
      },
    });
    //Subscribes to gyroscope data
    useEffect(() => {
      _subscribe();
      return () => _unsubscribe();
    }, []);
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Gyroscope:</Text>
        <View style={styles.container}>
            <Text>Update interval(ms): </Text>
            <TextInput value={INITIAL_UPDATE_INTERVAL.toString()} style={styles.textInput} onChangeText={_setUpdateInterval}/> 
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
            <Text style={styles.text}>{subscription ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    text: {
      textAlign: 'center',
    },
    textInput: {
        minWidth: '100%',
        height: 40,
        backgroundColor: '#eee',
        borderColor: '#ccc',
        borderWidth: 1,
        margin: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'stretch',
      marginTop: 30,
    },
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eee',
      padding: 10,
    },
  });
  