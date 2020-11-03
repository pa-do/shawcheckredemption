import * as React from 'react';
import { WebView } from 'react-native-webview';

function WebViewScreen({ route }) {
    const url = route.params.url
    return(
      <WebView source={{ uri: url }} style={{ marginTop: 20 }} />
    );
  }

export default WebViewScreen;
