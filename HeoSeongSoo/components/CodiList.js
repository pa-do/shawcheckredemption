import React from 'react';
import { Text, TouchableWithoutFeedback  } from 'react-native';
import styled from 'styled-components/native';

// 전체 코디리스트의 개별 아이템입니다.

// 카드의 전체 레이아웃
const CodiItemCard = styled.View`
    margin: 10px;
    border: 2px #000000 solid;
`;

// 이미지를 감싸는 뷰
const CodiListItem = styled.View`
    height: 250px;
`;

// 코디의 이미지
const CodiItemImg = styled.Image`
    width: 100%;
    height: 100%;
    resize-mode: cover;
`;

// 하트를 품은 뷰
const heartContainer = styled.View`
    margin: 5px;
    flex-direction: row;
    justify-content: space-between;
`;

// 하트 텍스트
const heartText = styled.Text`

`;

// content 포함 뷰
const contentContainer = styled.View`
    margin: 5px;
    flex-direction: row;
    justify-content: space-between;
`;

// content Text
const contentText = styled.Text`

`;

function CodiList(props) {
    const [codiItem, setCodiItem] = React.useState(props.item);
    const [itemLike, setLikeItem] = React.useState({liked: props.item.liked, likes: props.item.likes})
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
    return (
        <CodiItemCard>
            <Text style={{margin: 3, fontWeight: 'bold'}}>{codiItem.user}</Text>
            <CodiListItem>
                <TouchableWithoutFeedback onPress={props.imgOnPress}>
                    <CodiItemImg
                    source={{
                        uri: props.item.img,
                    }}
                    />
                </TouchableWithoutFeedback>
            </CodiListItem>
            <TouchableWithoutFeedback onPress={changeHeart}>
                <heartContainer>
                    <heartText>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</heartText>
                </heartContainer>
            </TouchableWithoutFeedback>
            <contentContainer>
                <contentText>{ codiItem.content }</contentText>
            </contentContainer>
        </CodiItemCard>
    )
}
export default CodiList;