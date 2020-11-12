import React from  'react';
import { Text, SafeAreaView, FlatList } from 'react-native';
import Constants from 'expo-constants';
import styled from 'styled-components/native';
import axios from 'axios';
import CodiList from '../components/CodiList';
import { ServerUrl } from '../components/TextComponent';

const TopContainer = styled.SafeAreaView`
    padding-top: ${Constants.statusBarHeight}px;
`;

function CodiAllListScreen({ navigation }) {
    
    const renderItem = ({ item }) => (
        <CodiList
            item={item}
            imgOnPress={() => {
                navigation.navigate('Detail', { item: item })
            }}
        />
    );

    const [allCodiList, setAllCodiList] = React.useState([]);

    React.useEffect(() => {
        // 서버에서 모든 코디 리스트를 최신 날짜 순으로 가져옵니다.
        axios.get(ServerUrl.url + 'wear/coordi/')
        .then(res => {
            console.log(res.data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< res.data')
            setAllCodiList(res.data);
        })
        .catch(err => console.error(err.response))
    }, [])

    if (allCodiList.length !== 0) {
        return (
            <TopContainer>
                <FlatList
                    keyExtractor={item => item.img.toString()}
                    data={allCodiList}
                    renderItem={renderItem}
                />
            </TopContainer>
        )
    } else {
        return (
            <TopContainer styled={{flex: 1, justifyContent: 'center'}}>
                <Text>
                    데이터가 없습니다.
                </Text>
            </TopContainer>
        )
    }
}

export default CodiAllListScreen;