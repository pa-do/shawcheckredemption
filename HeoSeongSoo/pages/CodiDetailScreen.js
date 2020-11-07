import React from  'react';
import { Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Container from '../components/Container';
import axios from 'axios'
import styled from 'styled-components/native';

// 코디의 디테일 페이지입니다.

// 코디 이미지
const CodiItemImg = styled.Image`
    width: 100%;
    height: 50%;
    resize-mode: cover;
`;

// 하트를 품은 뷰
const heartContainer = styled.View`
    margin: 5px;
    justify-content: space-between;
`;

// 하트 텍스트
const heartText = styled.Text`

`;

// 아이템의 정보를 보여주는 박스
const ItemContainer = styled.View`
    margin: 5px;
    flex-direction: column;
`;

// content 값을 보여주는 태그
const contentText = styled.Text`

`;

function CodiDetailScreen({ navigation, route }) {
    const [codiSetDetail, setCodiSetDetail] = React.useState(route.params.item);
    const [itemLike, setLikeItem] = React.useState({liked: route.params.item.liked, likes: route.params.item.likes});
    
    React.useEffect(() => {
        navigation.setOptions({title: `${route.params.item.user}님의 코디`});
    }, [route.params.item?.user]);
    
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
    let nullCount = 0
    return (
        <Container>
            <ScrollView>
                <CodiItemImg
                    source={{uri: codiSetDetail.img}}
                />
                <TouchableWithoutFeedback onPress={changeHeart}>
                    <heartContainer>
                        <heartText>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</heartText>
                    </heartContainer>
                </TouchableWithoutFeedback>
                <contentText>
                    {codiSetDetail.content}
                </contentText>
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
                    } else {
                        nullCount++;
                    }
                })}
                {nullCount === 5 ? <Text>등록된 상품의 정보가 없어요</Text> : null}
            </ScrollView>
        </Container>
    )
}

export default CodiDetailScreen;