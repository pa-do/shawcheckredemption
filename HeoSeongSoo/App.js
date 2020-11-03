import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
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
const Tab = createMaterialBottomTabNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'md-star' : 'md-star-outline';
            size = focused ? 25 : 20;
          } else if (route.name === 'My Page') {
            iconName = focused ? 'ios-contact' : 'ios-contact';
            size = focused ? 25 : 20;
          } else if (route.name === 'All') {
            iconName = focused ? 'ios-albums' : 'ios-albums';
            size = focused ? 25 : 20;
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
        <Tab.Screen options={{headerShown: false}} name="All" component={CodiAllListScreen} />
        <Tab.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
        <Tab.Screen options={{headerShown: false}} name="My Page" component={CodiMyListScreen} />
    </Tab.Navigator>
  )
}

function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen name="TapScreen" component={TabScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Detail" component={CodiDetailScreen} />
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