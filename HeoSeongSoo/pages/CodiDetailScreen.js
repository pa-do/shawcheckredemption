import React from  'react';
import { Text, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import Container from '../components/Container';
import axios from 'axios'
import styled from 'styled-components/native';


const CodiItemImg = styled.Image`
    width: 100%;
    height: 50%;
    resize-mode: cover;
`;

const TextContainer = styled.View`
    margin: 5px;
    justify-content: space-between;
`;

const ItemContainer = styled.View`
    margin: 5px;
    flex-direction: column;
`;

function CodiDetailScreen({ navigation, route }) {
    const [codiSetDetail, setCodiSetDetail] = React.useState(route.params.item)
    const [itemLike, setLikeItem] = React.useState({liked: route.params.item.liked, likes: route.params.item.likes})
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
        <Container>
            <Text>
                {codiSetDetail.user}
            </Text>
            <CodiItemImg
                source={{uri: codiSetDetail.img}}
            />
            <TouchableWithoutFeedback onPress={changeHeart}>
                <TextContainer>
                    <Text>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</Text>
                </TextContainer>
            </TouchableWithoutFeedback>
            <ScrollView>
                {codiSetDetail.items.map(item => {
                    if (Object.keys(item).length !== 0) {
                        return (
                            <TouchableWithoutFeedback
                            style={{marginBottom: 5}}
                            key={item.id}
                            onPress={() => {
                                navigation.navigate('WebView', { url: item.url })
                            }}>
                                <ItemContainer>
                                    <Text style={{fontWeight: 'bold'}}>{item.category}</Text>
                                    <Text>{item.name}</Text>
                                    <Text>{item.price} 원</Text>
                                </ItemContainer>
                            </TouchableWithoutFeedback>
                        )
                    }
                })}
            </ScrollView>
        </Container>
    )
}

export default CodiDetailScreen;