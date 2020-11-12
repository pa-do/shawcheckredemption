import React from  'react';
import { Text, TouchableWithoutFeedback, ScrollView, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../components/Container';
import axios from 'axios'
import styled from 'styled-components/native';
import { ServerUrl } from '../components/TextComponent';

// 코디의 디테일 페이지입니다.

// 코디 이미지
const CodiItemImg = styled.Image`
    width: 100%;
    height: 50%;
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

// 아이템의 정보를 보여주는 박스
const ItemContainer = styled.View`
    margin: 5px;
    flex-direction: column;
`;

// content 값을 보여주는 태그
const ContentText = styled.Text`

`;

const Seperator = styled.View`
    align-self: stretch;
    border-bottom-color: black;
    border-bottom-width: ${StyleSheet.hairlineWidth}px;
`;

function CodiDetailScreen({ navigation, route }) {
    const [codiSetDetail, setCodiSetDetail] = React.useState(route.params.item);
    const [itemLike, setLikeItem] = React.useState({liked: route.params.item.liked, likes: route.params.item.like_count});
    const [itemDataList, setItemDataList] = React.useState([]);
    const [userData, setUserData] = React.useState(null);

    React.useEffect(() => {
        navigation.setOptions({title: `${route.params.item.user.nickname}님의 코디`});
    }, [route.params.item?.user]);

    React.useEffect(() => {
        const data = route.params.item.data;
        const dataList = [];
        data?.top ? dataList.push(data.top) : null;
        data?.pants ? dataList.push(data?.pants) : null;
        data?.shoes ? dataList.push(data?.shoes) : null;
        data?.outer ? dataList.push(data?.outer) : null;
        data?.headwear ? dataList.push(data?.headwear) : null;
        data?.bag ? dataList.push(data?.bag) : null;
        data?.watch ? dataList.push(data?.watch) : null;
        data?.acc ? dataList.push(data?.acc) : null;
        setItemDataList(dataList);

        const dataAsync = async () => {
            let requestHeaders = await getToken();

            // 유저 정보 요청
            axios.get(ServerUrl.url + 'rest-auth/user/', requestHeaders)
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => {console.error(err)})

        };
        dataAsync();
    }, []);
    
    async function getToken() {
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

        return requestHeaders;
    }

    async function changeHeart() {
        const requestHeaders = await getToken();
        // axios 요청으로 하트 변경사항 저장
        // codiItem.id와 itemLike 전송
        axios.post(ServerUrl.url + `wear/likecoordi/${codiSetDetail.id}`, null, requestHeaders)
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
    }

    async function deleteCodi() {
        const requestHeaders = await getToken();
        axios.delete(ServerUrl.url + `wear/coordi/${codiSetDetail.id}`, requestHeaders)
        .then(res => {
            navigation.goBack();
        })
        .catch(err => console.error(err))
    }
    let nullCount = 0
    return (
        <>
            <CodiItemImg
                source={{uri: ServerUrl.mediaUrl + codiSetDetail.img}}
            />
                <HeartContainer>
                    <TouchableWithoutFeedback onPress={changeHeart}>
                            <HeartText>{itemLike.liked ? '❤️' : '💜'}{ itemLike.likes }</HeartText>
                    </TouchableWithoutFeedback>
                    {userData?.username === codiSetDetail.user.username ? 
                        <TouchableWithoutFeedback onPress={deleteCodi}>
                                <HeartText style={{color: 'red'}}>삭제</HeartText>
                        </TouchableWithoutFeedback>
                    :
                        null
                    }
                </HeartContainer>
            <ContentText>
                {codiSetDetail.content}
            </ContentText>
            <ScrollView>
                {itemDataList.map(item => {
                    if (Object.keys(item).length !== 0) {
                        return (
                            <>
                            <TouchableWithoutFeedback
                            style={{marginBottom: 5}}
                            key={item.item}
                            onPress={() => {
                                navigation.navigate('WebView', { url: item.url })
                            }}>
                                <ItemContainer>
                                    <Text style={{fontWeight: 'bold'}}>{item.style}</Text>
                                    <Text>{item.brand}</Text>
                                    <Text>{item.item}</Text>
                                    <Text>{item.price} 원</Text>
                                </ItemContainer>
                            </TouchableWithoutFeedback>
                            <Seperator/>
                            </>
                        )
                    } else {
                        nullCount++;
                    }
                })}
                {nullCount === 5 ? <Text>등록된 상품의 정보가 없어요</Text> : null}
            </ScrollView>
        </>
    )
}

export default CodiDetailScreen;