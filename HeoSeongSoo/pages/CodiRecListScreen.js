import React from  'react';
import { Text, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import NormalButton from '../components/buttons/NormalButton';
import Container from '../components/Container';
import RowContainer from '../components/RowContainer';

const CodiItemImg = styled.Image`
    width: 100%;
    height: 50%;
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

    function changeHeart() {
        if (itemLike.liked){
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
        // axios 요청으로 하트 변경사항 저장
        // codiItem.id와 itemLike 전송
    }
    function changePlusShowData() {
        if (showIndex === recommendations.length-1) {
            console.log(showIndex, ',', recommendations.length, '<<<<<<<<<<< length')
            return
        } else {
            setShowIndex(showIndex+1);
            setShowData(recommendations[showIndex+1]);
            setLikeItem({liked: showData?.liked, likes:showData?.likes})
            console.log(showIndex, '<<<<<<<<<<<<<<<<<<<<< plus')
        }
    }

    function changeMinusShowData() {
        if (showIndex === 0) {
            console.log(showIndex, ',', recommendations.length, '<<<<<<<<<<< length')
            return
        } else {
            setShowIndex(showIndex-1);
            setShowData(recommendations[showIndex-1]);
            setLikeItem({liked: showData?.liked, likes:showData?.likes})
            console.log(showIndex, '<<<<<<<<<<<<<<<<<<<<< minus')
        }
    }

    return (
        <Container>
            <Text>
                { showData.user }
            </Text>
            <CodiItemImg
                source={{uri: showData.img}}
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