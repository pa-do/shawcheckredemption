import React from  'react';
import axios from 'axios';
import styled from 'styled-components/native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image } from 'react-native';
import Container from '../components/Container';
import AuthContext from '../components/AuthContext';
import { ServerUrl, RadioButtonText } from '../components/TextComponent';
import MainText from '../components/main/MainText';
import MainSelectText from '../components/main/MainSelectText';
import MainChangeButton from '../components/main/MainChangeButton';
import MypageButton from '../components/mypage/MypageButton';
import { ScrollView } from 'react-native-gesture-handler';

const TopContainer = styled.SafeAreaView`
    flex: 1;
    padding-top: ${Constants.statusBarHeight}px;
`;

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
        const token = {
            token: userToken
        }
        axios.post(ServerUrl.url + 'api-jwt-auth/refresh/', token)
        .then(res => {
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
            let passValue = value;
            setValue('none');
            navigation.navigate("ImgUpload", {value: passValue, secondValue: secondValue})
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
        <TopContainer>
            <View 
            style={{
                flexDirection:'row', 
                flexWrap:'wrap', 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderBottomColor: '#c9a502', 
                borderBottomWidth: 1,
                borderTopColor: '#c9a502', 
                borderTopWidth: 1
                }}>
                <Image
                    style={{width: '70%',resizeMode: 'center'}}
                    source={require('../assets/font_logo.png')}
                />
            </View>
            <Container>
            {value === 'none' ? (
                <>
                        <MainText>어디에 가시나요?</MainText>
                        <MainSelectText label={RadioButtonText.school} value="school" onPress={() => firstChoice('school')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.funeral} value="funeral" onPress={() => firstChoice('funeral')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.marry} value="marry" onPress={() => firstChoice('marry')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.exercise} value="exercise" onPress={() => firstChoice('exercise')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.presentation} value="presentation" onPress={() => firstChoice('presentation')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.comfortable} value="comfortable" onPress={() => firstChoice('comfortable')}></MainSelectText>
                        <MainSelectText label={RadioButtonText.restaurant} value="restaurant" onPress={() => firstChoice('restaurant')}></MainSelectText>
                </>
                ) : null}
            

            {value === 'school' ? (
                <>
                    <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                        <MainChangeButton onPress={() => choiceAgain()} ></MainChangeButton>
                        <MainText>누구와 가시나요?</MainText>
                    </View>
                    <MainSelectText label={RadioButtonText.professor} value="professor" onPress={() => secondChoice('professor')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.girlFriend} value="girlFriend" onPress={() => secondChoice('girlFriend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.friend} value="friend" onPress={() => secondChoice('friend')}></MainSelectText>
                    
                </>
                ) : null}
                {value === 'comfortable' ? (
                <>
                    <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                        <MainChangeButton onPress={() => choiceAgain()} ></MainChangeButton>
                        <MainText>누구와 가시나요?</MainText>
                    </View>
                    <MainSelectText label={RadioButtonText.girlFriend} value="girlFriend" onPress={() => secondChoice('girlFriend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.friend} value="friend" onPress={() => secondChoice('friend')}></MainSelectText>
                </>
                ) : null}
            {value === 'restaurant' ? (
                <>
                    <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                        <MainChangeButton onPress={() => choiceAgain()} ></MainChangeButton>
                        <MainText>누구와 가시나요?</MainText>
                    </View>
                    <MainSelectText label={RadioButtonText.professor} value="professor" onPress={() => secondChoice('professor')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.girlFriend} value="girlFriend" onPress={() => secondChoice('girlFriend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.friend} value="friend" onPress={() => secondChoice('friend')}></MainSelectText>
                    <MainSelectText label={RadioButtonText.family} value="family" onPress={() => secondChoice('family')}></MainSelectText>
                </>
                ) : null}

            </Container>
        </TopContainer>
    )
}

export default HomeScreen;