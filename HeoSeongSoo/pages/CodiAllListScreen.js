import React from  'react';
import { Text, Image, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import produce from 'immer';
import axios from 'axios';
import CodiList from '../components/CodiList';
import { ServerUrl } from '../components/TextComponent';

const TopContainer = styled.SafeAreaView`
    padding-top: ${Constants.statusBarHeight}px;
`;

function CodiAllListScreen({ navigation, route }) {
    const [allCodiList, setAllCodiList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        // 서버에서 모든 코디 리스트를 최신 날짜 순으로 가져옵니다.
        getData();
    }, [])

    React.useEffect(() => {
    }, [refreshing])

    const deleteItem = id => {
        const tempList = allCodiList.filter(item => item.id !== id);
        setAllCodiList([]);
        setAllCodiList(tempList);
    }

    const changeLikeStat = async (id, like) => {
        const tempList = allCodiList.map(item => {
            return item.id === id ? {...item, liked: like ? 1: 0, like_count: like ? item.like_count + 1 : item.like_count - 1} : item
        })
        await setAllCodiList(tempList);
    }

    const changeLikeStatIndetail = async (id, like, count) => {
        const tempList = allCodiList.map(item => {
            return item.id === id ? {...item, liked: like, like_count: count} : item
        })
        setAllCodiList([]);
        await setAllCodiList(tempList);
    }

    const getUserToken = async () => {
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

    const getData = async () => {
        const requestHeaders = await getUserToken();
        axios.get(ServerUrl.url + `wear/infinite/${index}`, requestHeaders)
        .then(res => {
            console.log(res.data)
            setIndex(index + 6);
            setRefreshing(false);
            setAllCodiList(refreshing ? allCodiList : allCodiList.concat(res.data));
        })
        .catch(err => console.error(err))
    }

    const refreshData = async () => {
        const requestHeaders = await getUserToken();
        axios.get(ServerUrl.url + `wear/infinite/${0}`, requestHeaders)
        .then(res => {
            setIndex(6);
            setRefreshing(false);
            setAllCodiList(res.data);
        })
    }

    const infiniteHandler = () => {
        setRefreshing(true);
        setTimeout(() => {
            getData();
        }, 1000);
    }

    const refreshHandler = () => {
        setRefreshing(true);
        refreshData();
    }

    const renderItem = ({ item }) => (
        <CodiList
            item={item}
            imgOnPress={() => {
                navigation.navigate('Detail', { item: item, refresh: deleteItem, changeLike: changeLikeStatIndetail })
            }}
            changeLikeStat={changeLikeStat}
        />
    );

    return (
        <TopContainer>
            <View
            style={{
                flexDirection:'row', 
                flexWrap:'wrap',
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderBottomColor: '#c9a502', 
                borderTopColor: '#c9a502', 
                borderWidth: 1,
                }}>
                <Image
                    style={{width: '70%',resizeMode: 'center'}}
                    source={require('../assets/font_logo.png')}
                />
            </View>
            <View>
                <FlatList
                    keyExtractor={item => item?.img.toString()}
                    data={allCodiList}
                    renderItem={renderItem}
                    onEndReached={infiniteHandler}
                    showsVerticalScrollIndicator ={false}
                    refreshControl={<RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={refreshHandler}
                                        tintColor='#c9a502'
                                    />}
                    style={{paddingBottom: 200, marginBottom: 100}}
                />
            </View>
        </TopContainer>
    )
}

export default CodiAllListScreen;