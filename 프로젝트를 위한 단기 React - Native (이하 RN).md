# 프로젝트를 위한 단기 React - Native (이하 RN)



## 0. 프로젝트 폴더 구성

* 프로젝트 폴더의 이름은 HeoSeongSoo입니다.

* /assets 폴더에는 icon 파일과 splash(앱 실행시 로딩 화면)을 위한 이미지 파일이 존재합니다.

* /pages 폴더에는 Screen (하나의 화면)을 이루는 .js 파일들이 존재합니다. 이 파일들이 실질적인 프로젝트 파일입니다.
* /components 폴더에는 pages 폴더의 Screen에서 중복되어 사용되는 컴포넌트들이 존재합니다.



## 1. Expo

  우리 프로젝트는 Expo를 채택했습니다. Expo란 RN을 한 겹 감싼 것입니다. 그래서 우리는 직접 RN을 사용하는 것이 아니라 Expo를 거쳐 RN을 사용하게 됩니다. 'React - Native' 라는 이름에 걸맞게 핵심은 React와 거의 비슷합니다. [React 주요 개념](https://ko.reactjs.org/docs/introducing-jsx.html)은 읽어보면 좋습니다. 필수는 아닙니다. 안 읽어도 작업할 수 있습니다.



#### 장점

* 개발환경 구성이 몹시 쉽다.

#### 단점

* 모바일 디바이스의 깊은 곳까지 조작할 수 없습니다.(커널, 네이티브[Java, Swift를 사용한 구현] 등)
* 일부 기능은 RN에서는 제공하지만 Expo에서는 제공하지 않을 수도 있습니다.

  프로젝트에서 요구하는 기능을 살펴보았을 때, 모바일 디바스를 활용하는 것은 카메라, 갤러리에서 이미지를 로드하는 것 뿐었고 Expo는 그것을 제공하므로 Expo를 채택했습니다.



### 시작

```bash
$ npm install --global expo-cli
$ cd ../HeoSeongSoo {project folder}
$ npm i
$ expo start
```



 expo start 명령어 후에 실행되는 웹 페이지에서 좌하단에 QR 코드를 발견할 수 있습니다.

 Play store에서 Expo를 다운받아 실행하면 QR코드를 스캔해 프로젝트를 디바이스에서 실행할 수 있습니다.

  기타 튜토리얼은 [Expo docs](https://docs.expo.io/)에서 확인할 수 있습니다.



## 2. XML

RN은 화면 구성에 XML을 이용합니다.

```xml
return (
	<>
        <TouchableWithoutFeedback onPress={changeHeart}>
            <heartContainer>
                <heartText>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</heartText>
            </heartContainer>
        </TouchableWithoutFeedback>
		<Text>people love you</Text>
	</>
);
```

  XML은 HTML과 비슷한데, 태그 이름이 고정된 것이 아니라는 점이 가장 큰 차이점입니다.

  Vue.js의 template영역과 비슷하게 RN에서 return하는 XML은 하나의 큰 틀에 묶여야 합니다. 논리적으로만 묶는 태그로는 `<></>`가 있습니다.



### 주요 태그

 #### SafeAreaView, View

  html의 div와 같은 역할을 합니다. SafeAreaView는 모바일 디바이스(ios)의 notch를 제외한 영역을 의미합니다. 전체 컨테이너는 SafeAreaView를 권장합니다. 모든 레이아웃 구성은 flex를 이용합니다. 자세한 내용은 [flexbox](https://reactnative.dev/docs/flexbox) 를 참고하세요.



#### Text

  html의 p와 같은 역할을 합니다. 차이점이 있다면 모든 텍스트는 Text 태그 내부에 존재해야 합니다. View 내부에 Text 태그 없이 텍스트가 디스플레이 될 수 없습니다.



#### TouchableWithoutFeedback, TouchableHighlight

  onPress 속성을 부여할 수 있는 태그입니다. TouchableWithoutFeedback은 터치 효과가 따로 없습니다. 공식 문서에는 "All elements that respond to press should have a visual feedback when touched." 라며 사용을 막고 있습니다. 다만, TouchableWithoutFeedback을 사용하는 대부분의 곳에서 화면 전환을 유발하기 때문에 채택했습니다.

  TouchableHighlight는 터치 효과가 존재합니다.

  이 태그들은 기본 스타일 값 없이 내부 컨텐츠를 감쌀 뿐입니다.



#### styled를 이용해 선언된 컴포넌트들

  대부분의 ~Screen.js 파일에서 아래와 같이 선언된 컴포넌트들을 발견할 수 있습니다.

```javascript
// 코디 이미지
const CodiItemImg = styled.Image`
    width: `${props.imgWidth}`;
    height: 50%;
    resize-mode: cover;
`;

// 하트를 품은 뷰
const heartContainer = styled.View`
    margin: 5px;
    justify-content: space-between;
`;
```

  RN의 기본 태그들을 상속받고, 텍스트로 작성된 css를 적용시킨 컴포넌트를 생성하는 코드입니다. 템플릿 리터럴을 사용하므로 내부에 `${}`를 통해 동적으로 css값을 변경할 수 있습니다. 추가적인 내용은 [styled-component](https://styled-components.com/docs/basics#motivation) 를 참고하세요.



#### StyleSheetComponent.js

  components 폴더 내부에 StyleSheetComponent.js 파일이 있습니다. 공통되는 스타일들을 관리하는 컴포넌트입니다. RN에서는 css파일을 따로 관리하지 않으므로, 전체에 적용되는 css파일이 없습니다. 따라서 이곳에서 스타일 값들을 조정하면 됩니다.

  RN의 스타일 문법은 css와 살짝 다릅니다. css의 `-`를 이용한 공백 구분을 카멜 케이스로 변경하면 됩니다. css에는 있지만 RN에서는 제공하지 않을 수도 있습니다. 아이디, 클래스, 태그 선택자는 없습니다. 자세한 내용은 [Style](https://reactnative.dev/docs/style) 을 참고하세요.



#### 조건 렌더링, 반복 렌더링

상태 값에 따라 동적으로 렌더링되는 컴포넌트는 논리 연산자, 삼항 연산자를 통해 수행할 수 있습니다. 

```xml
// itemLike.liked가 참이면 붉은 하트, 거짓이면 보라 하트를 렌더링 합니다. 
<heartText>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</heartText>

// itemLike.liked가 참이면 붉은 하트가 렌더링되고, 거짓이면 아무것도 렌더링되지 않습니다.
<heartText>{itemLike.liked && '❤️'}{ itemLike.likes }</heartText>
```



반복되는 렌더링은 JS에서 기본적으로 제공하는 헬퍼 메소드인 .map()으로 수행할 수 있습니다.

```xml
{tempItems.map(item => {
	return (
		<TouchableWithoutFeedback>
		    <CodiItemImg source={{uri: item.img}}/>
		</TouchableWithoutFeedback>
	);
}
```



## 3. Javascript

RN의 로직은 Javascript를 이용해 구성합니다. Vue.js의 data와 비슷하게, RN에서도 동적 렌더링에 필요한 값, 상태관리에 필요한 대상들을 따로 정의합니다.

```react
const [itemLike, setLikeItem] = React.useState({liked: route.params.item.liked, likes: route.params.item.likes});
    
React.useEffect(() => {
    navigation.setOptions({title: `${route.params.item.user}님의 코디`});
}, [route.params.item?.user]);
```



#### React.useState()

 `[itemLike, setLikeItem]` 배열의 `itemLike`는 state값입니다. `setLikeItem()`으로 `itemLike`의 값을 변경하면 해당 값을 참조하는 태그들이 다시 렌더링됩니다. RN은 [immutable](https://ko.reactjs.org/docs/react-component.html#state) 하게 state값을 관리하기 때문에 직접 `itemLike`의 값을 변경해서는 안 됩니다. [immutable을 사용하는 이유](https://medium.com/@ljs0705/react-state%EA%B0%80-%EB%B6%88%EB%B3%80%EC%9D%B4%EC%96%B4%EC%95%BC-%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0-ec2bf09c1021) 를 참고하세요.



#### React.useEffect()

useEffect는 Vue.js의 mounted() 훅과 watch 기능을 합쳐놓은 것과 같습니다. 따라서 무한 렌더링이 이루어지지 않도록 주의해서 다루어야합니다. 상단의 예시코드에서 `useEffect`내부에서`navigation.setOptions`을 명령하고 있습니다. 이 명령어는 DOM이 처음 렌더링 될 때 실행되고, `route.params.item?.user`의 값이 변경될 때마다 실행됩니다. `route.params.item?.user`의 값에 watch를 걸어놓은 것과 같습니다. 이것을 사용하는 방법은 매우 다양하므로 [useEffect](https://ko.reactjs.org/docs/hooks-effect.html) 를 참고하세요.



#### React Navigation

React Navigation은 화면 전환을 가능하게합니다. App.js에 화면들이 선언되어 있습니다.

```xml
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
```

App.js에는 추가적인 화면이 더 선언되고 엮여있습니다. 이곳에 등록되어야만 `navigtaion.navigate("{screen name}")`으로 화면 이동을 실행할 수 있습니다.

화면을 이동하면서 데이터를 함께 전달할 수 있습니다.

```javascript
// 'WebView' 화면으로 이동합니다. item.url 값을 함께 전달합니다.
navigation.navigate('WebView', { url: item.url })

// WebViewScreen에서는 route.params에서 전달한 값을 확인할 수 있습니다.
function WebViewScreen({ route }) {
    const url = route.params.url
    return(
      <WebView source={{ uri: url }} style={{ marginTop: 20 }} />
    );
}
```

자세한 내용은 [React Navigation](https://reactnavigation.org/docs/hello-react-navigation)을 참고하세요.



#### React에도 Vuex같은 Redux가 있다.

Redux에 관한 내용은 [Redux란?](https://medium.com/@ca3rot/%EC%95%84%EB%A7%88-%EC%9D%B4%EA%B2%8C-%EC%A0%9C%EC%9D%BC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-%EC%89%AC%EC%9A%B8%EA%B1%B8%EC%9A%94-react-redux-%ED%94%8C%EB%A1%9C%EC%9A%B0%EC%9D%98-%EC%9D%B4%ED%95%B4-1585e911a0a6) 를 참고하세요. 우리 프로젝트에서는 사용하지 않았습니다.

 우리는 공유하는 데이터를 아래와 같이 [context](https://ko.reactjs.org/docs/context.html) 를 이용하거나, `navigation.navigate`의 `params`를 이용해 처리했습니다. Javascript에서 함수는 1급 시민이므로 context로 공유할 수 있습니다. 전체 코드는 프로젝트 파일 App.js 와 ./pages/SignupScreen.js 에서 확인할 수 있습니다.

``` javascript
////////////////////////////////////////////////App.js////////////////////////////////////////////////////
import AuthContext from './components/AuthContext';

function App() {
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
        <AuthContext.Provider value={authContext}>
            <Stack.Navigator>
                <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
                <Stack.Screen options={{headerShown: false}} name="Sign up" component={SignupScreen} />
            </Stack.Navigator>
        </AuthContext.Provider>
     );
}


///////////////////////////////////////////////SignupScreen.js/////////////////////////////////////////////
import AuthContext from '../components/AuthContext';

const { signUp } = React.useContext(AuthContext);


<Button
	onPress={() => {
        axios.patch(ServerUrl.url + 'rest-auth/user/', patchData, requestHeaders)
            .then(res => {
            // signUp 함수를 호출하면 App.js에서 선언된 함수가 실행됩니다.
            signUp(userToken);
        })
            .catch(err => console.log(err.response.data))}
        }
}>
    제출
</Button>
```



## 4. 스타일링 참고

[Animated](https://docs.expo.io/versions/latest/react-native/animated/)

[Icons](https://docs.expo.io/guides/icons/) [Icon list](https://icons.expo.fyi/)

[Design sample](https://www.pinterest.co.kr/ubechen/app-ui-design-template/?autologin=true)