import React from 'react';
import { Text, TouchableWithoutFeedback  } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios'

const CodiItemCard = styled.View`
    margin: 10px;
    border: 2px #000000 solid;
`;

const CodiListItem = styled.View`
    height: 250px;
`;

const CodiItemImg = styled.Image`
    width: 100%;
    height: 100%;
    resize-mode: cover;
`;

const TextContainer = styled.View`
    margin: 5px;
    flex-direction: row;
    justify-content: space-between;
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
                <TextContainer>
                    <Text>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</Text>
                </TextContainer>
            </TouchableWithoutFeedback>
            <TextContainer>
                <Text>{ codiItem.content }</Text>
            </TextContainer>
        </CodiItemCard>
    )
}
export default CodiList;