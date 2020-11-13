import React from  'react';
import { Text, TouchableWithoutFeedback, Dimensions, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import axios from 'axios';
import RowContainer from '../components/RowContainer';
import { ServerUrl } from '../components/TextComponent';
import Constants from 'expo-constants';
import { Ionicons, AntDesign } from '@expo/vector-icons';  

const Container = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding-top: ${Constants.statusBarHeight}px;
`;

const View = styled.View`
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items: center;
`;

const CodiItemImg = styled.Image`
    width: 70%;
    height: undefined;
    aspectRatio: 1;
    resize-mode: cover;

`;

const TextContainer = styled.View`
    margin: 5px;
    justify-content: space-between;
`;

const HeartContainer = styled.View`
    margin: 5px;
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
        axios.post(ServerUrl.url + `wear/likecoordi/${showData.id}`, null, requestHeaders)
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
            <View>
                    <TouchableHighlight
                        style={{position: 'absolute', zIndex: 1, top: Dimensions.get('window').width * 0.25, left: 0, width: 50, height: 50, alignItems: 'center'}}
                        underlayColor="none"
                        onPress={changeMinusShowData} >
                        <Ionicons name="ios-arrow-dropleft" size={50} color="black" />
                    </TouchableHighlight>
                    <CodiItemImg
                        source={{uri: ServerUrl.mediaUrl + showData.img}}
                    />
                    <TouchableHighlight
                        style={{position: 'absolute', zIndex: 1, top: Dimensions.get('window').width * 0.25, right: 0, width: 50, height: 50, alignItems: 'center'}}
                        underlayColor="none"
                        onPress={changePlusShowData} >
                        <Ionicons name="ios-arrow-dropright" size={50} color="black" />
                    </TouchableHighlight>
                    <TouchableHighlight 
                        onPress={changeHeart} 
                        style={{position: 'absolute', zIndex: 1, bottom: 20, right: 80}}
                        underlayColor="none"
                        >
                        <HeartContainer style={{justifyContent: 'center', alignItems: 'center'}}>
                            {itemLike.liked ? <AntDesign name="pushpin" size={40} color="#dbb91f" /> : <AntDesign name="pushpino" size={40} color="#dbb91f"  />}
                        </HeartContainer>
                    </TouchableHighlight>
            </View>
        </Container>
    )
}

export default CodiRecListScreen;