import React from 'react';
import { Text, View, Image, TouchableWithoutFeedback, TouchableHighlight  } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { ServerUrl, StyleText } from '../components/TextComponent';
import { AntDesign } from '@expo/vector-icons'; 

import * as Animatable from 'react-native-animatable';

// 전체 코디리스트의 개별 아이템입니다.

// 카드의 전체 레이아웃
const CodiItemCard = styled.View`
    margin: 15px 10px;
    padding: 10px;
    background-color: white;
    border-color: #c9a502;
    border-width: 1;
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
`;

// 하트 텍스트
const HeartText = styled.Text`

`;

// content 포함 뷰
const ContentContainer = styled.View`
    margin: 5px;
`;

// content Text
const ContentText = styled.Text`

`;

const color_name = ['흰색', '라이트그레이', '회색', '다크 그레이', '검정색', '딥레드', '빨간색', 
'라즈베리', '네온 핑크', '분홍색', '라이트 핑크', '페일 핑크', '피치', '코랄', 
'라이트 오렌지', '네온 오렌지', '오렌지 핑크', '주황색', '아이보리', '라이트 옐로우',
'노란색', '머스타드', '네온 그린', '라이트 그린', '민트', '녹색', '올리브 그린', '카키',
'다크 그린', '스카이 블루', '네온 블루', '파란색', '네이비', '자주', '라벤더', '보라색', 
'버건디', '갈색', '로즈골드', '레드 브라운', '카키 베이지', '카멜', '샌드', '베이지색', 
'데님', '연청', '중청', '진청', '흑청']

const colorRGB = [[255, 255, 255], [217, 217, 215], [156, 156, 155], [83, 86, 91], [0, 0, 0], 
[156, 35, 54], [232, 4, 22], [215, 64, 97], [223, 24, 149], [247, 17, 158],
[255, 163, 182], [220, 166, 156], [250, 171, 141], [237, 104, 89], [254, 124, 0],
[253, 92, 1], [228, 74, 86], [247, 68, 27], [254, 255, 239], [249, 225, 125],
[251, 234, 43], [240, 179, 37], [212, 237, 22], [139, 197, 1], [64, 193, 171], 
[42, 172, 20], [122, 134, 60], [91, 90, 58], [29, 66, 33], [91, 193, 231],
[2, 128, 238], [36, 30, 252], [0, 31, 98], [125, 0, 76], [167, 123, 202],
[78, 8, 108], [118, 34, 47], [108, 42, 22], [183, 82, 62], [190, 77, 0], 
[161, 116, 0], [215, 154, 47], [201, 180, 149], [232, 195, 129],
[61, 63, 107], [97, 134, 176], [38, 58, 84], [35, 40, 51], [33, 35, 34]]

const SelectColorContainer = styled.View`
    background-color: rgb(${props => props.R}, ${props => props.G}, ${props => props.B});
    width: 20px;
    height: 20px;
    border-radius: 150px;
    margin: 5px;
    align-items: center;
`;

function CodiList(props) {
    const [codiItem, setCodiItem] = React.useState(props.item);
    const [itemLike, setLikeItem] = React.useState({liked: props.item.liked ? true : false, likes: props.item.like_count})
    const AnimationRef = React.useRef();

    async function changeHeart() {
        // axios 요청으로 하트 변경사항 저장
        // codiItem.id와 itemLike 전송
        console.log(codiItem)
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
            if (res.data === '좋아요 삭제.'){
                setLikeItem({
                    liked: false,
                    likes: itemLike.likes - 1
                })
            } else {
                setLikeItem({
                    liked: true,
                    likes: itemLike.likes + 1
                })
            }
            props.changeLikeStat(codiItem.id, !itemLike.liked);
            if(AnimationRef) {
                AnimationRef.current?.rubberBand();
            }
        })
        .catch(err => console.error(err))
    }
    return (
        <CodiItemCard style={{borderRadius: 20}}>
            <CodiListItem>
                <TouchableWithoutFeedback onPress={props.imgOnPress}>
                    <CodiItemImg
                    source={{
                        uri: ServerUrl.mediaUrl + codiItem.img,
                    }}
                    />
                </TouchableWithoutFeedback>
                <TouchableHighlight 
                onPress={changeHeart} 
                style={{position: 'absolute', zIndex: 1, bottom: 10, right: 0}}
                underlayColor="none"
                >
                    <HeartContainer style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 17}}>{ itemLike.likes }</Text>
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
            </CodiListItem>
            <ContentContainer>
                <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center'}}>
                        <Image
                            source={{uri: ServerUrl.url + codiItem.user.profile_image}}
                            style={{width: 40, height:40, borderRadius: 50, borderWidth: 1, borderColor: 'rgb(242, 242, 242)'}} />
                        <Text style={{fontWeight: 'bold', fontSize: 17, marginHorizontal: 5}}>{codiItem.user.nickname}</Text>
                    </View>
                    <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center'}}> 
                        <View style={{paddingHorizontal: 5, paddingVertical:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c9a502', borderColor: '#0d3754', borderWidth: 1, borderRadius: 50}}>
                            <Text style={{color: 'white', fontSize: 14}}>{StyleText[codiItem.style]}</Text>
                        </View>
                        <SelectColorContainer
                        R={colorRGB[color_name.indexOf(codiItem.color)][0]} 
                        G={colorRGB[color_name.indexOf(codiItem.color)][1]} 
                        B={colorRGB[color_name.indexOf(codiItem.color)][2]} />
                    </View>
                    
                    
                </View>
                <Text numberOfLines={2} style={{flexDirection:'row', flexWrap:'wrap', margin: 10}}>
                    <Text>{ codiItem.content }</Text>
                </Text>
            </ContentContainer>
        </CodiItemCard>
    )
}
export default CodiList;