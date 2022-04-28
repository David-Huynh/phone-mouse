import React from 'react';
import { StyleSheet, Text, View, PermissionsAndroid  } from 'react-native';
import Zeroconf from 'react-native-zeroconf';

import GyroscopeComponent from './src/components/gyroscope';

export default function App() {
  const [services, setServices] = React.useState(null)
  
  const zeroconf = new Zeroconf()

  
  zeroconf.on('resolved', (service) => {
    if (service.name === 'PhoneServer' && services === null) {
      console.log('resolved', service)
      setServices(service)
    }
  })

  React.useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
      PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
      PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_MULTICAST_STATE,
    ).then(granted => {
      if (granted) {
        console.log('Permission Granted');
        zeroconf.scan('http', 'tcp', 'local.')
      } else {
        console.log('Permission denied');
      }
    }
    );
  }, []);

  return (
    <View style={styles.container}>
      { services === null ? <Text> Desktop not found </Text> : <GyroscopeComponent services={services}/>}
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
});
