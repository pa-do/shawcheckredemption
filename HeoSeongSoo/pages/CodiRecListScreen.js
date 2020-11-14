import React from  'react';
import { Text, Image, View, TouchableWithoutFeedback, Dimensions, TouchableHighlight } from 'react-native';
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

const CodiView = styled.View`
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items: center;
`;

const CodiItemImg = styled.Image`
    width: 90%;
    height: undefined;
    aspectRatio: 1;
    resize-mode: cover;

`;

const TextContainer = styled.View`
    margin: 5px;
    justify-content: space-between;
`;

const HeartContainer = styled.View`
    flex-direction: row;
    margin-horizontal: 5px;
`;

function CodiRecListScreen({ navigation, route}) {
    const recommendations = route.params.rec
    const [showIndex, setShowIndex] = React.useState(0)
    const [showData, setShowData] = React.useState(recommendations[0]);
    const [itemLike, setLikeItem] = React.useState({liked: showData?.liked, likes:showData?.likes})

    navigation.setOptions({title: `추천받은 코디`});

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
            <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center', marginBottom: 20}}>
                <Text style={{fontSize: 18}}>마음에 드는 코디에 단추(</Text>
                <Image
                    style={{width: 40, height: 40, resizeMode: 'center'}}
                    source={require('../assets/buttono.png')}/> 
                <Text style={{fontSize: 18}}>)를 달아주세요!</Text>
            </View>
            <CodiView>
                    <TouchableHighlight
                        style={{position: 'absolute', zIndex: 1, top: Dimensions.get('window').width * 0.25, left: 0, width: 50, height: 50, alignItems: 'center'}}
                        underlayColor="none"
                        onPress={changeMinusShowData} >
                        <Ionicons name="ios-arrow-dropleft" size={50} color="black" />
                    </TouchableHighlight>
                    <CodiView style={{
                        width: '70%',
                        height: '100%', 
                        backgroundColor: 'white',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#c9a502'}}>
                        <CodiItemImg
                            source={{uri: ServerUrl.mediaUrl + showData.img}}
                        />
                    </CodiView>
                    
                    <TouchableHighlight 
                    onPress={changeHeart} 
                    underlayColor="none"
                    style={{position: 'absolute', zIndex: 1, bottom: 10, right: 5, marginHorizontal: '15%'}}
                    >
                        <HeartContainer style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'flex-end', alignItems: 'center'}}>
                            {itemLike.liked ? 
                            <Image
                                style={{width: 40, height: 40, resizeMode: 'center'}}
                                source={require('../assets/buttono.png')}/> 
                            : 
                            <Image
                                style={{width: 40, height: 40, resizeMode: 'center'}}
                                source={require('../assets/button.png')}/>}
                        </HeartContainer>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{position: 'absolute', zIndex: 1, top: Dimensions.get('window').width * 0.25, right: 0, width: 50, height: 50, alignItems: 'center'}}
                        underlayColor="none"
                        onPress={changePlusShowData} >
                        <Ionicons name="ios-arrow-dropright" size={50} color="black" />
                    </TouchableHighlight>
                    
            </CodiView>
        </Container>
    )
}

export default CodiRecListScreen;