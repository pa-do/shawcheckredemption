import React from  'react';
import { Text, View, Modal, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import NormalButton from '../components/buttons/NormalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import Constants from 'expo-constants'
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from '../components/AuthContext';
import { ServerUrl, CategoryText, CategoryEngText } from '../components/TextComponent';
import { styles } from '../components/StyleSheetComponent';

const UserProfileImg = styled.Image`
    width: 150px;
    height: 150px;
    resize-mode: cover;
`;

const CodiItemImg = styled.Image`
    margin: 3px;
    width: 31%;
    height: 150px;
    resize-mode: cover;
`;

const UserProfileContainer = styled.View`
    flex-direction: row;
`;

const UserProfileTextContainer = styled.View`
    flex-direction: column;
    width: 100%;
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
    flex: 1;
    flex-direction: row;
`;

const ItemBox = styled.View`
    width: 50px;
    height: 50px;
    align-items: center;
`;

const Seperator = styled.View`
    align-self: stretch;
    border-bottom-color: black;
    border-bottom-width: ${StyleSheet.hairlineWidth}px;
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


function CodiMyListScreen({ navigation, route }) {
    const [UserData, setUserData] = React.useState(null);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalImageVisible, setModalImageVisible] = React.useState(false);
    const [modalColorVisible, setModalColorVisible] = React.useState(false);
    const [myOrLikeVisible, setMyOrLikeVisible] = React.useState(false);
    const [uploadedColor, setUploadedColor] = React.useState(null);
    const [uploadedItemPk, setUploadedItemPk] = React.useState(null);
    const [uploadCategory, setUploadCategory] = React.useState();
    const [codis, setCodis] = React.useState([]);
    const [likeCodis, setLikeCodis] = React.useState([]);
    const [userItems, setUserItems] = React.useState({});
    const [showData, setShowData] = React.useState([]);
    const [buttonText, setButtonText] = React.useState('하트코디 보기');
    const [isLoading, setIsLoading] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    const { signOut } = React.useContext(AuthContext);
 
    React.useEffect(() => {
        console.log('image upload from camera')
        if (route.params?.image.uri !== undefined){
            dataUpload(route.params?.image);
        }
    }, [route.params?.image]);
    
    const myCodiText = '하트코디 보기';
    const heartCodiText = '내 코디 보기';

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
            name: 'item.jpg',
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

        axios.post(ServerUrl.url +'wear/userclothes/', data, requestHeaders)
        .then(res => {
            console.log(res.data, '<<<<<<<<<<<<<<<<<<<<<<<<<< return data')
            // setUploadedColor([res.data.R, res.data.G, res.data.B]);
            setUploadedColor([255, 255, 255]);
            setUploadedItemPk(res.data.id);
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
            console.log(res.data)
            modalColorVisible(false);
            modalVisible(true);
        })
        .catch(err => console.error(err.response.data))
    }

    React.useEffect(() => {
        const dataAsync = async () => {
            let userToken = await getUserToken();
            console.log('get first user token >>>>>>>>>>>>>>>>>>>>>>', userToken)
            const requestHeaders = {
                headers: {
                    Authorization: `JWT ${userToken}`
                }
            }
            // 유저 정보 요청
            axios.get(ServerUrl.url + 'rest-auth/user/', requestHeaders)
            .then(res => {
                console.log(res.data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< user data')
                setUserData(res.data);
            })
            .catch(err => {console.log(err.response.data)})
            // 하트 리스트 요청
            getLikeCodis(requestHeaders);
        };
        dataAsync();
    }, []);

    const getLikeCodis = requestHeaders => {
        axios.get(ServerUrl.url + 'wear/likelist/', requestHeaders)
        .then(res => {
            console.log(res.data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< like list')
            setLikeCodis(res.data);
        })
        .catch(err => {console.log(err.response.data)})
    }

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
            console.log(userItems, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< my item list')
        })
        .catch(err => console.log(err.response.data))
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
            // 서버에 result 업로드
            dataUpload(result);
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
        setModalVisible(true);
    }


    const MyOrLike = () => {
        const items = showData;
        const itemsList = [];
        if (items?.length !== 0) {
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
                    console.log(error);
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
        } else {
            return (
                <Text>
                    활동을 시작해보세요!
                </Text>
            )
        }
    }

    return (
        <TopContainer>
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
                                setModalVisible(false);
                                setModalImageVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>카메라</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                pickImage();
                                setModalVisible(false);
                                setModalImageVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>갤러리에서 가져오기</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                setModalImageVisible(!modalVisible);
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
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                <ScrollView>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>{CategoryText.top}</Text>
                        <Container>
                            <ScrollView
                                horizontal={true}
                            >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory(CategoryEngText.top);
                                        setModalImageVisible(true);
                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.tops?.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        <Text style={styles.modalText}>{CategoryText.pants}</Text>
                        <Container>
                            <ScrollView
                                horizontal={true}
                            >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory(CategoryEngText.pants);
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.pants?.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>


                        <Text style={styles.modalText}>{CategoryText.outer}</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory(CategoryEngText.outer);
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.outers?.map((item, index) => {
                                    return (
                                        <ItemBox key={item.id}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>


                        <Text style={styles.modalText}>{CategoryText.shoes}</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory(CategoryEngText.shoes);
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.shoes?.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>


                        <Text style={styles.modalText}>{CategoryText.hat}</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory(CategoryEngText.hat);
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.hats?.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        
                        <Text style={styles.modalText}>{CategoryText.bag}</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory(CategoryEngText.bag);
                                        setModalImageVisible(true);
                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.bags?.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        <Text style={styles.modalText}>{CategoryText.watch}</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory(CategoryEngText.watch);
                                        setModalImageVisible(true);
                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.watches?.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        <Text style={styles.modalText}>{CategoryText.accessory}</Text>
                        <Container>
                        <ScrollView
                                horizontal={true}
                            >
                            <ItemBox>
                                <TouchableHighlight onPress={() => {
                                    setUploadCategory(CategoryEngText.accessory);
                                    setModalImageVisible(true);

                                }}>
                                    <Ionicons name={'ios-add'} size={50} color={"black"} />
                                </TouchableHighlight>
                            </ItemBox>
                            {userItems.accs?.map((item, index) => {
                                return (
                                    <ItemBox key={index}>
                                        <ImageBackground 
                                            style={{ width: "100%", height: "100%" }}
                                            source={{uri : ServerUrl.mediaUrl + item.img}}
                                            resizeMode="cover"
                                        />
                                    </ItemBox>
                                );
                            })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        <TouchableHighlight
                            style={{ ...styles.openButton, }}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                        <Text style={styles.textStyle}>닫기</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
                </View>
            </Modal>
            <ScrollView
                onScroll = {(e) => {
                    let paddingToBottom = 1;
                    paddingToBottom += e.nativeEvent.layoutMeasurement.height;
                    // console.log(Math.floor(paddingToBottom) + "-" + Math.floor(e.nativeEvent.contentOffset.y) + "-" + Math.floor(e.nativeEvent.contentSize.height));
                    if (!isLoading && e.nativeEvent.contentOffset.y + paddingToBottom >= e.nativeEvent.contentSize.height) {
                        console.log('at the end');
                        setIsLoading(true);
                        let url = '';
                        // 내 코디를 보는 상태 or 하트 코디를 보는 상태 url을 다르게 요청
                        if (buttonText === myCodiText) {
                            // url = ServerUrl.url + ''
                        } else {
                            // url = ServerUrl.url + ''
                        }
                        axios.get(url)
                        .then(res => {
                            setIndex(index + 9);
                            const newShowData = [...showData, res.data]
                            setShowData(newShowData);
                            setIsLoading(false);
                        })
                        .catch(err => console.error(err))
                    }
                }}
            >
            <UserProfileContainer>
                <UserProfileImg
                    source={{uri: UserData?.profile_image}}
                />
                <UserProfileTextContainer>
                    <Text>
                        {UserData?.nickname}
                    </Text>
                    <TouchableHighlight
                        onPress={() => {
                            navigation.navigate('PersonalColor', {color: UserData?.color})
                        }}
                    >
                        <Text>
                            {UserData?.color}
                        </Text>
                    </TouchableHighlight>
                    <NormalButton
                        onPress={() => {
                            signOut();
                        }}
                    >
                        로그아웃
                    </NormalButton>
                    <NormalButton
                        onPress={() => {
                            // UserItems 데이터를 수신합니다.
                            openItemModal();
                        }}
                    >
                        내 아이템
                    </NormalButton>
                    <NormalButton
                        onPress={() => {
                            navigation.navigate('Form')
                        }}
                    >
                        코디등록
                    </NormalButton>
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