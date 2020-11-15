import React from 'react';
import { StyleSheet, Modal, Text, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, View, Image, ScrollView, Dimensions, ImageBackground } from 'react-native';
import axios from 'axios'
import styled from 'styled-components/native';
import Constants from 'expo-constants'
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { styles, formStyles, gridStyles } from '../components/StyleSheetComponent';
import { CategoryEngText, CategoryText } from '../components/TextComponent';
import { ServerUrl } from '../components/TextComponent';
import RowContainer from '../components/RowContainer';
import { AntDesign } from '@expo/vector-icons';

const Container = styled.SafeAreaView`
    flex-direction: row;
    width: 100%;
    height: 80px;
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

const TopContainer = styled.SafeAreaView`
    flex: 1;
    padding-top: ${Constants.statusBarHeight}px;
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

const SlectStyleText = styled.Text`
    font-size: 20px;
`;

const GridRowContainer = styled.View`
    flex-direction: row;
    padding: 1px;
`;

const color_name = ['흰색', '라이트그레이', '회색', '다크 그레이', '검정색', '딥레드', '빨간색', 
'라즈베리', '네온 핑크', '분홍색', '라이트 핑크', '페일 핑크', '피치', '코랄', 
'라이트 오렌지', '네온 오렌지', '오렌지 핑크', '주황색', '아이보리', '라이트 옐로우',
'노란색', '머스타드', '네온 그린', '라이트 그린', '민트', '녹색', '올리브 그린', '카키',
'다크 그린', '스카이 블루', '네온 블루', '파란색', '네이비', '자주', '라벤더', '보라색', 
'버건디', '갈색', '로즈골드', '레드 브라운', '카키 베이지', '카멜', '샌드', '베이지색', 
'데님', '연청', '중청', '진청', '흑청']

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

const styleKor = ['포멀', '캐쥬얼', '스트릿', '스포티', '댄디']
const styleList = ['formal', 'casual', 'street', 'sporty', 'dandy']

const CodiItemImg = styled.Image`
    margin: 3px;
    width: 31%;
    height: undefined;
    aspectRatio:1 ;
    resize-mode: center;
`;

const ErrorMsg = styled.Text`
    color: red;
    font-size: 12px;
`;

function CodiFormScreen({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalCategoryVisible, setModalCategoryVisible] = React.useState(false);
    const [modalItemCategoryVisible, setModalItemCategoryVisible] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [detailCategory, setDetailCategory] = React.useState(null);
    const [detailCategoryList, setDetailCategoryList] = React.useState([]);
    const [modalItems, setModalItems] = React.useState(null);
    const [uploadCategory, setUploadCategory] = React.useState();
    const [content, setContent] = React.useState('');
    const [selectedStyle, setSelectedStyle] = React.useState(null);
    const [selectedColor, setSelectedColor] = React.useState(null);
    const [selectedColorRGB, setSelectedColorRGB] = React.useState([]);
    const [userItems, setUserItems] = React.useState({});
    const [hatImage, setHatImage] = React.useState(null);
    const [topImage, setTopImage] = React.useState(null);
    const [pantsImage, setPantsImage] = React.useState(null);
    const [shoesImage, setShoesImage] = React.useState(null);
    const [outerImage, setOuterImage] = React.useState(null);
    const [bagImage, setBagImage] = React.useState(null);
    const [watchImage, setWatchImage] = React.useState(null);
    const [AccImage, setAccImage] = React.useState(null);

    React.useEffect(() => {
        navigation.setOptions({title: `내 코디 등록하기`});
        getUserItems();
    }, []);

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

    const openItemModal = async () => {
        setModalItemCategoryVisible(true);
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
    React.useEffect(() => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
          });
        })


    const createSet = async () => {
        setErrorMsg(null);
        // 저장된 이미지들을 취합합니다.
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
        if (topImage === null || topImage === undefined) {
            return setErrorMsg('상의는 꼭 입고다니세요 ㅠㅠ')
        } else {
            uploadData.append('top', topImage ? topImage.id : -1);
        }
        uploadData.append('outer', outerImage ? outerImage.id : -1);
        uploadData.append('acc', AccImage ? AccImage.id : -1);
        if (pantsImage === null || pantsImage === undefined) {
            return setErrorMsg('바지를 입지 않고 나가시면 형사처벌을 받을 수 있습니다')
        } else {
            uploadData.append('pants', pantsImage ? pantsImage.id : -1);
        }
        uploadData.append('bag', bagImage ? bagImage.id : -1);
        uploadData.append('watch', watchImage ? watchImage.id : -1);
        if (shoesImage === null || shoesImage === undefined) {
            return setErrorMsg('건강에는 좋지만 발을 다칠 수 있어요')
        } else {
            uploadData.append('shoes', shoesImage ? shoesImage.id : -1);
        }
        uploadData.append('content', content);
        if (selectedStyle === undefined || selectedStyle === null) {
            return setErrorMsg('스타일을 선택해주세요')
        } else {
            uploadData.append('style', selectedStyle);
        }
        if (selectedColor === undefined || selectedColor === null) {
            return setErrorMsg('코디의 전체적 색감을 알려주세요')
        } else {
            uploadData.append('color', selectedColor);
        }

        axios.post(ServerUrl.url + 'wear/coordi/', uploadData, requestHeaders)
        .then(res => {
            navigation.dispatch(
                StackActions.replace('My page')
            )
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
            <ScrollView style={{width: Dimensions.get('window').width * 0.7, backgroundColor: 'rgb(242, 242, 242)'}} showsVerticalScrollIndicator={false}>
                {itemsList.map((tempItems, index) => {
                    if (tempItems.length !== 0 || index !== 0) {
                        return (
                            <GridRowContainer style={gridStyles.row} key={index}>
                                {tempItems.map(item => {
                                    return (
                                        <TouchableWithoutFeedback
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(uploadCategory, item);
                                                setModalItemCategoryVisible(false);
                                            }}>
                                            <CodiItemImg style={{backgroundColor:'white'}} source={{uri: ServerUrl.mediaUrl + item.img}}/>
                                        </TouchableWithoutFeedback>
                                    );
                                })}
                            </GridRowContainer>
                        ) 
                    } else {
                        return (
                            <Text style={{margin: 10, fontSize: 12}} key={index}>내정보에서 옷장을 클릭해 아이템을 등록해 주세요</Text>
                        )
                    }
                })}
            </ScrollView>
        );
    }
    return (
        <>
        <TopContainer>
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
                                            <View style={{margin: 7, backgroundColor: 'rgb(234, 152, 90)'}}>
                                                <Text style={{fontSize: 25}}>{item}</Text>
                                            </View>
                                        :
                                            <View style={{margin: 7}}>
                                                <Text style={{fontSize: 25}}>{item}</Text>
                                            </View>                     
                                        }

                                        </TouchableHighlight>
                                    );
                                })}
                            </ScrollView>
                        </Container>

                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
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
            {/* 아이템 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalItemCategoryVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableHighlight
                            style={{width: Dimensions.get('window').width * 0.7, marginBottom: 15, marginRight: 0, paddingRight: 0, alignItems: 'flex-end'}}
                            underlayColor="none"
                            onPress={() => {
                                setModalItems(null);
                                setModalItemCategoryVisible(false);
                            }}>
                                <AntDesign name="closecircleo" size={24} color="black" />
                        </TouchableHighlight>
                        <ModalItemGrid/>
                    </View>

                </View>
            </Modal>
            </TopContainer>
            <ScrollView>
            <View style={{marginVertical: 20}}>
            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        if (hatImage !== null) {
                            setHatImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.hat);
                            openItemModal();
                            setModalItems(userItems.hats);
                        }
                    }}>
                    {hatImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + hatImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Image
                            style={formStyles.uploadedItem}
                            source={require('../assets/items/headwear.png')}
                        />
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        if (topImage !== null) {
                            setTopImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.top);
                            openItemModal();
                            setModalItems(userItems.tops);
                        }
                    }}>
                    
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
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        if (outerImage !== null) {
                            setOuterImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.outer);
                            openItemModal();
                            setModalItems(userItems.outers);
                        }

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
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        if (AccImage !== null) {
                            setAccImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.accessory);
                            openItemModal();
                            setModalItems(userItems.accs);
                        }

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
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        if (pantsImage !== null) {
                            setPantsImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.pants);
                            openItemModal();
                            setModalItems(userItems.pants);
                        }
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
                    underlayColor="#DDDDDD"
                    onPress={async () => {
                        if (bagImage !== null) {
                            setBagImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.bag);
                            await openItemModal();
                            setModalItems(userItems.bags);
                        }
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
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        if (watchImage !== null) {
                            setWatchImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.watch);
                            openItemModal();
                            setModalItems(userItems.watches);
                        }
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
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        if (shoesImage !== null) {
                            setShoesImage(null);
                        } else {
                            setUploadCategory(CategoryEngText.shoes);
                            openItemModal();
                            setModalItems(userItems.shoes);
                        }
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
            <TextInput
                multiline
                theme={{ colors: { primary: "#0d3754" }}}
                numberOfLines={2}
                label="코디를 소개해주세요"
                value={content}
                onChangeText={text => setContent(text)}
                style={{marginHorizontal: 22, marginVertical: 22, backgroundColor: "#F2F2F2"}}
            />
            <Text style={{marginHorizontal: 22}}>코디의 색감을 선택해주세요</Text>
            <Container style={{marginBottom: 22, alignItems: 'center', justifyContent: 'center'}}>
                <ScrollView
                    horizontal={true}
                    style={{marginHorizontal: 22}}
                    showsHorizontalScrollIndicator={false}
                >
                {colorRGB.map((item, index) => {
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={() => {
                                setSelectedColor(color_name[index]);
                                setSelectedColorRGB(item);
                            }}
                        >
                        {selectedColorRGB[0] === item[0] && selectedColorRGB[1] === item[1] && selectedColorRGB[2] === item[2] ? 
                            <SelectColorContainer borderSize={3} R={item[0]} G={item[1]} B={item[2]} />
                            :
                            <SelectColorContainer borderSize={0} R={item[0]} G={item[1]} B={item[2]} />
                        }

                        </TouchableWithoutFeedback>
                    );
                })}
                </ScrollView>
            </Container>
            <Text style={{marginHorizontal: 22}}>코디의 스타일을 선택해주세요</Text>
            <Container >
                <ScrollView
                    horizontal={true}
                    style={{marginHorizontal: 22}}
                    showsHorizontalScrollIndicator={false}
                >
                    {styleList.map((item, index) => {
                        return(
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedStyle(item);
                                }}
                            >
                                {selectedStyle === item ?
                                    <View style={{marginVertical: 10, marginHorizontal: 5, padding: 5, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d3754', borderColor: '#c9a502', borderWidth: 1, borderRadius: 50}}>
                                        <SlectStyleText StyleText style={{color: 'white'}}>{styleKor[index]}</SlectStyleText>
                                    </View>
                                :
                                    <View style={{marginVertical: 10, marginHorizontal: 5, padding: 5, width: 90, alignItems: 'center', justifyContent: 'center',backgroundColor: 'white', borderColor: '#c9a502', borderWidth: 1, borderRadius: 50}}>
                                        <SlectStyleText style={{color: '#0d3754'}} StyleText>{styleKor[index]}</SlectStyleText>
                                    </View>                     
                                }
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </Container>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {errorMsg !== null ? <ErrorMsg style={{ backgroundColor: 'rgba(0, 0, 0, 0)', alignItems: 'center'}}>{ errorMsg }</ErrorMsg> : null}
            </View>
            <TouchableHighlight
                style={styles.recButton}
                onPress={createSet}
            >
                <Text style={styles.textStyle}>등록</Text>
            </TouchableHighlight>
            </View>
        </ScrollView>
        </>
    )
}

export default CodiFormScreen;
