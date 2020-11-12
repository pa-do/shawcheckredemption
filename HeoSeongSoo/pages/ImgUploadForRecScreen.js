import React from  'react';
import { Text, View, Modal, StyleSheet, TouchableHighlight, Image, ScrollView, Dimensions  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CategoryText } from '../components/TextComponent';
import { styles, formStyles } from '../components/StyleSheetComponent';
import RowContainer from '../components/RowContainer';


function ImgUploadForRecScreen({ navigation, route }) {
    const [uploadCategory, setUploadCategory] = React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [hatImage, setHatImage] = React.useState(null);
    const [topImage, setTopImage] = React.useState(null);
    const [pantsImage, setPantsImage] = React.useState(null);
    const [shoesImage, setShoesImage] = React.useState(null);
    const [outerImage, setOuterImage] = React.useState(null);
    const [bagImage, setBagImage] = React.useState(null);
    const [watchImage, setWatchImage] = React.useState(null);
    const [AccImage, setAccImage] = React.useState(null);

    
    const recommendationRequest = () => {
        // 서버로 이미지를 보내고 결과를 받아옵니다.
        // axios.post()
        //.then(res => {
        const res = {
            data: [
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
            ]
        };
        navigation.navigate('RecList', {rec: res.data});
        // })
    }

    React.useEffect(() => {
        navigation.setOptions({title: `착용할 의류 선택하기`});
        const imageUri = route.params.image?.uri
        if (imageUri) {
            switch (uploadCategory) {
                case 'top':
                    setTopImage(imageUri);
                    break;
                case 'pants':
                    setPantsImage(imageUri);
                    break;

                case 'shoes':
                    setShoesImage(imageUri);
                    break;

                case 'outer':
                    setOuterImage(imageUri);
                    break;

                case 'hat':
                    setHatImage(imageUri);
                    break;

                case 'bag':
                    setBagImage(imageUri);
                    break;

                case 'watch':
                    setWatchImage(imageUri);
                    break;

                case 'accessory':
                    setAccImage(imageUri);
                    break;
            }
        }
    }, [route.params?.image]);

    // React.useEffect(() => {
    //   (async () => {
    //     if (Platform.OS !== 'web') {
    //       const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    //       if (status !== 'granted') {
    //         alert('죄송합니다. 카메라 권한 허가가 필요합니다.');
    //         navigation.goBack();
    //       }
    //     }
    //   })();
    // }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            console.log(uploadCategory)
            switch (uploadCategory) {
                case 'top':
                    setTopImage(result.uri);
                    break;
                case 'pants':
                    setPantsImage(result.uri);
                    break;

                case 'shoes':
                    setShoesImage(result.uri);
                    break;

                case 'outer':
                    setOuterImage(result.uri);
                    break;

                case 'hat':
                    setHatImage(result.uri);
                    break;

                case 'bag':
                    setBagImage(result.uri);
                    break;

                case 'watch':
                    setWatchImage(result.uri);
                    break;

                case 'accessory':
                    setAccImage(result.uri);
                    break;
            }
        }
      };

    return (
        <ScrollView>
            <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>내 옷장에서 가져오기</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>닫기</Text>
                    </TouchableHighlight>
                </View>
                </View>
            </Modal>
            </View>
            <Text style={{color: 'black', textAlign: 'center', paddingVertical: 15, marginBottom: 22}}>
                착용할 의류을 옷장에서 가져오세요! {"\n"}
                (착용할 의류가 없으면 그냥 '추천받기'를 눌러요!)
            </Text>
            <View style={{height: Dimensions.get('window').height}}>
            <RowContainer style={formStyles.RowContainerHeight}>
                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                    setModalVisible(true);
                    setUploadCategory('hat');
                    }}>
                    {hatImage !== null ? 
                        <Image source={{ uri: hatImage }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.hat }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                    setModalVisible(true);
                    setUploadCategory('top');
                    }}
                    >
                    
                    {topImage !== null ? 
                        <Image source={{ uri: topImage }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.top }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                    setModalVisible(true);
                    setUploadCategory('outer');
                    }}>
                    {outerImage !== null ? 
                        <Image source={{ uri: outerImage }} style={formStyles.uploadedItem} /> 
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
                    setModalVisible(true);
                    setUploadCategory('accessory');
                    }}>
                    {AccImage !== null ? 
                        <Image source={{ uri: AccImage }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.accessory }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                    setModalVisible(true);
                    setUploadCategory('pants');
                    }}>
                    {pantsImage !== null ? 
                        <Image source={{ uri: pantsImage }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.pants }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                    setModalVisible(true);
                    setUploadCategory('bag');
                    }}>
                    {bagImage !== null ? 
                        <Image source={{ uri: bagImage }} style={formStyles.uploadedItem} /> 
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
                    setModalVisible(true);
                    setUploadCategory('watch');
                    }}>
                    {watchImage !== null ? 
                        <Image source={{ uri: watchImage }} style={formStyles.uploadedItem} /> 
                    : 
                        <Text style={styles.uploadboxText}>{ CategoryText.watch }</Text>
                    }
                </TouchableHighlight>

                <TouchableHighlight
                    style={formStyles.uploadBox}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                    setModalVisible(true);
                    setUploadCategory('shoes');
                    }}>
                    {shoesImage !== null ? 
                        <Image source={{ uri: shoesImage }} style={formStyles.uploadedItem} /> 
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