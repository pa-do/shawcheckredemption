import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './pages/HomeScreen';
import CodiAllListScreen from './pages/CodiAllListScreen';
import CodiDetailScreen from './pages/CodiDetailScreen';
import CodiFormScreen from './pages/CodiFormScreen';
import CodiMyListScreen from './pages/CodiMyListScreen';
import CodiRecListScreen from './pages/CodiRecListScreen';
import ImgUploadForRecScreen from './pages/ImgUploadForRecScreen';
import WebViewScreen from './pages/WebViewScreen';
import CameraScreen from './pages/CameraScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import AuthContext from './components/AuthContext';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// 하단 탭 네비게이션의 테마 값입니다.
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

function StackScreen1() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
      <Stack.Screen name="RecList" component={CodiRecListScreen} />
      <Stack.Screen name="ImgUpload" component={ImgUploadForRecScreen} />
    </Stack.Navigator>
  );
}

function StackScreen2() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="All" component={CodiAllListScreen} />
      <Stack.Screen name="Detail" component={CodiDetailScreen} />
    </Stack.Navigator>
  );
}

function StackScreen3() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="My Page" component={CodiMyListScreen} />
      <Stack.Screen name="Form" component={CodiFormScreen} />
    </Stack.Navigator>
  );
}

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
          
          // 클릭된(포커스되는) 하단 탭의 아이콘입니다.
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
        <Tab.Screen options={{headerShown: false}} name="Home" component={StackScreen1} />
        <Tab.Screen options={{headerShown: false}} name="All" component={StackScreen2} />
        <Tab.Screen options={{headerShown: false}} name="My Page" component={StackScreen3} />
    </Tab.Navigator>
  )
}

const removeUserToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (e) {
    // saving error

  }
}

const storeData = async (value) => {
  try {
  //   const jsonValue = JSON.stringify(value) // 객체일 때
    await AsyncStorage.setItem('userToken', value)
  } catch (e) {
    // saving error
  }
}

function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          storeData(action.token);
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          storeData(action.token);
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          removeUserToken();
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      console.log('get first user token >>>>>>>>>>>>>>>>>>>>>>', userToken)
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // 로그인 로직을 실행한 뒤 돌아오는 토큰을 담아 dispatch 합니다.
        // 로그인을 위한 데이터는 data에 담겨 옵니다.
        console.log(data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<< sign in data')
        dispatch({ type: 'SIGN_IN', token: data });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        console.log(data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<< sign up data');
        dispatch({ type: 'SIGN_IN', token: data });
      },
    }),
    []
  );
  
  return (
    <NavigationContainer theme={ MyTheme }>
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator>
          {state.userToken === null ? (
            <>
              <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
              <Stack.Screen options={{headerShown: false}} name="Sign up" component={SignupScreen} />
              <Stack.Screen name="Camera" component={CameraScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="TapScreen" component={TabScreen} options={{headerShown: false}}/>
              <Stack.Screen options={{headerShown: false}} name="WebView" component={WebViewScreen} />
              <Stack.Screen options={{headerShown: false}} name="Camera" component={CameraScreen} />
            </>
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

export default App;