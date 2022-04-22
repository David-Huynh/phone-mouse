import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';

import { RNSerialport, definitions, actions } from "react-native-serialport";
import { DeviceEventEmitter } from "react-native";

const GYROSCOPE_UPDATE_INTERVAL = 10;

export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );

    Gyroscope.setUpdateInterval(GYROSCOPE_UPDATE_INTERVAL);
  };


  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    // Subscribes to gyroscope events only if sensor exists
    if (Gyroscope.isAvailableAsync()) {
      _subscribe();
    }
    return () => _unsubscribe();
  }, []);
  const { x, y, z } = data;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gyroscope:</Text>
      <Text >
        x: {x.toFixed(2)} y: {y.toFixed(2)} z: {z.toFixed(2)}
      </Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
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
