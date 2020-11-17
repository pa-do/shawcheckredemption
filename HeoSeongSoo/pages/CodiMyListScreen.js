import React from  'react';
import { Text, View, Modal, Image, Alert, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import NormalButton from '../components/buttons/NormalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import Constants from 'expo-constants';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from '../components/AuthContext';
import { ServerUrl, CategoryText, CategoryEngText } from '../components/TextComponent';
import { styles, gridStyles, formStyles } from '../components/StyleSheetComponent';
import RowContainer from '../components/RowContainer';
import LogoutButton from '../components/mypage/LogoutButton';
import UserName from '../components/mypage/UserName';
import UserPersonalColor from '../components/mypage/UserPersonalColor';
import MypageButton from '../components/mypage/MypageButton';
import { Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 

const UserProfileImg = styled.Image`
    width: 100px;
    height: 100px;
    border-radius: 150px;
    resize-mode: cover;
    margin-left: 5px;
`;

const CodiItemImg = styled.Image`
    margin: 3px;
    width: 31%;
    height: undefined;
    aspectRatio: 1;
    resize-mode: center;
    background-color: white;
`;

const TopContainer = styled.SafeAreaView`
    flex: 1;
    padding-top: ${Constants.statusBarHeight}px;
`;

const Container = styled.SafeAreaView`
    flex-direction: row;
    width: 100%;
`;

const GridRowContainer = styled.View`
    flex-direction: row;
    padding: 1px;
`;

const ColorContainer = styled.View`
    background-color: rgb(${props => props.R}, ${props => props.G}, ${props => props.B});
    width: 200px;
    height: 200px;
    border-radius: 150px;
    border: 1px solid;
    border-color: rgb(199, 199, 204);
`;

const SelectColorContainer = styled.View`
    background-color: rgb(${props => props.R}, ${props => props.G}, ${props => props.B});
    width: 50px;
    height: 50px;
    border-radius: 150px;
    border: ${props => props.borderSize}px solid ${props => {
        let selected = '#ff7f00'
        if (props.borderSize === 3) {
            if (props.R === 0 && props.G === 0 && props.B === 0) {
                return selected
            } else if (props.R === 33 && props.G === 35 && props.B === 34) {
                return selected
            } else if (props.R === 35 && props.G === 40 && props.B === 51) {
                return selected
            } else if (props.R === 38 && props.G === 58 && props.B === 84) {

            }
        } else {
            return 'black'
        }
    }};
    margin: 3px;
    align-items: center;
`;

const ErrorMsg = styled.Text`
    color: red;
    font-size: 12px;
`;

const accessoryDetailCategory = ['벨트', '넥타이', '머플러']

const headwearDetailCategory = ['캡/야구 모자', '헌팅/베레', '페도라', '버킷/사파리햇', '비니', '트루퍼',
'기타 모자']

const bagDetailCategory = ['백팩', '메신저/크로스백', '숄더/토트백', '에코백', '보스턴/드럼/더플백',
'웨이스트백', '클러치백', '파우치백', '브리프케이스']

const topDetailCategory = ['반팔 티셔츠', '긴팔 티셔츠', '민소매 티셔츠', '셔츠/블라우스', '피케/카라 티셔츠',
'맨투맨/스웨트셔츠', '후드 티셔츠', '니트/스웨터']

const shoesDetailCategory = ['캔버스/단화', '러닝화/피트니스화', '구두', '부츠', '로퍼',
'모카신/보트 슈즈', '샌들', '슬리퍼']

const pantsDetailCategory = ['데님 팬츠', '코튼 팬츠', '슈트 팬츠/슬랙스', '트레이닝/조거 팬츠', '숏 팬츠']

const outerDetailCategory = ['후드 집업', '블루종/MA-1', '레더/라이더스 재킷', '트러커 재킷', '슈트/블레이저 재킷',
'카디건', '아노락 재킷', '플리스', '트레이닝 재킷', '스타디움 재킷', '환절기 코트', '겨울 싱글 코트',
'겨울 기타 코트', '롱 패딩/롱 헤비 아우터', '숏 패딩/숏 헤비 아우터', '패딩 베스트', '베스트', '사파리/헌팅 재킷',
'나일론/코치 재킷']

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

const myCodiText = '내 코디';
const heartCodiText = '버튼 코디';

function CodiMyListScreen({ navigation, route }) {
    const [UserData, setUserData] = React.useState(null);
    const [indicatorVisible, setIndicatorVisible] = React.useState(false);
    const [modalImageVisible, setModalImageVisible] = React.useState(false);
    const [modalColorVisible, setModalColorVisible] = React.useState(false);
    const [modalCategoryVisible, setModalCategoryVisible] = React.useState(false);
    const [modalItemCategoryVisible, setModalItemCategoryVisible] = React.useState(false);
    const [modalItems, setModalItems] = React.useState(null);
    const [myOrLikeVisible, setMyOrLikeVisible] = React.useState(false);
    const [detailCategory, setDetailCategory] = React.useState(null);
    const [detailCategoryList, setDetailCategoryList] = React.useState([]);
    const [uploadedColor, setUploadedColor] = React.useState(null);
    const [uploadedItemPk, setUploadedItemPk] = React.useState(null);
    const [uploadCategory, setUploadCategory] = React.useState();
    // 수정 중
    const [uploadedBrand, setUploadedBrand] = React.useState();
    const [uploadedItem, setUploadedItem] = React.useState();
    const [uploadedPrice, setUploadedPrice] = React.useState();
    const [uploadedUrl, setUploadedUrl] = React.useState();
    // 수정 중
    const [codis, setCodis] = React.useState([]);
    const [likeCodis, setLikeCodis] = React.useState([]);
    const [userItems, setUserItems] = React.useState({});
    const [showData, setShowData] = React.useState([]);

    const [detailCategoryError, setDetailCategoryError] = React.useState(null);
    
    const { signOut } = React.useContext(AuthContext);
 
    React.useEffect(() => {
        if (route.params?.image.uri !== undefined){
            dataUpload(route.params?.image);
        }
    }, [route.params?.image]);

    const createTwoButtonAlert = item =>
        Alert.alert(
        "아이템을 삭제하시겠습니까?",
        '"내가 곧 스타일이다" - CoCo Chanel',
        [
            {
            text: "취소",
            style: "cancel"
            },
            { text: "삭제", onPress: () => deleteItem(item) }
        ],
        { cancelable: false }
    );
    const getUserToken = async () => {
        let userToken;
        try {
            userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
        // Restoring token failed
        }
        return userToken;
    }

    const dataUpload = async image => {
        setIndicatorVisible(true);
        let userToken = await getUserToken();
        const imageUri = image.uri
        // imageUri 서버에 업로드 uploadCategory 첨부, 후 모달 재오픈
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`,
                "Content-Type": "multipart/form-data",
            }
        }
        const itemImage = {
            uri: imageUri,
            type: 'image/jpeg',
            name: `${UserData.username}${Date.now()}.jpg`,
        }
        let categoryNum = 0
        switch (uploadCategory) {
            case CategoryEngText.hat:
                categoryNum = 1;
                break;
            case CategoryEngText.top:
                categoryNum = 2;
                break;
            case CategoryEngText.outer:
                categoryNum = 3;
                break;
            case CategoryEngText.accessory:
                categoryNum = 4;
                break;
            case CategoryEngText.pants:
                categoryNum = 5;
                break;
            case CategoryEngText.bag:
                categoryNum = 6;
                break;
            case CategoryEngText.watch:
                categoryNum = 7;
                break;
            case CategoryEngText.shoes:
                categoryNum = 8;
                break;
        }
        const data = new FormData();
        data.append('img', itemImage);
        data.append('category', categoryNum);
        if (categoryNum === 7) {
            data.append('subcategory', 0)
        } else {
            data.append('subcategory', detailCategory);
        }

        axios.post(ServerUrl.url +'wear/userclothes/', data, requestHeaders)
        .then(res => {
            // setUploadedColor([res.data.R, res.data.G, res.data.B]);
            setUploadedColor([res.data.R, res.data.G, res.data.B]);
            setUploadedItemPk(res.data.pk);
            setModalColorVisible(true);
            setIndicatorVisible(false);
        })
        .catch(err => {
            console.error(err)
            setIndicatorVisible(false);
        })
    }

    const patchItemColor = async () => {
        let userToken = await getUserToken();
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`,
            }
        }

        // if (isNaN(parseInt(uploadedPrice))) {
        //     setUploadedPrice();
        // } else {
        //     setUploadedPrice(parseInt(uploadedPrice));
        // }
        // isNaN(parseInt(uploadedPrice))? undefined : parseInt(uploadedPrice)
        
        // brand: uploadedBrand? uploadedBrand: '',
        // price: uploadedPrice? uploadedPrice: '',
        // item: uploadedItem? uploadedItem: '',
        // url: uploadedUrl? uploadedUrl: '',
        
        const data = {
            R: uploadedColor[0],
            G: uploadedColor[1],
            B: uploadedColor[2],
            brand: uploadedBrand? uploadedBrand: ' ',
            price: parseInt(uploadedPrice)? parseInt(uploadedPrice): 0,
            item: uploadedItem? uploadedItem: ' ',
            url: uploadedUrl? uploadedUrl: ' ',
        }

        console.log(data)

        axios.put(ServerUrl.url + `wear/userclothes/${uploadedItemPk}`, data, requestHeaders)
        .then(res => {
            setModalColorVisible(false);
            refreshItems();
            setUploadedBrand();
            setUploadedItem();
            setUploadedPrice();
            setUploadedPrice();
            setUploadedUrl();
            setModalItemCategoryVisible(true);
        })
        .catch(err => console.error(err))
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let userToken = await getUserToken();
            const requestHeaders = {
                headers: {
                    Authorization: `JWT ${userToken}`
                }
            }  
            try {
                const listResponse = await axios.get(ServerUrl.url + 'wear/listcoordi/', requestHeaders)
                setCodis(listResponse.data)
            } catch (error) {
                console.error(error);
            }
            try {
                const heartResponse = await axios.get(ServerUrl.url + 'wear/likelist/', requestHeaders)
                setLikeCodis(heartResponse.data);
                setMyOrLikeVisible(true);
                setShowData(heartResponse.data);
            } catch (error) {
                console.error(error);
            }
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        const _unsubscribe = navigation.addListener('blur', () => {
            setShowData([]);
        });
        return _unsubscribe;
    }, [navigation]);


    React.useEffect(() => {
        const dataAsync = async () => {
            let userToken = await getUserToken();
            const requestHeaders = {
                headers: {
                    Authorization: `JWT ${userToken}`
                }
            }
            // 유저 정보 요청
            axios.get(ServerUrl.url + 'rest-auth/user/', requestHeaders)
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => {console.error(err)})

        };
        dataAsync();
    }, []);

    const getUserItems = requestHeaders => {
        axios.get(ServerUrl.url + 'wear/mylist/', requestHeaders)
        .then(res => {
            const itemData = {
                tops: [], pants: [], outers: [], shoes: [], hats: [], bags: [], watches: [], accs: []
            }
            Object.entries(res.data).map(entry => {
                switch (entry[0]) {
                    case "1":
                        itemData.hats = entry[1].slice();
                        break;
                    case "2":
                        itemData.tops = entry[1].slice();
                        break;
                    case "3":
                        itemData.outers = entry[1].slice();
                        break;
                    case "4":
                        itemData.accs = entry[1].slice();
                        break;
                    case "5":
                        itemData.pants = entry[1].slice();
                        break;
                    case "6":
                        itemData.bags = entry[1].slice();
                        break;
                    case "7":
                        itemData.watches = entry[1].slice();
                        break;
                    case "8":
                        itemData.shoes = entry[1].slice();
                        break;
                }
            })
            setUserItems(itemData);
        })
        .catch(err => console.error(err))
    }

    const refreshItems = async () => {
        let userToken = await getUserToken();
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`
            }
        }
        axios.get(ServerUrl.url + 'wear/mylist/', requestHeaders)
        .then(res => {
            const itemData = {
                tops: [], pants: [], outers: [], shoes: [], hats: [], bags: [], watches: [], accs: []
            }
            Object.entries(res.data).map(entry => {
                switch (entry[0]) {
                    case "1":
                        itemData.hats = entry[1].slice();
                        break;
                    case "2":
                        itemData.tops = entry[1].slice();
                        break;
                    case "3":
                        itemData.outers = entry[1].slice();
                        break;
                    case "4":
                        itemData.accs = entry[1].slice();
                        break;
                    case "5":
                        itemData.pants = entry[1].slice();
                        break;
                    case "6":
                        itemData.bags = entry[1].slice();
                        break;
                    case "7":
                        itemData.watches = entry[1].slice();
                        break;
                    case "8":
                        itemData.shoes = entry[1].slice();
                        break;
                }
            })
            setUserItems(itemData);
            switch (uploadCategory) {
                case CategoryEngText.top:
                    setModalItems(itemData.tops)
                    break;
                case CategoryEngText.pants:
                    setModalItems(itemData.pants)
                    break;
                case CategoryEngText.shoes:
                    setModalItems(itemData.shoes)
                    break;
                case CategoryEngText.outer:
                    setModalItems(itemData.outers)
                    break;
                case CategoryEngText.hat:
                    setModalItems(itemData.hats)
                    break;
                case CategoryEngText.bag:
                    setModalItems(itemData.bags)
                    break;
                case CategoryEngText.watch:
                    setModalItems(itemData.watches)
                    break;
                case CategoryEngText.accessory:
                    setModalItems(itemData.accs)
                    break;
            }
        })
        .catch(err => console.error(err))
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
        if (!result.cancelled) {
            // 서버에 result 업로드
            dataUpload(result);
        }
    }

    const pickUserImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
        if (!result.cancelled) {
            // 서버에 result 업로드
            let userToken = await getUserToken();
            const requestHeaders = {
                headers: {
                    Authorization: `JWT ${userToken}`
                }
            }
            const userImage = {
                uri: result.uri,
                type: 'image/jpeg',
                name: `${UserData.username}${Date.now()}.jpg`,
            }
            const fd = new FormData();
            fd.append('profile_image', userImage);
            axios.patch(ServerUrl.url + 'rest-auth/user/', fd, requestHeaders)
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => console.error(err))
        }
    }

    const setMyCodiVisible = () => {
        // 내가 등록한 코디를 보여줄 때는 false
        setMyOrLikeVisible(false);
        setShowData(codis);
    }

    const setHeartCodiVisible = () => {
        // 하트를 누른 코디를 보여줄 때는 true
        setMyOrLikeVisible(true);
        setShowData(likeCodis);
    }

    const openItemModal = async () => {
        let userToken = await getUserToken();

        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`
            }
        }
        getUserItems(requestHeaders);
        setModalItems(null);
        setModalItemCategoryVisible(true);
    }

    const deleteItem = async item => {
        let userToken = await getUserToken();

        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`
            }
        }
        axios.delete(ServerUrl.url + `wear/userclothes/${item.id}`, requestHeaders)
        .then(res => {
            refreshItems();
            setModalItemCategoryVisible(true);
        })
        .catch(err => console.error(err))

    }

    const ModalItemGrid = () => {
        const items = modalItems;
        const itemsList = [];
        for (let i = 0; i <= parseInt(items?.length / 3); i++) {
            let startPoint = (i * 3) ;
            let endPoint = (i * 3) + 3;
            if (endPoint > items?.length) {
                endPoint = endPoint - 1;
                if (endPoint > items?.length) {
                    endPoint = endPoint - 1;
                }
            }
            try {
                itemsList.push(items.slice(startPoint, endPoint));
                
            } catch (error) {
                console.error(error);
            }
        }
        return (
            <ScrollView style={{width: Dimensions.get('window').width * 0.7, backgroundColor: 'rgb(242, 242, 242)'}} showsHorizontalScrollIndicator={false}>
                {itemsList.map((tempItems, index) => {
                    if (tempItems.length !== 0 || index !== 0) {
                        return (
                            <GridRowContainer 
                            key={index}>
                                {tempItems.map(item => {
                                    return (
                                        <TouchableWithoutFeedback
                                            key={item.id}
                                            onPress={() => createTwoButtonAlert(item)}>
                                            <CodiItemImg source={{uri: ServerUrl.mediaUrl + item.img}}/>
                                        </TouchableWithoutFeedback>
                                    );
                                })}
                            </GridRowContainer>
                        )
                    } else {
                        return (
                            <Text style={{margin: 10, fontSize: 12}} key={index}>아이템을 등록해 주세요</Text>
                        )
                    }
                })}
            </ScrollView>
        );
    }

    const MyOrLike = () => {
        const items = showData;
        const itemsList = [];
            for (let i = 0; i <= parseInt(items?.length / 3); i++) {
                let startPoint = (i * 3);
                let endPoint = (i * 3) + 3;
                if (endPoint > items?.length) {
                    endPoint = endPoint - 1;
                    if (endPoint > items?.length) {
                        endPoint = endPoint - 1;
                    }
                }
                try {
                    itemsList.push(items.slice(startPoint, endPoint));
                } catch (error) {
                    console.error(error);
                }
            }
            return (
                <>
                    {itemsList.map((tempItems, index) => {
                        return (
                            <GridRowContainer key={index}>
                                {tempItems.map(item => {
                                    return (
                                        <TouchableWithoutFeedback
                                            key={item.id}
                                            style={{marginBottom: 5}}
                                            onPress={() => {
                                                navigation.navigate('Detail',{ item: item });
                                            }}>
                                            <CodiItemImg source={{uri: ServerUrl.mediaUrl + item.img}}/>
                                        </TouchableWithoutFeedback>
                                    );
                                })}
                            </GridRowContainer>
                        )
                    })}
                </>
            )
    }

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
                borderBottomWidth: 1,
                borderTopColor: '#c9a502', 
                borderTopWidth: 1
                }}>
                <MypageButton
                    value="closet"
                    onPress={() => {
                        // UserItems 데이터를 수신합니다.
                        openItemModal();
                    }}
                ></MypageButton>
                <Image
                    style={{width: '70%',resizeMode: 'center'}}
                    source={require('../assets/font_logo.png')}
                />
                <MypageButton
                    value="coordi"
                    onPress={() => {
                        navigation.navigate('Form');
                    }}
                ></MypageButton>
            </View>
            {/* 액티비티 인디케이터 모달 */}
            <Modal
                transparent={true}
                visible={indicatorVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ActivityIndicator
                            style={{marginBottom: 12}}
                            animating={true}
                            transparent={true}
                            color={'#c9a502'}
                            size={'large'}
                        />
                        <Text>처리 중입니다</Text>
                    </View>
                </View>
            </Modal>
            {/* 디테일 카테고리 선택을 위한 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalCategoryVisible}
            >
                <View style={styles.centeredView}>
                    <View style={{...styles.modalView}}>
                    <TouchableHighlight
                        style={{width: Dimensions.get('window').width * 0.7, marginBottom: 15, marginRight: 0, paddingRight: 0, alignItems: 'flex-end'}}
                        onPress={() => {
                            setDetailCategoryError(null);
                            setDetailCategory(null);
                            setModalItemCategoryVisible(true);
                            setModalCategoryVisible(false);
                        }}
                        underlayColor="none"
                        >
                            <AntDesign name="closecircleo" size={24} color="black" />
                    </TouchableHighlight>
                        <Text>카테고리를 선택해주세요.</Text>
                        <Container>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5}}>
                                {detailCategoryList.map((item, index) => {
                                    return (
                                        <TouchableHighlight
                                            underlayColor="none"
                                            onPress={() => {
                                                setDetailCategory(index);
                                            }}
                                            key={index}
                                        >
                                            {detailCategory === index ?
                                                <View style={{marginVertical: 3, marginHorizontal: 5, paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(13, 55, 84)', borderColor: '#c9a502', borderWidth: 1, borderRadius: 50}}>
                                                    <Text style={{fontSize: 17, color: 'white'}}>{item}</Text>
                                                </View>
                                            :
                                                <View style={{marginVertical: 3, marginHorizontal: 5, paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center',backgroundColor: 'white', borderColor: '#c9a502', borderWidth: 1, borderRadius: 50}}>
                                                    <Text style={{fontSize: 17, color: 'rgb(13, 55, 84)'}}>{item}</Text>
                                                </View>                     
                                            }
                                        </TouchableHighlight>
                                    );
                                })}
                            </View>
                            {/* <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {detailCategoryList.map((item, index) => {
                                    return (
                                        <TouchableHighlight
                                            onPress={() => {
                                                setDetailCategory(index);
                                            }}
                                            key={index}
                                        >
                                            {detailCategory === index ?
                                                <View style={{marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(13, 55, 84, 0.5)', borderRadius: 50}}>
                                                    <Text style={{fontSize: 17}}>{item}</Text>
                                                </View>
                                            :
                                                <View style={{marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center',backgroundColor: 'rgba(100, 100, 100, 0.5)', borderRadius: 50}}>
                                                    <Text style={{fontSize: 17}}>{item}</Text>
                                                </View>                     
                                            }
                                        </TouchableHighlight>
                                    );
                                })}
                            </ScrollView> */}
                        </Container>
                        {detailCategoryError && <ErrorMsg>{ detailCategoryError }</ErrorMsg>}
                        <TouchableHighlight
                            style={{ ...styles.recButton, backgroundColor: '#0d3754' }}
                            onPress={() => {
                                if (detailCategory === undefined || detailCategory === null) {
                                    return setDetailCategoryError('카테고리를 선택해주세요')
                                } else {
                                    setDetailCategoryError(null);
                                    setModalCategoryVisible(false);
                                    setModalImageVisible(true);
                                }
                            }}
                        >
                            <Text style={styles.textStyle}>등록</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            {/* 색상 컨펌을 위한 모달 */}
             <Modal
                animationType="slide"
                transparent={true}
                visible={modalColorVisible}
            >
                <View style={styles.centeredView}>
                    <View style={{ ...styles.modalView, backgroundColor: 'rgb(242, 242, 242)' }}>
                    <ScrollView style={{backgroundColor: 'rgb(242, 242, 242)'}} showsHorizontalScrollIndicator={false}>        
                        
                        <Text style={{marginVertical: 5}}>이 색감이 맞나요?</Text>
                        {uploadedColor && <ColorContainer R={uploadedColor[0]} G={uploadedColor[1]}  B={uploadedColor[2]} />}
                        <Text style={{marginVertical: 5}}>아니라면 색을 골라주세요</Text>
                        <Container>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {colorRGB.map((item, index) => {
                                    return (
                                        <TouchableHighlight
                                            onPress={() => {
                                                setUploadedColor([item[0], item[1], item[2]]);
                                            }}
                                            key={index}
                                        >
                                            <SelectColorContainer borderSize={0} R={item[0]} G={item[1]} B={item[2]} />
                                        </TouchableHighlight>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        {/* 수정 중 */}
                        <TextInput
                            multiline
                            theme={{ colors: { primary: "#0d3754" }}}
                            numberOfLines={1}
                            label="브랜드"
                            value={uploadedBrand}
                            onChangeText={text => setUploadedBrand(text)}
                            style={{marginHorizontal: 22, marginVertical: 22, backgroundColor: "#F2F2F2", flex: 1, alignItems: 'stretch'}}
                        />
                        <TextInput
                            multiline
                            theme={{ colors: { primary: "#0d3754" }}}
                            numberOfLines={1}
                            label="제품명"
                            value={uploadedItem}
                            onChangeText={text => setUploadedItem(text)}
                            style={{marginHorizontal: 22, marginVertical: 22, backgroundColor: "#F2F2F2", flex: 1, alignItems: 'stretch'}}
                        />
                        <TextInput
                            multiline
                            theme={{ colors: { primary: "#0d3754" }}}
                            numberOfLines={1}
                            label="가격"
                            value={uploadedPrice}
                            onChangeText={text => setUploadedPrice(text)}
                            keyboardType = { 'numeric'}
                            style={{marginHorizontal: 22, marginVertical: 22, backgroundColor: "#F2F2F2", flex: 1, alignItems: 'stretch'}}
                        />
                        <TextInput
                            multiline
                            theme={{ colors: { primary: "#0d3754" }}}
                            numberOfLines={1}
                            label="링크"
                            value={uploadedUrl}
                            onChangeText={text => setUploadedUrl(text)}
                            style={{marginHorizontal: 22, marginVertical: 22, backgroundColor: "#F2F2F2", flex: 1, alignItems: 'stretch'}}
                        />
                        {/* 수정 중 */}
                        <TouchableHighlight
                            style={{ ...styles.recButton }}
                            onPress={() => {
                                patchItemColor();
                            }}
                        >
                            <Text style={styles.textStyle}>확정</Text>
                        </TouchableHighlight>
                    </ScrollView>
                    </View>
                </View>
            </Modal>
            {/* 이미지 업로드를 위한 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalImageVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableHighlight
                            style={{width: Dimensions.get('window').width * 0.7, marginBottom: 15, marginRight: 0, paddingRight: 0, alignItems: 'flex-end'}}
                            underlayColor="none"
                            onPress={() => {
                                setModalImageVisible(false);
                                setModalItemCategoryVisible(true);
                                setDetailCategory(null);
                            }}>
                                <AntDesign name="closecircleo" size={24} color="black" />
                        </TouchableHighlight>
                        <Text style={styles.textStyle, {color: 'black'}}>* 아이템 색상이 잘 드러나는 사진을 올려주세요</Text>
                        <Text style={styles.textStyle, {color: 'black', marginBottom: 5}}>* 옷걸이에 걸어 구김이 없을수록 좋습니다</Text>
                        <TouchableHighlight
                            style={{ ...styles.openButton }}
                            onPress={() => {
                                setModalItemCategoryVisible(false);
                                setModalImageVisible(false);
                                navigation.navigate('Camera', { backScreen: 'My page' });
                            }}
                        >
                            <Text style={styles.textStyle}>카메라</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton }}
                            onPress={() => {
                                setModalItemCategoryVisible(false);
                                setModalImageVisible(false);
                                pickImage();
                            }}
                        >
                            <Text style={styles.textStyle}>갤러리에서 가져오기</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            {/* 아이템 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalItemCategoryVisible}
            >
                <View style={{ ...styles.centeredView }}>                                                                                                                                
                    <View style={{ ...styles.modalClosetView, alignItems: 'flex-end' }}>
                        <TouchableHighlight
                            style={{width: Dimensions.get('window').width * 0.7, marginBottom: 15, marginRight: 0, paddingRight: 0, alignItems: 'flex-end'}}
                            onPress={() => {
                                setModalItems(null);
                                setModalItemCategoryVisible(false);
                            }}
                            underlayColor="none"
                            >
                                <AntDesign name="closecircleo" size={24} color="black" />
                        </TouchableHighlight>
                    {modalItems === null ? (
                        <> 
                        <GridRowContainer style={gridStyles.row, {backgroundColor:'#0d3754'}}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.hat);
                                    setDetailCategoryList(headwearDetailCategory);
                                    setModalItems(userItems.hats);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/headwear.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.top);
                                    setDetailCategoryList(topDetailCategory);
                                    setModalItems(userItems.tops);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/top.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.outer);
                                    setDetailCategoryList(outerDetailCategory);
                                    setModalItems(userItems.outers);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/outer.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </GridRowContainer>
                        <GridRowContainer style={gridStyles.row, {backgroundColor:'#0d3754'}}>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.accessory);
                                    setDetailCategoryList(accessoryDetailCategory);
                                    setModalItems(userItems.accs);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/accessory.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.pants);
                                    setDetailCategoryList(pantsDetailCategory)
                                    setModalItems(userItems.pants);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/pants.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.bag);
                                    setDetailCategoryList(bagDetailCategory);
                                    setModalItems(userItems.bags);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/bag.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </GridRowContainer>
                        <GridRowContainer style={gridStyles.row, {backgroundColor:'#0d3754'}}>
                            <TouchableWithoutFeedback
                                style={gridStyles.col, {backgroundColor:'white'}}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.watch);
                                    setModalItems(userItems.watches);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/watch.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.shoes);
                                    setDetailCategoryList(shoesDetailCategory);
                                    setModalItems(userItems.shoes);
                                }}>
                                <View style={gridStyles.col2}>
                                    <Image
                                        style={formStyles.uploadedItem}
                                        source={require('../assets/items/shoes.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                }}>
                                <View style={gridStyles.col2}>
                                </View>
                            </TouchableWithoutFeedback>
                        </GridRowContainer>
                        </>
                        ) : (
                            <>
                                <TouchableHighlight                             
                                    style={{position: 'absolute', top: 35, left: 35, marginBottom: 15, marginLeft:0, paddingLeft: 0}}
                                    onPress={() => {
                                        setModalItems(null);
                                    }}
                                    underlayColor="none"
                                >
                                    <AntDesign name="leftcircleo" size={24} color="black" />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={{position: 'absolute', top: 25, left: Dimensions.get('window').width * 0.5 - 45, marginBottom: 15, margirnHorizontal: 0, paddingHorizontal: 0}}
                                    onPress={() => {
                                        if (uploadCategory === CategoryEngText.watch){
                                            setModalCategoryVisible(false);
                                            setModalItemCategoryVisible(false);
                                            setModalImageVisible(true);
                                        } else {
                                            setDetailCategory(null);
                                            setModalItemCategoryVisible(false);
                                            setModalCategoryVisible(true);
                                        }
                                    }}
                                    underlayColor="none"
                                >
                                        <MaterialIcons name="add-circle-outline" size={45} color="black" />
                                </TouchableHighlight>
                                <ModalItemGrid/>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <ScrollView>
            
            <View style={{alignItems: 'center', paddingVertical: 15, backgroundColor: 'white', borderBottomColor: '#c9a502', borderBottomWidth: 1}}>
                <TouchableHighlight
                    onPress={() => {
                        pickUserImage();
                    }}
                    underlayColor="none"
                    style={{width: '38%', justifyContent: 'center', alignItems: 'center'}}
                >
                    <UserProfileImg
                        source={{uri: UserData?.profile_image}}
                        style={{borderWidth: 1, borderColor: 'rgb(242, 242, 242)'}}
                    />
                </TouchableHighlight>
                <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableHighlight
                        onPress={() => {
                            navigation.navigate('Personal', {color: UserData?.color})
                        }}
                        underlayColor="none"
                        style={{marginRight: 10}}
                    >
                        <UserPersonalColor>
                            {UserData?.color}
                        </UserPersonalColor>
                    </TouchableHighlight>
                    <UserName>
                            {UserData?.nickname}
                    </UserName>
                    <LogoutButton
                        onPress={() => {
                            signOut();
                        }}
                    >
                    </LogoutButton>
                </View>
            </View>
            <RowContainer style={{marginTop: 10, borderBottomColor: '#c9a502', borderBottomWidth: 1}}>
                {myOrLikeVisible ? 
                    <TouchableHighlight
                    onPress={setMyCodiVisible}
                    underlayColor="none"
                    style={{width: '50%', alignItems: 'center'}}>
                        <View
                        theme={{colors: {primary: 'white'}}}
                        style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{color: '#8a8a8a', fontWeight: 'bold'}}>
                                {myCodiText}
                            </Text>
                            <Entypo name="dot-single" size={24} color="#8a8a8a" />
                        </View>
                    </TouchableHighlight>
                :
                    <TouchableHighlight // 선택됨
                    onPress={setMyCodiVisible}
                    underlayColor="none"
                    style={{width: '50%', alignItems: 'center'}}>
                        <View
                        theme={{colors: {primary: 'white'}}}
                        style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{color: '#c9a502', fontSize: 15, fontWeight: 'bold'}}>
                                {myCodiText}
                            </Text>
                            <Entypo name="dot-single" size={24} color="#c9a502" />
                        </View>
                    </TouchableHighlight>
                }
                
                {!myOrLikeVisible ? 
                    <TouchableHighlight
                    onPress={setHeartCodiVisible}
                    underlayColor="none"
                    style={{width: '50%', alignItems: 'center'}}>
                        <View
                        theme={{colors: {primary: 'white'}}}
                        style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{color: '#8a8a8a', fontWeight: 'bold'}}>
                                {heartCodiText}
                            </Text>
                            <Entypo name="dot-single" size={24} color="#8a8a8a" />
                        </View>
                    </TouchableHighlight>
                :
                    <TouchableHighlight // 선택됨
                    onPress={setHeartCodiVisible}
                    underlayColor="none"
                    style={{width: '50%', alignItems: 'center'}}>
                        <View
                        theme={{colors: {primary: 'white'}}}
                        style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{color: '#c9a502', fontSize: 15, fontWeight: 'bold'}}>
                                {heartCodiText}
                            </Text>
                            <Entypo name="dot-single" size={24} color="#c9a502" />
                        </View>
                    </TouchableHighlight>
                }
            </RowContainer>
                <MyOrLike />
            </ScrollView>
        </TopContainer>
    )
}

export default CodiMyListScreen;