import React from  'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { Alert, Text, View } from 'react-native';
import Container from '../components/Container';
import RowContainer from '../components/RowContainer';
import NormalButton from '../components/buttons/NormalButton';
import AuthContext from '../components/AuthContext';
import { ServerUrl, RadioButtonText } from '../components/TextComponent';
import MainText from '../components/main/MainText';
import MainSelectText from '../components/main/MainSelectText';

function HomeScreen({ navigation }) {
    const [value, setValue] = React.useState('none');
    const [secondValue, setSecondValue] = React.useState('friend');


    const { signUp, signOut } = React.useContext(AuthContext);

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
        .catch(err => {
            console.error(err.response.data)
            signOut();
        })

        const token = {
            token: userToken
        }
        axios.post(ServerUrl.url + 'api-jwt-auth/refresh/', token)
        .then(res => {
            console.log(res.data, '<<<<<<<<<<<<<<<<<<<<<< refresh token')
            signUp(res.data.token);
        })
        .catch(err => {
            console.error(err)
            signOut();
        })
    }


    function firstChoice(value) {
        setValue(value)
        setSecondValue('friend')
        if (value === 'school' || value === 'comfortable' || value === 'restaurant') {
            // pass
        } else {
            navigation.navigate("ImgUpload", {value: value, secondValue: secondValue})
        }
    }

    function secondChoice(value) {
        setSecondValue(value)
        navigation.navigate("ImgUpload", {value: value, secondValue: secondValue})
    }

    function choiceAgain() {
        setValue('none')
    }

    return (
        <Container>
            {value === 'none' ? (
                <>
                    <Container>
                        <MainText>어디에 가시나요?</MainText>
                        <MainSelectText label={RadioButtonText.school} value="school" onPress={() => firstChoice('school')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.funeral} value="funeral" onPress={() => firstChoice('funeral')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.marry} value="marry" onPress={() => firstChoice('marry')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.exercise} value="exercise" onPress={() => firstChoice('exercise')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.presentation} value="presentation" onPress={() => firstChoice('presentation')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.comfortable} value="comfortable" onPress={() => firstChoice('comfortable')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.restaurant} value="restaurant" onPress={() => firstChoice('restaurant')}></MainSelectText>
                    </Container>
                </>
                ) : null}
            

            {value === 'school' ? (
                <>
                    <MainText>누구와 가시나요?</MainText>
                    <MainSelectText label={RadioButtonText.professor} value="professor" onPress={() => secondChoice('professor')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.girlFriend} value="girlFriend" onPress={() => secondChoice('girlFriend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.friend} value="friend" onPress={() => secondChoice('friend')}></MainSelectText>
                    <NormalButton onPress={() => choiceAgain()}>다시 선택</NormalButton>
                </>
                ) : null}
                {value === 'comfortable' ? (
                <>
                    <MainText>누구와 가시나요?</MainText>
                    <MainSelectText label={RadioButtonText.girlFriend} value="girlFriend" onPress={() => secondChoice('girlFriend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.friend} value="friend" onPress={() => secondChoice('friend')}></MainSelectText>
                    <NormalButton onPress={() => choiceAgain()}>다시 선택</NormalButton>
                </>
                ) : null}
            {value === 'restaurant' ? (
                <>
                    <MainText>누구와 가시나요?</MainText>
                    <MainSelectText label={RadioButtonText.professor} value="professor" onPress={() => secondChoice('professor')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.girlFriend} value="girlFriend" onPress={() => secondChoice('girlFriend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.friend} value="friend" onPress={() => secondChoice('friend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.family} value="family" onPress={() => secondChoice('family')}></MainSelectText>
                    <NormalButton onPress={() => choiceAgain()}>다시 선택</NormalButton>
                </>
                ) : null}


        </Container>
    )
}

export default HomeScreen;