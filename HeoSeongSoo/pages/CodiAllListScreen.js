import React from  'react';
import { Text, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import CodiList from '../components/CodiList';

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
        /*
        axios.get('')
        .then(res => {
            setCodiList(res.data)
        })
        .catch(err => console.error(err))
        */
       const dummyData = [
           {
               id: 1,
               img: 'https://i0.codibook.net/files/thumb/big/197407283459/d6b9201b8871b2/639666474.jpg',
               content: '가을에 어울리는 코디lllllllllllllllllllllllㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ',
               liked: false,
               likes: 10,
               user: '박인영',
               items: [
                   {},
                   {
                       id: '1',
                       category: 'top',
                       name: '사인 로고 후디 그레이',
                       price: '55,200',
                       url: 'https://store.musinsa.com/app/product/detail/644026/0',
                   },
                   {
                       id: '2',
                       category: 'pants',
                       name: 'Punk Town - MOD4 crop',
                       price: '73,500',
                       url: 'https://store.musinsa.com/app/product/detail/1037219/0'
                   },
                   {
                       id: '3',
                       category: 'outer',
                       name: '네이비 하운드투스 울 블렌디드 레귤러핏 싱글 재킷 (320X11LY5R)',
                       price: '119,900',
                       url: 'https://store.musinsa.com/app/product/detail/1646140/0',
                   },
                   {
                       id: '4',
                       category: 'shoes',
                       name: '바스토 베라티 (BASTOW VERRATI (GLASSY WHITE)) [BTVA61-GW09]',
                       price: '179,000',
                       url: 'https://store.musinsa.com/app/product/detail/1638849/0'
                   }
               ]
           },
           {
               id: 2,
               img: 'https://t1.daumcdn.net/cfile/tistory/2422174D5244C0461F',
               content: '깔끔한 코디입니다.',
               liked: true,
               likes: 5,
               user: '박도희',
               items: [{}, {}, {}, {}, {}]
           },
           {
               id: 3,
               img: 'https://t1.daumcdn.net/cfile/tistory/210532355348EB1A32',
               content: '꾸안꾸',
               liked: false,
               likes: 8,
               user: '박도희',
               items: [{}, {}, {}, {}, {}]
           },
           {
               id: 4,
               img: 'https://t1.daumcdn.net/cfile/tistory/2263F34952AAF79910',
               content: '재미없는 남자 스타일',
               liked: true,
               likes: 12,
               user: '허성수',
               items: [{}, {}, {}, {}, {}]
           },
           {
                id: 5,
                img: 'https://i0.codibook.net/files/thumb/big/1974052848202/7924919fa49692/825365914.jpg',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            }
        ]
        setAllCodiList(dummyData)
    }, [])
    if (allCodiList.length !== 0) {
        return (
            <SafeAreaView>
                <FlatList
                    keyExtractor={item => item.id.toString()}
                    data={allCodiList}
                    renderItem={renderItem}
                />
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView>
                <Text>
                    데이터가 없습니다.
                </Text>
            </SafeAreaView>
        )
    }
}

export default CodiAllListScreen;