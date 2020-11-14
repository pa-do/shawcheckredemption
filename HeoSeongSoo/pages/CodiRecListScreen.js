import React from  'react';
import { Text, Image, View, TouchableWithoutFeedback, Dimensions, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import axios from 'axios';
import ViewPager from '@react-native-community/viewpager';
import RowContainer from '../components/RowContainer';
import { ServerUrl } from '../components/TextComponent';
import Constants from 'expo-constants';
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons, AntDesign } from '@expo/vector-icons';  

import * as Animatable from 'react-native-animatable';

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
    width: 80%;
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
    const [showDataList, setShowDataList] = React.useState(recommendations);
    const [itemLike, setLikeItem] = React.useState([])
    const AnimationRef = React.useRef();

    React.useEffect(() => {
        navigation.setOptions({title: `추천받은 코디`});
    }, []);

    async function changeHeart(index) {
        console.log(showDataList[index].id)
        const target = showDataList[index].id;
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
        axios.post(ServerUrl.url + `wear/likecoordi/${target}`, null, requestHeaders)
        .then(res => {
            if(AnimationRef) {
                AnimationRef.current?.rubberBand();
            }
            if (res.data === '좋아요 삭제.'){
                setLikeItem({
                    liked: !itemLike.liked,
                    likes: itemLike.likes - 1
                })
                setShowDataList(
                    showDataList.map(item => {
                        return item.id === target ? {...item, liked: false, likes: 0} : item
                    })
                )
            } else {
                setLikeItem({
                    liked: !itemLike.liked,
                    likes: itemLike.likes + 1
                })
                setShowDataList(
                    showDataList.map(item => {
                        return item.id === target ? {...item, liked: true, likes: 1} : item
                    })
                )
            }

        })
        .catch(err => console.error(err))
    }

    return (
            <>
            <View style={{position: 'absolute', zIndex: 1, top: 30, left:'5%', width: '90%', flexDirection:'row', flexWrap:'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: 0}}>
                {/* <View style={{ backgroundColor: 'blue', height:'50%', width: '100%', }}> */}
                    <Text style={{fontSize: 18}}>마음에 드는 코디에 단추(</Text>
                    <Image
                        style={{width: 40, height: 40, resizeMode: 'center'}}
                        source={require('../assets/buttono.png')}/> 
                    <Text style={{fontSize: 18}}>)를 달아주세요!</Text>
                {/* </View> */}
            </View>
            <ViewPager
                style={{flex: 1}}
                onPageSelected={(e) => {
                    const index = e.nativeEvent.position;
                    setShowIndex(index);
                    setLikeItem({liked: showDataList[index]?.liked, likes:showDataList[index]?.likes});
                }}
            >
            {recommendations.map((item, index) => {
                return(
                <Container key={index}>
                <CodiView>
                        {/* <TouchableHighlight
                            style={{position: 'absolute', zIndex: 1, top: Dimensions.get('window').width * 0.25, left: 0, width: 50, height: 50, alignItems: 'center'}}
                            underlayColor="none"
                            onPress={changeMinusShowData} >
                            <Ionicons name="ios-arrow-dropleft" size={50} color="black" />
                        </TouchableHighlight> */}
                        <CodiView style={{
                            width: '90%',
                            height: '140%',
                            marginTop: 30,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: '#c9a502'}}>
                            <CodiItemImg
                                source={{uri: ServerUrl.mediaUrl + item.img}}
                            />
                        </CodiView>
                        
                        <TouchableHighlight 
                        onPress={() => changeHeart(index)} 
                        underlayColor="none"
                        style={{position: 'absolute', zIndex: 1, bottom: -50, right: 15, marginHorizontal: '5%'}}
                        >
                            <HeartContainer style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'flex-end', alignItems: 'center'}}>
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
                        {/* <TouchableHighlight
                            style={{position: 'absolute', zIndex: 1, top: Dimensions.get('window').width * 0.25, right: 0, width: 50, height: 50, alignItems: 'center'}}
                            underlayColor="none"
                            onPress={changePlusShowData} >
                            <Ionicons name="ios-arrow-dropright" size={50} color="black" />
                        </TouchableHighlight> */}
                        
                </CodiView>
            </Container>
            );
        })}
        </ViewPager>
        <View style={{flexDirection: 'row', justifyContent: 'center', width: '100%', height: 100}}>
            {showIndex === 0 ? 
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#c9a502" />
            :
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#0d3754" />
            }
            {showIndex === 1 ? 
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#c9a502" />
            :
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#0d3754" />
            }
            {showIndex === 2 ? 
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#c9a502" />
            :
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#0d3754" />
            }
            {showIndex === 3 ? 
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#c9a502" />
            :
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#0d3754" />
            }
            {showIndex === 4 ? 
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#c9a502" />
            :
                <Entypo style={{width: 15}} name="dot-single" size={24} color="#0d3754" />
            }
        </View>
        </>
    )
}

export default CodiRecListScreen;