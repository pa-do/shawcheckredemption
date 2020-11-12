import React from  'react';
import { Text, View, Modal, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import NormalButton from '../components/buttons/NormalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import Constants from 'expo-constants';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from '../components/AuthContext';
import { ServerUrl, CategoryText, CategoryEngText } from '../components/TextComponent';
import { styles, gridStyles } from '../components/StyleSheetComponent';
import RowContainer from '../components/RowContainer';
import LogoutButton from '../components/mypage/LogoutButton';
import UserName from '../components/mypage/UserName';
import UserPersonalColor from '../components/mypage/UserPersonalColor';
import MypageButton from '../components/mypage/MypageButton';

const UserProfileImg = styled.Image`
    width: 120px;
    height: 120px;
    resize-mode: cover;
    border-radius: 150px;
    margin-left: 5px;
`;

const CodiItemImg = styled.Image`
    margin: 3px;
    width: 31%;
    height: 150px;
    resize-mode: center;
`;

const UserProfileContainer = styled.View`
    flex-direction: row;
    margin-top: 30px;
`;

const UserProfileTextContainer = styled.View`
    flex-direction: column;
    width: 100%;
    margin-left: 20px;
`;

const TopContainer = styled.SafeAreaView`
    flex: 1;
    padding-top: ${Constants.statusBarHeight}px;
`;

const Container = styled.SafeAreaView`
    flex-direction: row;
    width: 100%;
    height: 80px;
`;

const GridRowContainer = styled.View`
    flex: 0.252;
    flex-direction: row;
    padding: 1px;
`;

const ItemBox = styled.View`
    width: 50px;
    height: 50px;
    align-items: center;
`;

const ColorContainer = styled.View`
    background-color: rgb(${props => props.R}, ${props => props.G}, ${props => props.B});
    width: 200px;
    height: 200px;
    border: 1px solid black;
`;

const SelectColorContainer = styled.View`
    background-color: rgb(${props => props.R}, ${props => props.G}, ${props => props.B});
    width: 50px;
    height: 50px;
    border: 1px solid black;
    margin: 3px;
    align-items: center;
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

const myCodiText = '하트코디 보기';
const heartCodiText = '내 코디 보기';

function CodiMyListScreen({ navigation, route }) {
    const [UserData, setUserData] = React.useState(null);
    const [modalVisible, setModalVisible] = React.useState(false);
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
    const [codis, setCodis] = React.useState([]);
    const [likeCodis, setLikeCodis] = React.useState([]);
    const [userItems, setUserItems] = React.useState({});
    const [showData, setShowData] = React.useState([]);
    const [buttonText, setButtonText] = React.useState(myCodiText);
    const [isLoading, setIsLoading] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    
    const { signOut } = React.useContext(AuthContext);
 
    React.useEffect(() => {
        if (route.params?.image.uri !== undefined){
            console.log('image upload from camera')
            dataUpload(route.params?.image);
        }
    }, [route.params?.image]);
    
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
        })
        .catch(err => console.error(err.response))
    }

    const patchItemColor = async () => {
        let userToken = await getUserToken();
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`,
            }
        }

        const data = {
            R: uploadedColor[0],
            G: uploadedColor[1],
            B: uploadedColor[2],
        }
        axios.put(ServerUrl.url + `wear/userclothes/${uploadedItemPk}`, data, requestHeaders)
        .then(res => {
            setModalColorVisible(false);
            openItemModal();
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
                setLikeCodis(heartResponse.data)
            } catch (error) {
                console.error(error);
            }
            changeMyOrLikeVisible();
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setShowData([]);
        });
        return unsubscribe;
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
            .catch(err => {console.error(err.response.data)})
            // 하트 리스트 요청
            // getLikeCodis(requestHeaders);
            // getListData(requestHeaders);
            // getLikeData(requestHeaders);
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
        .catch(err => console.error(err.response.data))
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
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
            .catch(err => console.error(err.response.data))
        }
    }

    const changeMyOrLikeVisible = () => {
        setMyOrLikeVisible(!myOrLikeVisible);
        if (myOrLikeVisible) {
            setButtonText(myCodiText);
            setShowData(codis);
        } else {
            setButtonText(heartCodiText);
            setShowData(likeCodis);
        }
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

    const ModalItemGrid = () => {
        const items = modalItems;
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
            <ScrollView>
                {itemsList.map((tempItems, index) => {
                    return (
                        <GridRowContainer key={index}>
                            {tempItems.map(item => {
                                return (
                                    <TouchableWithoutFeedback
                                        key={item.id}
                                        onPress={() => {
                                        }}>
                                        <CodiItemImg source={{uri: ServerUrl.mediaUrl + item.img}}/>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </GridRowContainer>
                    )
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
                                                navigation.navigate('Detail', {item: item});
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
            {/* 디테일 카테고리 선택을 위한 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalCategoryVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>카테고리를 선택해주세요.</Text>
                        <Container>
                            <ScrollView
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
                                                <View style={{marginVertical: 10, marginHorizontal: 5, padding: 1, width: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(13, 55, 84, 0.5)', borderRadius: 50}}>
                                                    <Text style={{fontSize: 20}}>{item}</Text>
                                                </View>
                                            :
                                                <View style={{marginVertical: 10, marginHorizontal: 5, padding: 1, width: 200, alignItems: 'center', justifyContent: 'center',backgroundColor: 'rgba(100, 100, 100, 0.5)', borderRadius: 50}}>
                                                    <Text style={{fontSize: 20}}>{item}</Text>
                                                </View>                     
                                            }
                                        </TouchableHighlight>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#0d3754' }}
                            onPress={() => {
                                setModalCategoryVisible(false);
                                setModalImageVisible(true);
                            }}
                        >
                            <Text style={styles.textStyle}>확정</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#ff00ff' }}
                            onPress={() => {
                                setDetailCategory(null);
                                setModalCategoryVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>닫기</Text>
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
                    <View style={styles.modalView}>
                        <Text>이 색감이 맞나요?</Text>
                        {uploadedColor && <ColorContainer R={uploadedColor[0]} G={uploadedColor[1]}  B={uploadedColor[2]} />}
                        <Text>아니라면 색을 골라주세요</Text>
                        <Container>
                            <ScrollView
                                horizontal={true}
                            >
                                {colorRGB.map((item, index) => {
                                    return (
                                        <TouchableHighlight
                                            onPress={() => {
                                                setUploadedColor([item[0], item[1], item[2]]);
                                            }}
                                            key={index}
                                        >
                                            <SelectColorContainer R={item[0]} G={item[1]} B={item[2]} />
                                        </TouchableHighlight>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                patchItemColor();
                            }}
                        >
                            <Text style={styles.textStyle}>확정</Text>
                        </TouchableHighlight>
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
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                navigation.navigate('Camera', {backScreen: 'My Page'});
                                setModalItemCategoryVisible(false);
                                setModalImageVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>카메라</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                pickImage();
                                setModalItemCategoryVisible(false);
                                setModalImageVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>갤러리에서 가져오기</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                setModalImageVisible(false);
                                setDetailCategory(null);
                            }}
                        >
                            <Text style={styles.textStyle}>닫기</Text>
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#ff00ff' }}
                            onPress={() => {
                                setModalItems(null);

                                setModalItemCategoryVisible(false);
                            }}
                        >
                                <Text style={styles.textStyle}>닫기</Text>
                        </TouchableHighlight>
                    {modalItems === null ? (
                        <>
                        <GridRowContainer style={gridStyles.row}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.hat);
                                    setDetailCategoryList(headwearDetailCategory);
                                    setModalItems(userItems.hats);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.hat }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.top);
                                    setDetailCategoryList(topDetailCategory);
                                    setModalItems(userItems.tops);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.top }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.outer);
                                    setDetailCategoryList(outerDetailCategory);
                                    setModalItems(userItems.outers);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.outer }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </GridRowContainer>
                        <GridRowContainer style={gridStyles.row}>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.accessory);
                                    setDetailCategoryList(accessoryDetailCategory);
                                    setModalItems(userItems.accs);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.accessory }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.pants);
                                    setDetailCategoryList(pantsDetailCategory)
                                    setModalItems(userItems.pants);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.pants }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.bag);
                                    setDetailCategoryList(bagDetailCategory);
                                    setModalItems(userItems.bags);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.bag }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </GridRowContainer>
                        <GridRowContainer style={gridStyles.row}>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.watch);
                                    setModalItems(userItems.watches);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.watch }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                    setUploadCategory(CategoryEngText.shoes);
                                    setDetailCategoryList(shoesDetailCategory);
                                    setModalItems(userItems.shoes);
                                }}>
                                <View style={gridStyles.col}>
                                    <Text style={styles.uploadboxText}>{ CategoryText.shoes }</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                style={gridStyles.col}
                                onPress={() => {
                                }}>
                                <View style={gridStyles.col}>
                                </View>
                            </TouchableWithoutFeedback>
                        </GridRowContainer>
                        </>
                        ) : (
                            <>
                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: '#ff00ff' }}
                                    onPress={() => {
                                        setModalItems(null);
                                    }}
                                >
                                    <Text style={styles.textStyle}>이전</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: '#ff00ff' }}
                                    onPress={() => {
                                        if (uploadCategory === CategoryEngText.watch){
                                            setModalImageVisible(true);
                                        } else {
                                            setDetailCategory(null);
                                            setModalCategoryVisible(true);
                                        }
                                    }}
                                >
                                        <Text style={styles.textStyle}>아이템 등록</Text>
                                </TouchableHighlight>
                                <ModalItemGrid/>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <ScrollView>
            <UserProfileContainer>
                <TouchableHighlight
                    onPress={() => {
                        pickUserImage();
                    }}
                    underlayColor="none"
                    style={{width: '38%', justifyContent: 'center', alignItems: 'center'}}
                >
                    <UserProfileImg
                        source={{uri: UserData?.profile_image}}
                    />
                </TouchableHighlight>
                <UserProfileTextContainer style={{justifyContent: 'center'}}>
                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
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
                    <TouchableHighlight
                        onPress={() => {
                            navigation.navigate('PersonalColor', {color: UserData?.color})
                        }}
                        underlayColor="none"
                    >
                        <UserPersonalColor>
                            {UserData?.color}
                        </UserPersonalColor>
                    </TouchableHighlight>
                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                        <MypageButton
                            value="closet"
                            onPress={() => {
                                // UserItems 데이터를 수신합니다.
                                openItemModal();
                            }}
                        ></MypageButton>
                        <MypageButton
                            value="coordi"
                            onPress={() => {
                                navigation.navigate('Form')
                            }}
                        ></MypageButton>
                    </View>
                </UserProfileTextContainer>
            </UserProfileContainer>
            <NormalButton onPress={changeMyOrLikeVisible}>
                {buttonText}
            </NormalButton>
                <MyOrLike />
            </ScrollView>
        </TopContainer>
    )
}

export default CodiMyListScreen;