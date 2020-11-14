import React from  'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import styled from 'styled-components/native';
import axios from 'axios';
import CodiList from '../components/CodiList';
import { ServerUrl } from '../components/TextComponent';

const TopContainer = styled.SafeAreaView`
    padding-top: ${Constants.statusBarHeight}px;
`;

function CodiAllListScreen({ navigation }) {
    const [allCodiList, setAllCodiList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        // 서버에서 모든 코디 리스트를 최신 날짜 순으로 가져옵니다.
        getData();
    }, [])

    React.useEffect(() => {
        console.log(refreshing)
    }, [refreshing])

    const getData = () => {
        axios.get(ServerUrl.url + `wear/infinite/${index}`)
        .then(res => {
            setIndex(index + 6);
            setRefreshing(false);
            setAllCodiList(refreshing ? allCodiList : allCodiList.concat(res.data));
        })
        .catch(err => console.error(err))
    }

    const refreshData = () => {
        axios.get(ServerUrl.url + `wear/infinite/${0}`)
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
                navigation.navigate('Detail', { item: item })
            }}
        />
    );

    return (
        <TopContainer>
            <FlatList
                keyExtractor={item => item.img.toString()}
                data={allCodiList}
                renderItem={renderItem}
                onEndReached={infiniteHandler}
                showsVerticalScrollIndicator ={false}
                refreshControl={<RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={refreshHandler}
                                    colors={['red', 'red', 'red']}
                                    tintColor='#ff0000'
                                />}
            />
        </TopContainer>
    )
}

export default CodiAllListScreen;