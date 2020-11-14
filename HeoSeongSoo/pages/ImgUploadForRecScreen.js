import React from  'react';
import { Text, View, Modal, TouchableHighlight, TouchableWithoutFeedback, Image, ScrollView, Dimensions  } from 'react-native';
import styled from 'styled-components/native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServerUrl, CategoryEngText } from '../components/TextComponent';
import { styles, formStyles, gridStyles } from '../components/StyleSheetComponent';
import RowContainer from '../components/RowContainer';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';


const CodiItemImg = styled.Image`
    margin: 3px;
    width: 31%;
    height: undefined;
    aspectRatio: 1;
    resize-mode: center;
`;

const GridRowContainer = styled.View`
    flex-direction: row;
    padding: 1px;
`;

const namedText = [
    '"패션은 느낌입니다. 이유가 있어선 안 되죠" - Christian Dior',
    '"패션은 변하지만 스타일은 영원하다" - Coco Chanel',
    '"패션은 스스로에 대한 자신감이다" - Paul Smith',
    '"누가 감히 무엇이 다른 무엇보다 훨씬 세련되었다고 말할 수 있는가" - Miguel Adrover',
    '"보여지는 것 이상의 것을 얻으려면 이면에 자신감이 바탕이 되어야 한다" - candace bushnell',
    '"오늘 최악의 적을 만날 것처럼 차려입어라" - Coco Chanel',
    '"스타일이란 말 없이 당신에 대해 말하는 방법이다" - Rachel Zoe'
]

function ImgUploadForRecScreen({ navigation, route }) {
    const [uploadCategory, setUploadCategory] = React.useState();
    const [value, setValue] = React.useState([route.params.value, route.params.secondValue]);
    const [indicatorVisible, setIndicatorVisible] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [userItems, setUserItems] = React.useState({});
    const [modalItems, setModalItems] = React.useState(null);
    const [hatImage, setHatImage] = React.useState(null);
    const [topImage, setTopImage] = React.useState(null);
    const [pantsImage, setPantsImage] = React.useState(null);
    const [shoesImage, setShoesImage] = React.useState(null);
    const [outerImage, setOuterImage] = React.useState(null);
    const [bagImage, setBagImage] = React.useState(null);
    const [watchImage, setWatchImage] = React.useState(null);
    const [AccImage, setAccImage] = React.useState(null);
    const [randomIndex, setRandomIndex] = React.useState(0);

    
    const recommendationRequest = async () => {
        let userToken;
        try {
            userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
            // Restoring token failed
        }
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`
            }
        }
        const uploadData = new FormData();
        uploadData.append('headwear', hatImage ? hatImage.id : -1);
        uploadData.append('top', topImage ? topImage.id : -1);
        uploadData.append('outer', outerImage ? outerImage.id : -1);
        uploadData.append('acc', AccImage ? AccImage.id : -1);
        uploadData.append('pants', pantsImage ? pantsImage.id : -1);
        uploadData.append('bag', bagImage ? bagImage.id : -1);
        uploadData.append('watch', watchImage ? watchImage.id : -1);
        uploadData.append('shoes', shoesImage ? shoesImage.id : -1);
        uploadData.append('who', value[1]);
        uploadData.append('where', value[0]);
        // 서버로 이미지를 보내고 결과를 받아옵니다.
        axios.post(ServerUrl.url + 'wear/recommand/', uploadData, requestHeaders)
        .then(res => {
            navigation.navigate('RecList', {rec: res.data});
            setIndicatorVisible(false);
        })
        .catch(err => {
            setIndicatorVisible(false);
            console.error(err)
        })
    }

    function getRandomArbitrary(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    React.useEffect(() => {
        navigation.setOptions({title: `착용할 의류 선택하기`});
        setRandomIndex(getRandomArbitrary(0, 7));
        getUserItems();
    }, []);

    const openItemModal = async () => {
        setModalVisible(true);
    }

    const setImageUri = (uploadCategory, item) => {
        switch (uploadCategory) {
            case CategoryEngText.hat:
                setHatImage(item);
                break;
            case CategoryEngText.top:
                setTopImage(item);
                break;
            case CategoryEngText.outer:
                setOuterImage(item);
                break;
            case CategoryEngText.accessory:
                setAccImage(item);
                break;
            case CategoryEngText.pants:
                setPantsImage(item);
                break;
            case CategoryEngText.bag:
                setBagImage(item);
                break;
            case CategoryEngText.watch:
                setWatchImage(item);
                break;
            case CategoryEngText.shoes:
                setShoesImage(item);
                break;
        }
    }

    const getUserItems = async () => {
        let userToken;
        try {
            userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
            // Restoring token failed
        }
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
        })
        .catch(err => console.error(err))
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
            <ScrollView style={{width: Dimensions.get('window').width * 0.7}} showsVerticalScrollIndicator={false}>
                {itemsList.map((tempItems, index) => {
                    return (
                        <GridRowContainer style={gridStyles.row} key={index}>
                            {tempItems.map(item => {
                                return (
                                    <TouchableWithoutFeedback
                                        key={item.id}
                                        onPress={() => {
                                            setImageUri(uploadCategory, item);
                                            setModalVisible(false);
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

    return (
        <View style={{margin: 15, borderColor: '#c9a502', borderWidth: 1, borderRadius: 20}}>
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
                                color={Colors.red800}
                                size={'large'}
                            />
                            <Text style={{fontSize: 10}}>{namedText[randomIndex]}</Text>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <TouchableHighlight
                                style={{width: Dimensions.get('window').width * 0.7, marginBottom: 15, marginRight: 0, paddingRight: 0, alignItems: 'flex-end'}}
                                underlayColor="none"
                                onPress={() => {
                                    setModalItems(null);
                                    setModalVisible(false);
                                }}
                            >
                                <AntDesign name="closecircleo" size={24} color="black" />
                            </TouchableHighlight>                            
                            <ModalItemGrid/>
                        </View>
                    </View>
                </Modal>

            <Text style={{color: 'black', textAlign: 'center', paddingVertical: 10, marginVertical: 20}}>
                착용할 의류를 옷장에서 가져오세요! {"\n"}
                (착용할 의류가 없으면 그냥 '추천받기'를 눌러요!)
            </Text>
            <View>
            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.hat);
                        openItemModal();
                        setModalItems(userItems.hats);
                    }}>
                    {hatImage !== null ? 
                        <Image source={{ uri: hatImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/headwear.png')}
                        />
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.top);
                        openItemModal();
                        setModalItems(userItems.tops);
                    }}
                    >
                    
                    {topImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + topImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/top.png')}
                        />
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.outer);
                        openItemModal();
                        setModalItems(userItems.outers);
                    }}>
                    {outerImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + outerImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/outer.png')}
                        />
                    }
                </TouchableHighlight>
            </RowContainer>

            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.accessory);
                        openItemModal();
                        setModalItems(userItems.accs);
                    }}>
                    {AccImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + AccImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/accessory.png')}
                        />
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.pants);
                        openItemModal();
                        setModalItems(userItems.pants);
                    }}>
                    {pantsImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + pantsImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/pants.png')}
                        />
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={async () => {
                        setUploadCategory(CategoryEngText.bag);
                        await openItemModal();
                        setModalItems(userItems.bags);
                    }}>
                    {bagImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + bagImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/bag.png')}
                        />
                    }
                </TouchableHighlight>
            </RowContainer>

            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.watch);
                        openItemModal();
                        setModalItems(userItems.watches);
                    }}>
                    {watchImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + watchImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/watch.png')}
                        />
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="none"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.shoes);
                        openItemModal();
                        setModalItems(userItems.shoes);
                    }}>
                    {shoesImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + shoesImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/shoes.png')}
                        />
                    }
                </TouchableHighlight>
            
                <View style={formStyles.uploadBox}/>
            </RowContainer>
            
            <View style={{marginVertical: 20}}>
                <TouchableHighlight
                    style={styles.recButton}
                    onPress={() => {
                        setIndicatorVisible(true);
                        recommendationRequest();
                    }}
                >
                    <Text style={styles.textStyle}>추천받기</Text>
                </TouchableHighlight>
            </View>
            
        </View>
        </View>
    )
}

export default ImgUploadForRecScreen;