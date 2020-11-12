import React from 'react';
import { Text, TouchableWithoutFeedback, TouchableHighlight  } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { ServerUrl } from '../components/TextComponent';
import { AntDesign } from '@expo/vector-icons'; 

// 전체 코디리스트의 개별 아이템입니다.

// 카드의 전체 레이아웃
const CodiItemCard = styled.View`
    margin: 10px;
    border: 2px #000000 solid;
`;

// 이미지를 감싸는 뷰
const CodiListItem = styled.View`
    margin-top: 10px;
    height: 300px;
`;

// 코디의 이미지
const CodiItemImg = styled.Image`
    width: 100%;
    height: 100%;
    resize-mode: contain;
`;

// 하트를 품은 뷰
const HeartContainer = styled.View`
    margin: 5px;
    flex-direction: row;
    justify-content: space-between;
`;

// 하트 텍스트
const HeartText = styled.Text`

`;

// content 포함 뷰
const ContentContainer = styled.View`
    margin: 5px;
    flex-direction: row;
    justify-content: space-between;
`;

// content Text
const ContentText = styled.Text`

`;

function CodiList(props) {
    const [codiItem, setCodiItem] = React.useState(props.item);
    const [itemLike, setLikeItem] = React.useState({liked: props.item.liked ? true : false, likes: props.item.like_count})
    async function changeHeart() {
        // axios 요청으로 하트 변경사항 저장
        // codiItem.id와 itemLike 전송
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
    }
    return (
        <CodiItemCard>
            <CodiListItem>
                <TouchableWithoutFeedback onPress={props.imgOnPress}>
                    <CodiItemImg
                    source={{
                        uri: ServerUrl.mediaUrl + codiItem.img,
                    }}
                    />
                </TouchableWithoutFeedback>
                <TouchableHighlight onPress={changeHeart} style={{position: 'absolute', zIndex: 1, bottom: 10, right: 10}}>
                    <HeartContainer>
                       {itemLike.liked ? <AntDesign name="pushpin" size={40} color="#dbb91f" /> : <AntDesign name="pushpino" size={40} color="#dbb91f"  />}
                    </HeartContainer>
                </TouchableHighlight>
            </CodiListItem>
            
            <Text style={{margin: 3, fontWeight: 'bold'}}>{codiItem.user.nickname}</Text>
            <ContentContainer>
                <ContentText>{ codiItem.content }</ContentText>
                <HeartText>{ itemLike.likes }</HeartText>
            </ContentContainer>
            
                <ContentText>{ codiItem.style }</ContentText>
                <ContentText>{ codiItem.color }</ContentText>
        </CodiItemCard>
    )
}
export default CodiList;