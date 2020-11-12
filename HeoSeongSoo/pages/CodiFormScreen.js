import React from 'react';
import { StyleSheet, Modal, Text, TouchableHighlight, TouchableOpacity, View, Image, ScrollView, Dimensions, ImageBackground } from 'react-native';
import axios from 'axios'
import styled from 'styled-components/native';
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { styles, formStyles } from '../components/StyleSheetComponent';
import { CategoryEngText, CategoryText } from '../components/TextComponent';
import { ServerUrl } from '../components/TextComponent';
import RowContainer from '../components/RowContainer';

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
    border: ${props => props.borderSize}px solid black;
    margin: 3px;
    align-items: center;
`;

const SlectStyleText = styled.Text`
    font-size: 25px;
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

function CodiFormScreen({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [content, setContent] = React.useState('');
    const [selectedStyle, setSelectedStyle] = React.useState('');
    const [selectedColor, setSelectedColor] = React.useState('');
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
            console.log(userItems, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< my item list')
        })
        .catch(err => console.log(err.response.data))
    }

    const openItemModal = async () => {
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
        getUserItems(requestHeaders);
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
    React.useEffect(() => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
          });
        })


    const createSet = async () => {
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
        uploadData.append('top', topImage ? topImage.id : -1);
        uploadData.append('outer', outerImage ? outerImage.id : -1);
        uploadData.append('acc', AccImage ? AccImage.id : -1);
        uploadData.append('pants', pantsImage ? pantsImage.id : -1);
        uploadData.append('bag', bagImage ? bagImage.id : -1);
        uploadData.append('watch', watchImage ? watchImage.id : -1);
        uploadData.append('shoes', shoesImage ? shoesImage.id : -1);
        uploadData.append('content', content);
        uploadData.append('style', selectedStyle);
        uploadData.append('color', selectedColor);

        // const uploadData = {
        //     headwear: hatImage ? hatImage.id : -1,
        //     top: topImage ? topImage.id : -1,
        //     outer: outerImage ? outerImage.id : -1,
        //     acc: AccImage ? AccImage.id : -1,
        //     pants: pantsImage ? pantsImage.id : -1,
        //     bag: bagImage ? bagImage.id : -1,
        //     watch: watchImage ? watchImage.id : -1,
        //     shoes: shoesImage ? shoesImage.id : -1,
        //     content: content,
        //     style: selectedStyle,
        //     color: selectedColor
        // }
        console.log()
        // uploadData.push({headwear: hatImage ? hatImage.id : -1})
        // uploadData.push({top: topImage ? topImage.id : -1})
        // uploadData.push({outer: outerImage ? outerImage.id : -1})
        // uploadData.push({acc: AccImage ? AccImage.id : -1})
        // uploadData.push({pants: pantsImage ? pantsImage.id : -1})
        // uploadData.push({bag: bagImage ? bagImage.id : -1})
        // uploadData.push({watch: watchImage ? watchImage.id : -1})
        // uploadData.push({shoes: shoesImage ? shoesImage.id : -1})

        console.log(uploadData, ServerUrl.url + 'wear/createcoordi/')
        axios.post(ServerUrl.url + 'wear/createcoordi/', uploadData, requestHeaders)
        .then(res => {
            console.log(res)
            // navigation.navigate('All')
        })
        .catch(err => console.error(err.response))
    }
    
    const OneOfItems = ({item, image}) => {
        return(
            <>
                {item.id === image?.id ?
                    <ItemBox>
                        <ImageBackground 
                            style={{ width: "100%", height: "100%", borderWidth: 5, borderColor: "rgb(234, 152, 90)" }}
                            source={{uri : ServerUrl.mediaUrl + item.img}}
                            resizeMode="cover"
                        />
                    </ItemBox>
                    :
                    <ItemBox>
                        <ImageBackground 
                            style={{ width: "100%", height: "100%" }}
                            imageStyle={{ borderRadius: 5}}
                            source={{uri : ServerUrl.mediaUrl + item.img}}
                            resizeMode="cover"
                        />
                    </ItemBox>
                }
            </>
        );
    }
    return (
        <>
        <TopContainer>
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
                                {userItems.tops?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.top, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={topImage}/>
                                        </TouchableHighlight>
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
                                {userItems.pants?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.pants, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={pantsImage}/>
                                        </TouchableHighlight>
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
                                {userItems.outers?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.outer, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={outerImage}/>
                                        </TouchableHighlight>
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
                                {userItems.shoes?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.shoes, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={shoesImage}/>
                                        </TouchableHighlight>
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
                                {userItems.hats?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.hat, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={hatImage}/>
                                        </TouchableHighlight>
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
                                {userItems.bags?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.bag, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={bagImage}/>
                                        </TouchableHighlight>
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
                                {userItems.watches?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.watch, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={watchImage}/>
                                        </TouchableHighlight>
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
                                {userItems.accs?.map(item => {
                                    return (
                                        <TouchableHighlight
                                            key={item.id}
                                            onPress={() => {
                                                setImageUri(CategoryEngText.accessory, item);
                                            }}
                                        >
                                            <OneOfItems item={item} image={AccImage}/>
                                        </TouchableHighlight>
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
            </TopContainer>
            <ScrollView>
            <View style={{height: Dimensions.get('window').height + 150}}>
            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        openItemModal();
                    }}>
                    {hatImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + hatImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.hat }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        openItemModal();
                    }}>
                    
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
                        openItemModal();
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
                        openItemModal();
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
                        openItemModal();
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
                    onPress={() => {
                        openItemModal();
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
                        openItemModal();
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
                        openItemModal();
                    }}>
                    {shoesImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + shoesImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.shoes }</Text>
                    }
                </TouchableHighlight>
            
                <View style={formStyles.uploadBox}/>
            </RowContainer>
            <TextInput
                multiline
                theme={{ colors: { primary: "#0d3754" }}}
                numberOfLines={4}
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
                >
                {colorRGB.map((item, index) => {
                    return (
                        <TouchableHighlight
                            key={index}
                            onPress={() => {
                                setSelectedColor(color_name[index]);
                            }}
                        >
                        {selectedColor[0] === item[0] && selectedColor[1] === item[1] && selectedColor[2] === item[2] ? 
                            <SelectColorContainer borderSize={3} R={item[0]} G={item[1]} B={item[2]} />
                            :
                            <SelectColorContainer borderSize={1} R={item[0]} G={item[1]} B={item[2]} />
                        }

                        </TouchableHighlight>
                    );
                })}
                </ScrollView>
            </Container>
            <Text style={{marginHorizontal: 22}}>코디의 스타일을 선택해주세요</Text>
            <Container >
                <ScrollView
                    horizontal={true}
                    style={{marginHorizontal: 22}}
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
                                    <View style={{marginVertical: 10, marginHorizontal: 5, padding: 1, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(13, 55, 84, 0.5)', borderRadius: 50}}>
                                        <SlectStyleText StyleText>{styleKor[index]}</SlectStyleText>
                                    </View>
                                :
                                    <View style={{marginVertical: 10, marginHorizontal: 5, padding: 1, width: 90, alignItems: 'center', justifyContent: 'center',backgroundColor: 'rgba(100, 100, 100, 0.5)', borderRadius: 50}}>
                                        <SlectStyleText StyleText>{styleKor[index]}</SlectStyleText>
                                    </View>                     
                                }
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </Container>
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