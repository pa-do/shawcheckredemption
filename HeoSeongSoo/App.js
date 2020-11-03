import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/HomeScreen';
import CodiAllListScreen from './pages/CodiAllListScreen';
import CodiDetailScreen from './pages/CodiDetailScreen';
import CodiFormScreen from './pages/CodiFormScreen';
import CodiMyListScreen from './pages/CodiMyListScreen';
import CodiPickListScreen from './pages/CodiPickListScreen';
import CodiRecListScreen from './pages/CodiRecListScreen';
import ImgUploadForRecScreen from './pages/ImgUploadForRecScreen';
import MyItemsScreen from './pages/MyItemsScreen';
import WebViewScreen from './pages/WebViewScreen';
import CameraScreen from './pages/CameraScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="All" component={CodiAllListScreen} />
        <Stack.Screen name="Detail" component={CodiDetailScreen} />
        <Stack.Screen name="MyList" component={CodiMyListScreen} />
        <Stack.Screen name="PickList" component={CodiPickListScreen} />
        <Stack.Screen name="RecList" component={CodiRecListScreen} />
        <Stack.Screen name="Form" component={CodiFormScreen} />
        <Stack.Screen name="ImgUpload" component={ImgUploadForRecScreen} />
        <Stack.Screen name="MyItemsScreen" component={MyItemsScreen} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;