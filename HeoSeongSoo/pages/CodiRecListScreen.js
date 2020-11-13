import React from  'react';
import { Text, TouchableWithoutFeedback, Dimensions, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import axios from 'axios';
import BackButton from '../components/buttons/BackButton';
import NextButton from '../components/buttons/NextButton';
import RowContainer from '../components/RowContainer';
import { ServerUrl } from '../components/TextComponent';
import Constants from 'expo-constants';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #f00;
    justify-content: center;
    align-items: center;
    padding-top: ${Constants.statusBarHeight}px;
`;

const View = styled.View`
    width: 100%;
    height: 50%;
    background-color: #0f0;
    justify-content: center;
    align-items: center;
`;

const CodiItemImg = styled.Image`
    width: 300px;
    height: 300px;
    resize-mode: cover;

`;

const TextContainer = styled.View`
    margin: 5px;
    justify-content: space-between;
`;

function CodiRecListScreen({ navigation, route}) {
    const recommendations = route.params.rec
    const [showIndex, setShowIndex] = React.useState(0)
    const [showData, setShowData] = React.useState(recommendations[0]);
    const [itemLike, setLikeItem] = React.useState({liked: showData?.liked, likes:showData?.likes})

    async function changeHeart() {
        let userToken;
        try {
            userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
        // Restoring token failed
        }
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`,
            }
        }
        // axios 요청으로 하트 변경사항 저장
        // codiItem.id와 itemLike 전송
        axios.post(ServerUrl.url + `wear/likecoordi/${showData.id}`, null, requestHeaders)
        .then(res => {
            if (res.data === '좋아요 삭제.'){
                setLikeItem({
                    liked: !itemLike.liked,
                    likes: itemLike.likes - 1
                })
            } else {
                setLikeItem({
                    liked: !itemLike.liked,
                    likes: itemLike.likes + 1
                })
            }
        })
        .catch(err => console.error(err))
        // axios 요청으로 하트 변경사항 저장
        // codiItem.id와 itemLike 전송
    }
    function changePlusShowData() {
        if (showIndex === recommendations.length-1) {
            return
        } else {
            setShowIndex(showIndex+1);
            setShowData(recommendations[showIndex+1]);
            setLikeItem({liked: showData?.liked, likes:showData?.likes})
        }
    }

    function changeMinusShowData() {
        if (showIndex === 0) {
            return
        } else {
            setShowIndex(showIndex-1);
            setShowData(recommendations[showIndex-1]);
            setLikeItem({liked: showData?.liked, likes:showData?.likes})
        }
    }

    return (
        <Container>
            <Text>
                { showData.user }
            </Text>
            <View>
                <RowContainer>
                    <View style={{position: 'absolute', backgroundColor: '#FFFFFF', left: 0, top: 50, height: 30, width: 30}}>
                        <BackButton onPress={changeMinusShowData}></BackButton>
                    </View>
                    <CodiItemImg
                        source={{uri: ServerUrl.mediaUrl + showData.img}}
                    />
                    <View style={{position: 'absolute', backgroundColor: '#FFFFFF', left: 0, top: 50, height: 30, width: 30}}>
                        <NextButton onPress={changePlusShowData}></NextButton>
                    </View>                    
                </RowContainer>
            </View>
            <TouchableWithoutFeedback onPress={changeHeart}>
                <TextContainer>
                    <Text>{itemLike.liked ? '❤️' : '💜'}</Text>
                </TextContainer>
            </TouchableWithoutFeedback>
        </Container>
    )
}

export default CodiRecListScreen;