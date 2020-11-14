import React from  'react';
import { View } from 'react-native';
import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { TextInput, Button } from 'react-native-paper';
import AuthContext from '../components/AuthContext';
import { ServerUrl } from '../components/TextComponent';
import axios from 'axios';

const Container = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    padding-top: ${Constants.statusBarHeight}px;
`;

const ErrorMsg = styled.Text`
    color: red;
    font-size: 12px;
`;

function LoginScreen({ navigation }) {
    const [textAccount, setTextAccount] = React.useState('');
    const [textPassword, setTextPassword] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState(null);

    const { signIn } = React.useContext(AuthContext);

    return (
        <Container>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    label="아이디"
                    value={textAccount}
                    onChangeText={text => setTextAccount(text)}
                    style={{ width: '85%', backgroundColor: 'rgba(0, 0, 0, 0)'}}
                    theme={{colors: {primary: '#0d3754'}}}
                />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    label="비밀번호"
                    type="password"
                    value={textPassword}
                    onChangeText={text => setTextPassword(text)}
                    secureTextEntry
                    style={{ width: '85%', backgroundColor: 'rgba(0, 0, 0, 0)'}}
                    theme={{colors: {primary: '#0d3754'}}}
                />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {errorMsg !== null ? <ErrorMsg style={{ width: '85%', backgroundColor: 'rgba(0, 0, 0, 0)', marginLeft: 20}}>{ errorMsg }</ErrorMsg> : null}
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <Button
                    mode="contained"
                    onPress={() => {
                        if (textAccount.length === 0 || textPassword.length === 0) {
                            return setErrorMsg('아이디 혹은 비밀번호를 확인하세요');
                        }
                        setErrorMsg(null);
                        const loginData = {
                            username: textAccount,
                            password: textPassword
                        }
                        axios.post(ServerUrl.url + 'rest-auth/login/', loginData)
                        .then(res => {
                            if (res.data.user.color === "") {
                                navigation.navigate('Sign up', {nickname: res.data.user.username, userToken: res.data.token});
                            } else {
                                signIn(res.data.token);
                            }
                        })
                        .catch(err => {
                            console.error(err.response.data)
                            setErrorMsg('아이디 혹은 비밀번호를 확인하세요');
                        })
                    }}
                    style={{borderWidth: 1, borderColor: '#0d3754', width: 200, marginBottom: 15}}
                    labelStyle={{fontSize:20, color: '#0d3754'}}
                    theme={{colors: {primary: 'rgba(0, 0, 0, 0)'}}}
                >
                    로그인
                </Button>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Button
                    mode="text"
                    onPress={() => {
                        navigation.navigate('Sign up');
                    }}
                    labelStyle={{fontSize:15, color: '#0d3754', textDecorationLine: 'underline'}}
                    theme={{colors: {primary: 'rgba(0, 0, 0, 0)'}}}
                >
                    회원이 아니신가요?
                </Button>
            </View>
        </Container>
    )
}

export default LoginScreen;