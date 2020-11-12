import React from  'react';
import { Text, View, Modal, TouchableHighlight, TouchableWithoutFeedback, Image, ScrollView, Dimensions  } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryText, ServerUrl, CategoryEngText } from '../components/TextComponent';
import { styles, formStyles } from '../components/StyleSheetComponent';
import RowContainer from '../components/RowContainer';
import axios from 'axios';

const CodiItemImg = styled.Image`
    margin: 3px;
    width: 31%;
    height: 150px;
    resize-mode: center;
`;

const GridRowContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

function ImgUploadForRecScreen({ navigation, route }) {
    const [uploadCategory, setUploadCategory] = React.useState();
    const [value, setValue] = React.useState([route.params.value, route.params.secondValue]);
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
            console.log(res.data)
            navigation.navigate('RecList', {rec: res.data});
        })
        .catch(err => console.error(err.response, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< rec error'))
    }

    React.useEffect(() => {
        console.log(route.params)
        navigation.setOptions({title: `착용할 의류 선택하기`});
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
            console.log(userItems, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< my item list')
        })
        .catch(err => console.log(err.response.data))
    }

    const ModalItemGrid = () => {
        const items = modalItems;
        console.log(items, '<<<<<<<<<<<<< items')
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
                console.log(error);
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
        <ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: '#ff00ff' }}
                                onPress={() => {
                                    setModalItems(null);
                                    setModalVisible(false);
                                }}
                            >
                                    <Text style={styles.textStyle}>닫기</Text>
                            </TouchableHighlight>                            
                            <ModalItemGrid/>
                        </View>
                    </View>
                </Modal>
            <View style={styles.centeredView}>
            
            </View>
            <Text style={{color: 'black', textAlign: 'center', paddingVertical: 15, marginBottom: 22}}>
                착용할 의류를 옷장에서 가져오세요! {"\n"}
                (착용할 의류가 없으면 그냥 '추천받기'를 눌러요!)
            </Text>
            <View style={{height: Dimensions.get('window').height}}>
            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.hat);
                        openItemModal();
                        setModalItems(userItems.hats);
                    }}>
                    {hatImage !== null ? 
                        <Image source={{ uri: hatImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.hat }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.top);
                        openItemModal();
                        setModalItems(userItems.tops);
                    }}
                    >
                    
                    {topImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + topImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.top }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.outer);
                        openItemModal();
                        setModalItems(userItems.outers);
                    }}>
                    {outerImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + outerImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.outer }</Text>
                    }
                </TouchableHighlight>
            </RowContainer>

            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.accessory);
                        openItemModal();
                        setModalItems(userItems.accs);
                    }}>
                    {AccImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + AccImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.accessory }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.pants);
                        openItemModal();
                        setModalItems(userItems.pants);
                    }}>
                    {pantsImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + pantsImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.pants }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={async () => {
                        setUploadCategory(CategoryEngText.bag);
                        await openItemModal();
                        setModalItems(userItems.bags);
                    }}>
                    {bagImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + bagImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.bag }</Text>
                    }
                </TouchableHighlight>
            </RowContainer>

            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.watch);
                        openItemModal();
                        setModalItems(userItems.watches);
                    }}>
                    {watchImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + watchImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.watch }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        setUploadCategory(CategoryEngText.shoes);
                        openItemModal();
                        setModalItems(userItems.shoes);
                    }}>
                    {shoesImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + shoesImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.shoes }</Text>
                    }
                </TouchableHighlight>
            
                <View style={formStyles.uploadBox}/>
            </RowContainer>

            <TouchableHighlight
                style={styles.recButton}
                onPress={recommendationRequest}
            >
                <Text style={styles.textStyle}>추천받기</Text>
            </TouchableHighlight>
        </View>
        </ScrollView>
    )
}

export default ImgUploadForRecScreen;