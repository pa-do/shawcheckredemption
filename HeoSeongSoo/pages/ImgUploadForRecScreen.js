import React from  'react';
import { Text, View, Modal, StyleSheet, TouchableHighlight, Image, ScrollView  } from 'react-native';
import Container from '../components/Container';
import LongButton from '../components/buttons/LongButton';
import * as ImagePicker from 'expo-image-picker';



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
        const imageUri = route.params?.image.uri
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

    React.useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

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
                            navigation.navigate('Camera', {backScreen: 'ImgUpload'});
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>카메라</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                        onPress={() => {
                            pickImage();
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>갤러리에서 가져오기</Text>
                    </TouchableHighlight>
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
            <Text>
                코디를 생성하는 폼 화면
            </Text>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('top');
                }}>
                <Text style={styles.textStyle}>상의</Text>
            </TouchableHighlight>
            {topImage && <Image source={{ uri: topImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('pants');
                }}>
                <Text style={styles.textStyle}>하의</Text>
            </TouchableHighlight>
            {pantsImage && <Image source={{ uri: pantsImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('shoes');
                }}>
                <Text style={styles.textStyle}>신발</Text>
            </TouchableHighlight>
            {shoesImage && <Image source={{ uri: shoesImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('outer');
                }}>
                <Text style={styles.textStyle}>외투</Text>
            </TouchableHighlight>
            {outerImage && <Image source={{ uri: outerImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('hat');
                }}>
                <Text style={styles.textStyle}>모자</Text>
            </TouchableHighlight>
            {hatImage && <Image source={{ uri: hatImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('bag');
                }}>
                <Text style={styles.textStyle}>가방</Text>
            </TouchableHighlight>
            {bagImage && <Image source={{ uri: bagImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('watch');
                }}>
                <Text style={styles.textStyle}>시계</Text>
            </TouchableHighlight>
            {watchImage && <Image source={{ uri: watchImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('accessory');
                }}>
                <Text style={styles.textStyle}>악세서리</Text>
            </TouchableHighlight>
            {AccImage && <Image source={{ uri: AccImage }} style={{ width: 100, height: 100 }} />}

            <TouchableHighlight
                style={styles.recButton}
                onPress={recommendationRequest}
            >
                <Text style={styles.textStyle}>추천받기</Text>
            </TouchableHighlight>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'stretch',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      height: 40,
      backgroundColor: '#191970',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginBottom: 10,
    },
    recButton: {
        height: 40,
        backgroundColor: '#CD5C5C',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
      },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

export default ImgUploadForRecScreen;