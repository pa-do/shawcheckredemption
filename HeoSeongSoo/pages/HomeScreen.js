import React from  'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { Alert, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Container from '../components/Container';
import RowContainer from '../components/RowContainer';
import NormalButton from '../components/buttons/NormalButton';
import AuthContext from '../components/AuthContext';
import { ServerUrl, RadioButtonText } from '../components/TextComponent';

function HomeScreen({ navigation }) {
    const [value, setValue] = React.useState('school');
    const [secondValue, setSecondValue] = React.useState('friend');

    const { signUp } = React.useContext(AuthContext);

    React.useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        let userToken;
        try {
            userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
        // Restoring token failed
        }
        const requestHeaders = {
          headers: {
              Authorization: `JWT ${userToken}`
          }
        }
        axios.get(ServerUrl.url + 'rest-auth/user/', requestHeaders)
        .then(res => {
          console.log(res.data)
          if (res.data.color === "" || res.data.nickname === "") {
                navigation.dispatch(
                    StackActions.replace("Sign up2", {
                        userToken: userToken,
                        nickname: res.data.username
                    })
                );
          }
        })
        .catch(err => console.error(err.response.data))
        const token = {
            token: userToken
        }
        axios.post(ServerUrl.url + 'api-jwt-auth/refresh/', token)
        .then(res => {
            console.log(res.data, '<<<<<<<<<<<<<<<<<<<<<< refresh token')
            signUp(res.data.token);
        })
        .catch(err => console.error(err))
    }

    return (
        <Container>
            <RowContainer>
                <RadioButton.Group
                    onValueChange={value => {
                        setValue(value)
                        setSecondValue('friend')
                    }}
                    value={value}
                >
                    <RadioButton.Item label={RadioButtonText.school} value="school" />
                    <RadioButton.Item label={RadioButtonText.funeral} value="funeral" />
                    <RadioButton.Item label={RadioButtonText.marry} value="marry" />
                    <RadioButton.Item label={RadioButtonText.exercise} value="exercise" />
                    <RadioButton.Item label={RadioButtonText.presentation} value="presentation" />
                    <RadioButton.Item label={RadioButtonText.comfortable} value="comfortable" />
                    <RadioButton.Item label={RadioButtonText.restaurant} value="restaurant" />
                </RadioButton.Group>
                <RadioButton.Group onValueChange={value => setSecondValue(value)} value={secondValue}>
                    {value === 'school' ? (
                        <>
                            <RadioButton.Item label={RadioButtonText.professor} value="professor"/>
                            <RadioButton.Item label={RadioButtonText.girlFriend} value="girlFriend"/>
                            <RadioButton.Item label={RadioButtonText.friend} value="friend"/>
                        </>
                     ) : null}
                     {value === 'comfortable' ? (
                        <>
                            <RadioButton.Item label={RadioButtonText.girlFriend} value="girlFriend"/>
                            <RadioButton.Item label={RadioButtonText.friend} value="friend"/>
                        </>
                     ) : null}
                    {value === 'restaurant' ? (
                        <>
                            <RadioButton.Item label={RadioButtonText.professor} value="professor"/>
                            <RadioButton.Item label={RadioButtonText.girlFriend} value="girlFriend"/>
                            <RadioButton.Item label={RadioButtonText.friend} value="friend"/>
                            <RadioButton.Item label={RadioButtonText.family} value="family"/>
                        </>
                     ) : null}
                </RadioButton.Group>
            </RowContainer>

            <RowContainer>
                <NormalButton
                    onPress={ () => {
                        console.log(value, secondValue, '<<<<<<<<<<<<<<<<<<<< user pick')
                        if (value === 'school' || value === 'comfortable' || value === 'restaurant') {
                            navigation.navigate("ImgUpload", {value: value, secondValue: secondValue})
                        } else {
                            navigation.navigate("ImgUpload", {value: value})
                        }
                    }}
                >
                    추천 받기
                </NormalButton>
            </RowContainer>
        </Container>
    )
}

export default HomeScreen;