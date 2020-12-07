import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {getV2BrowserResponse, getV3BrowserResponse} from '../shared/utils';

const App = () => {
  const [v2Response, setV2Response] = useState('');
  const [v3Response, setV3Response] = useState('');

  useEffect(async () => {
    const v2Response = await getV2BrowserResponse();
    const v3Response = await getV3BrowserResponse();

    setV2Response(JSON.stringify(v2Response, null, 2));
    setV3Response(JSON.stringify(v3Response, null, 2));
  });

  return (
    <View style={styles.container}>
      <Text style={styles.content}>v2 response: {this.state.v2Response}!</Text>
      <Text style={styles.content}>v3 response: {this.state.v3Response}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    fontSize: 20,
    margin: 10,
  },
});

export default App;
