import React from 'react';
import { StyleSheet, Modal, Text, TouchableHighlight, View, Image, ScrollView, Dimensions, ImageBackground } from 'react-native';
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

function CodiFormScreen({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [content, setContent] = React.useState('');
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
        navigation.setOptions({title: `코디를 만들어요`});
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
        const uploadData = []
        uploadData.push({1: hatImage ? hatImage.id : -1})
        uploadData.push({2: topImage ? topImage.id : -1})
        uploadData.push({3: outerImage ? outerImage.id : -1})
        uploadData.push({4: AccImage ? AccImage.id : -1})
        uploadData.push({5: pantsImage ? pantsImage.id : -1})
        uploadData.push({6: bagImage ? bagImage.id : -1})
        uploadData.push({7: watchImage ? watchImage.id : -1})
        uploadData.push({8: shoesImage ? shoesImage.id : -1})

        console.log(uploadData, ServerUrl.url + 'wear/createcoordi/')
        axios.post(ServerUrl.url + 'wear/createcoordi/', uploadData, requestHeaders)
        .then(res => {
            console.log(res)
            navigation.navigate('All')
        })
        .catch(err => console.error(err.response))
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
                                            onPress={() => {
                                                setImageUri(CategoryEngText.top, item);
                                            }}
                                        >
                                            <ItemBox key={item.id}>
                                                {item.id === topImage?.id ? 
                                                    <ImageBackground 
                                                        style={{ width: "100%", height: "100%" }}
                                                        source={{uri : ServerUrl.mediaUrl + item.img}}
                                                        resizeMode="cover"
                                                    />
                                                    :
                                                    <ImageBackground 
                                                        style={{ width: "100%", height: "100%" }}
                                                        imageStyle={{ borderRadius: 6}}
                                                        source={{uri : ServerUrl.mediaUrl + item.img}}
                                                        resizeMode="cover"
                                                    />
                                            
                                                }

                                            </ItemBox>
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
                                            onPress={() => {
                                                setImageUri(CategoryEngText.pants, item);
                                            }}
                                        >
                                            <ItemBox key={item.id}>
                                                <ImageBackground 
                                                    style={{ width: "100%", height: "100%" }}
                                                    source={{uri : ServerUrl.mediaUrl + item.img}}
                                                    resizeMode="cover"
                                                />
                                            </ItemBox>
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
                                            onPress={() => {
                                                setImageUri(CategoryEngText.outer, item);
                                            }}
                                        >
                                            <ItemBox key={item.id}>
                                                <ImageBackground 
                                                    style={{ width: "100%", height: "100%" }}
                                                    source={{uri : ServerUrl.mediaUrl + item.img}}
                                                    resizeMode="cover"
                                                />
                                            </ItemBox>
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
                                            onPress={() => {
                                                setImageUri(CategoryEngText.shoes, item);
                                            }}
                                        >
                                            <ItemBox key={item.id}>
                                                <ImageBackground 
                                                    style={{ width: "100%", height: "100%" }}
                                                    source={{uri : ServerUrl.mediaUrl + item.img}}
                                                    resizeMode="cover"
                                                />
                                            </ItemBox>
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
                                            onPress={() => {
                                                setImageUri(CategoryEngText.hat, item);
                                            }}
                                        >
                                            <ItemBox key={item.id}>
                                                <ImageBackground 
                                                    style={{ width: "100%", height: "100%" }}
                                                    source={{uri : ServerUrl.mediaUrl + item.img}}
                                                    resizeMode="cover"
                                                />
                                            </ItemBox>
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
                                            onPress={() => {
                                                setImageUri(CategoryEngText.bag, item);
                                            }}
                                        >
                                            <ItemBox key={item.id}>
                                                <ImageBackground 
                                                    style={{ width: "100%", height: "100%" }}
                                                    source={{uri : ServerUrl.mediaUrl + item.img}}
                                                    resizeMode="cover"
                                                />
                                            </ItemBox>
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
                                            onPress={() => {
                                                setImageUri(CategoryEngText.watch, item);
                                            }}
                                        >
                                            <ItemBox key={item.id}>
                                                <ImageBackground 
                                                    style={{ width: "100%", height: "100%" }}
                                                    source={{uri : ServerUrl.mediaUrl + item.img}}
                                                    resizeMode="cover"
                                                />
                                            </ItemBox>
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
                                        onPress={() => {
                                            setImageUri(CategoryEngText.accessory, item);
                                        }}
                                    >
                                        <ItemBox key={item.id}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : ServerUrl.mediaUrl + item.img}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
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
            <View style={{height: Dimensions.get('window').height}}>
            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    {hatImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + hatImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.hat }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    
                    {topImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + topImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.top }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    {outerImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + outerImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.outer }</Text>
                    }
                </TouchableHighlight>
            </RowContainer>

            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    {AccImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + AccImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.accessory }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    {pantsImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + pantsImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.pants }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    {bagImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + bagImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.bag }</Text>
                    }
                </TouchableHighlight>
            </RowContainer>

            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    {watchImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + watchImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.watch }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    onPress={() => {
                        openItemModal();
                    }}>
                    {shoesImage !== null ? 
                        <Image source={{ uri: ServerUrl.mediaUrl + shoesImage.img }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.textStyle}>{ CategoryText.shoes }</Text>
                    }
                </TouchableHighlight>
            
                <View style={formStyles.uploadBox}/>
            </RowContainer>

            <TextInput
                multiline
                numberOfLines={4}
                label="코디를 소개해주세요"
                value={content}
                onChangeText={text => setContent(text)}
            />

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