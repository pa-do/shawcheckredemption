import React from  'react';
import { Text, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import NormalButton from '../components/buttons/NormalButton';
import Container from '../components/Container';
import RowContainer from '../components/RowContainer';
import { ServerUrl } from '../components/TextComponent';

const CodiItemImg = styled.Image`
    width: 100%;
    height: 50%;
    resize-mode: contain;
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
        axios.post(ServerUrl.url + `wear/likecoordi/${codiItem.id}`, null, requestHeaders)
        .then(res => {
            console.log(res.data)
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
            <CodiItemImg
                source={{uri: ServerUrl.mediaUrl + showData.img}}
            />
            <TouchableWithoutFeedback onPress={changeHeart}>
                <TextContainer>
                    <Text>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</Text>
                </TextContainer>
            </TouchableWithoutFeedback>
            <RowContainer>
                <NormalButton onPress={changeMinusShowData}>이전</NormalButton>
                <NormalButton onPress={changePlusShowData}>다음</NormalButton>
            </RowContainer>
        </Container>
    )
}

export default CodiRecListScreen;