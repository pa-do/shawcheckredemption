import React from  'react';
import { Text, Image, TouchableWithoutFeedback, ScrollView, StyleSheet, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import styled from 'styled-components/native';
import { ServerUrl } from '../components/TextComponent';
import { AntDesign } from '@expo/vector-icons'; 

import * as Animatable from 'react-native-animatable';

// 코디의 디테일 페이지입니다.

// 코디 이미지
const CodiItemImg = styled.Image`
    width: 100%;
    height: 100%;
    resize-mode: contain;
`;

// 하트를 품은 뷰
const HeartContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-horizontal: 5px;
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
    const AnimationRef = React.useRef();

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
            if(AnimationRef) {
                AnimationRef.current?.rubberBand();
            }
            if (res.data === '좋아요 삭제.'){
                setLikeItem({
                    liked: false,
                    likes: itemLike.likes - 1
                })
                try {
                    if (route.params.changeLike !== undefined){
                        route.params.changeLike(codiSetDetail.id, 0, itemLike.likes - 1);                      
                    }
                } catch (err) {
                    console.err(err);
                }
            } else {
                setLikeItem({
                    liked: true,
                    likes: itemLike.likes + 1
                })
                try {
                    if (route.params.changeLike !== undefined){
                        route.params.changeLike(codiSetDetail.id, 1, itemLike.likes + 1);
                    }
                } catch (err){
                    console.err(err);
                }
            }

        })
        .catch(err => console.error(err))
    }

    async function deleteCodi() {
        const requestHeaders = await getToken();
        axios.delete(ServerUrl.url + `wear/coordi/${codiSetDetail.id}`, requestHeaders)
        .then(res => {
            try{
                route.params.refresh(codiSetDetail.id);
            } catch {
                // empty
            }
            navigation.goBack();
        })
        .catch(err => console.error(err))
    }

    let nullCount = 0

    return (
        <>
            <ScrollView>
            <View style={{borderRadius: 20, height:300, margin:20, padding:10, backgroundColor: 'white', borderColor: '#c9a502', borderWidth:1}}>
                <CodiItemImg
                    source={{uri: ServerUrl.mediaUrl + codiSetDetail.img}}
                />
                <HeartContainer>
                    <TouchableHighlight 
                    onPress={changeHeart} 
                    underlayColor="none"
                    style={{position: 'absolute', zIndex: 1, bottom: 10, right: 0}}
                    >
                        <HeartContainer style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 17}}></Text>
                            <Animatable.View ref={AnimationRef}>
                            {itemLike.liked ? 
                                <Image
                                    style={{width: 40, height: 40, resizeMode: 'center'}}
                                    source={require('../assets/buttono.png')}/> 
                                : 
                                <Image
                                    style={{width: 40, height: 40, resizeMode: 'center'}}
                                    source={require('../assets/button.png')}/>}
                            </Animatable.View>
                        </HeartContainer>
                    </TouchableHighlight>
                </HeartContainer>
            </View>
            {codiSetDetail.content ? 
            <View style={{marginHorizontal: 20, marginBottom: 20, padding: 10, borderRadius: 20, backgroundColor: 'white', borderColor: '#c9a502', borderWidth:1, minHeight: 100}}>
                <ContentText>
                    {codiSetDetail.content}
                </ContentText>
            </View>
            :
            null}

            {itemDataList.length ? 
            <ScrollView style={{marginHorizontal: 20, marginBottom: 20, padding: 10, borderRadius: 20, backgroundColor: 'white', borderColor: '#c9a502', borderWidth:1}}>
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
                                    {/* https://k3d205.p.ssafy.io/media/top/20.png */}
                                    {/* 피드끝까지내려갔을때 마진 */}
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
            :
            null}

            {userData?.username === codiSetDetail.user.username ? 
                    <TouchableHighlight 
                    onPress={deleteCodi} 
                    style={{marginHorizontal: 20, marginBottom: 20, padding: 10, justifyContent: 'center', alignItems: 'center'}}
                    underlayColor="none"
                    >
                        <AntDesign name="delete" size={30} color="#0d3754" />
                    </TouchableHighlight>
                :
                    null
                }
            </ScrollView>
        </>
    )
}

export default CodiDetailScreen;