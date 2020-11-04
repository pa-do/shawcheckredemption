import React from  'react';
import { Text, View, Modal, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, ImageBackground, DevSettings } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import NormalButton from '../components/buttons/NormalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import Constants from 'expo-constants'
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import produce from 'immer';
import AuthContext from '../components/AuthContext';


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

function CodiMyListScreen({ navigation, route }) {
    const UserData = {
        profileImg: 'https://i.pinimg.com/originals/45/27/4c/45274c8d6a7c4290e4b261503e343016.jpg',
        name: '정승히',
        color: 'summer',
        codis: [
            {
                id: 5,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Un1.svg/1200px-Un1.svg.png',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            },
            {
                id: 6,
                img: 'https://i.stack.imgur.com/FAOZX.png',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            },
            {
                id: 7,
                img: 'https://blognumbers.files.wordpress.com/2010/09/3.jpg',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            },
            {
                id: 8,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Quatre.svg/1200px-Quatre.svg.png',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            },            
            {
                id: 9,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Cinq.svg/1200px-Cinq.svg.png',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            },
            {
                id: 10,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Cinq.svg/1200px-Cinq.svg.png',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            },
            {
                id: 11,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Cinq.svg/1200px-Cinq.svg.png',
                content: '겨울코디,크리스마스코디,연말코디',
                liked: false,
                likes: 1,
                user: '정승희',
                items: [{}, {}, {}, {}, {}]
            },
        ],
        likeCodis:[
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
        ],
    }
    const userItems = {
        // UserItems는 내 아이템 모달 창이 열리면 요청합니다.
        hats: [
            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJ8AnwMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAQIFBgcIAwT/xAA/EAABAwIDBQYDBAgGAwAAAAABAAIDBBEFBiEHEjFBURMiYXGBkRShsVJiksEVI0Nyc9Hh8AgyM0KCohYkRP/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A3iiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIsfzBnXLuXS5mKYpCycf/PGe0l/A25HqgyBFp7F9uVO1xZg2DSyC/8Aq1coYPPdbe/uFjU22fNUjyWMw6MX0a2ncR83IOhkXPtPtszNGf19NhUrf4EjT776u1Lt0qLgVWAxPHMxVJb8i0qwbsRa5wfbJlmueI61tXhzybXmi32fiZe3mQFe6faPlGoxH4BmNQtmvZrpGuZG4+DyN0+6gytERAREQEREBERAREQFZc05pwnK1F8Ti1Rul1+ygZ3pJT0a38+A5kL4M+5zpMo4bvu3Zq+YEU1Nf/MftO6NH9Fo6mwXMGd56zHq6V/w7N4y1kjC7RovuRRjV1uTRYeN1YPqzhtRx3H3Pho5X4Xh50EVO+0jx96Tj6NsORusFmjfBM+GaN8MrT345GlrwfEHW62pkmmyfg9U6vlmnmq47dk7Ead8bIXW1cLtAv46m+gsBvHNpfgMRoJZW0zMWiLixkLGsc17r3fdzu6Gg8TexIsTIdBUc526qm9+GgWw845dyxSQQzxYiyhqKjtCBTk1VMXNOrbtALTy0aGi3DmteceSgW6INCpUIK96w9bKRLcbrwHN6ELzUEIOhNkGeMPxLCKPL9TKYcSpY+zjbK+/xDBw3SeYA1bxsOY4bLXGLZHxSNkjc5j2ODmuaSC0g6EHkVvHZjtUFfJDguZpWtqnWZT1p0Ep5Nf0d0PA8NDxituoiICIiAiIgKyZvzJS5WwWTEKrvvvuQQg2Msh4Dy5k8gCr05zWNLnkNaBcknQBc27Rs1vzNjr5I3n4GnvHSs+7zf5utfyAHJXBYscxSsxzE58RxKXtaiY6ng1o5NaOTRyH5klZLhW0vFcKwemw2loaEspo+zY9zXcOpAPH6rCS4dVSTp9fBVGXT7T81POk9LF/Dpxp7krzi2oZqjN3VNNIeslMPyssRkOtufNeRuoL3WYzh2KTSVGI4FAypldvST0E74CSTx3Xb7Sdeis9S2nbJ/6r5XRW/asDXDw0JB89PILz8U0QEsik9EFJQDhZTYFSOF0FDhc2VJHXgvS2pKoIQb52L59fisIy9jM5fXQtvSTPOs7ANWk83NHuPIlbXXHFDUz0NRDV0cphqoJBJFK3i1w4FdW5Nx+LM+W6LFomhjpmWljB/wBOQGzm+4NvCyir0i8qmohpYHz1U0cMMY3nySODWtHUk8FrzMO2DA6BzocJacQmH++5jiHrYk+gt4oNkK1Y1mPBsDZvYriMFObXEbnXefJo1PstD45tKzHi4c1leKWA6dnRfq/+x73zWITTlz3OfcyON3OPElWDaWftpsWMYfLheCMlippe7PPJZrpG/ZA5A87620stWSOF/wCYXn2t7cvFUl/yVRJcRr2bXeHBUOew2s0h1/8AK7+9U3gU89UHmSeNvVUk8dOq9HdPzVO6HXt7KDzKkWupcNdOqpQSOARByQ6oGtipPggHet1CqAufAcCgpIA0HBA26qtcqVRS7Rbf/wAPWMFtRiuCSO7r2irhb4izH/WP5rUDlmWx6rNHtCw65syZk0T/AC7NzvqwJonapnCsx3MFXSmV7cOpJnRQQA2aS07peepJBt0HrfAXyOcNT6LdmfNjtfiOM1GI5eqqbsqqR0slPUucwse43dukA3BJJtpa6tOF7CMYmeDiuK0VLHzEAdM75hoHzUVqXfLDdriCOYNlsLJWzfM2Y4u3qIm0FCRdk9W0hz+m6ziR4m3gTwW5cqbMss5ZcyaCkNXWN1FTV2e5p+6LbrfMC/isyUHJ2ZsuYnlnEPgsWp+zeReORpvHKOrHc/kRzAVmcSut8xYDh+Y8Lkw/FIRJC/Vrho6N3JzTyI/pwXMuccsV2VsYfQVw3mkF0E7RZs0f2h0I5jkfAgmosQNuSm9uKo1uVN+qD0vdUuF9fYhRz6Kf74oKN/UCTTXQ8iqt3S/JS4A6EDx5rzO9GNASzoeIQSRYEKeIS7XNDgbqW6aFA4N1VYFm8dedlSAXPJPLT1S/RUSnNUniiAeKv+Qg7/zHDNy+9vScP4T1YAFm+xyg+Oz/AEJIuymimmeOo3Cz6yBB0miIsqIiICsWcsr0Wa8GfQ1fclHfp6gC7oZORHUciOYV9RByJjmD1uB4nPh+JQ9lUwmzmjUOHJzTzaeIP5gq3rp7aHkmmzfhvd3IcTgB+GqCNP3HfdPyOvUHmzE8PqsLrZqKvgfBUwu3ZI3jVp/PrfgQbhVHyhVcv5hUqdfFBNz1PoFHp7qTf7yjzsPmg8nxX70Zs6+t+BRkupY8Wd0Xt4/VUPY14F7kjh4IPQkMYADc24/X5qLaL1pcMr6immq4KKplpYBeWpZE4xx/vOtYLzJvpa1lRBFlFtVV5qlAW5f8PmFaYvi7xoSyljNunff9Wey02PHguodmuE/obJOFUzmlsskPbyg8d+TvEHyvb0TRk6IiyoiIgIiICxPPmRqDN9KHPtT4jE20NUBy+y4c2/TlzByxEHJuZcs4tlqr+HxakdFc2ZKNY5P3XcD5ceoCtIK7CrKSmrqZ9NW08VRBILPilYHNcPEHRYhW7KsnVchkOFuhceIgqJGN/CHWHoFaOa/RS0Fz2xsbvPebNa0Xc49AOa6Pg2SZMicHHDZpLG9n1ctvYOWT4RgGD4KCMJwykpCeLoYWtc7zPE+qUc2RZCzZLh769uAVphaL7pa0SkeEZIefZYjUVEjHujEZjc0lrg8d4Hpbku01h+a9muWczyPqKujNNWvNzV0p3Hk9XDg71BKDnTKuc8eyrUF+GVhMTr9pSzjfhk829fEWPK9lOPY3heKzNq6PCv0ZUPd+vhhfvQO+8wWBZr/t1HPTnsrHNg8jYS/AcZEkg/ZVrN0H/m3h+H2Wssw5NzDl0uOL4VUQxN/btG/F+NtwPWxQfICHDQ+qhfHBKWG17sK+4C9uYOoVRlGzfLIzRmeCknaTRwjt6rxYCO7/AMiQPK/RdPAAAACwHILXexTLn6Ky2cUmbapxPdkb92EX3Pe5d6jotiqaoiIoCIiAiIgIiICIiAiIgIiICggEWIuCpRBiWZNnGWMfhlEuGw0tU/UVVKwRyB3U20d6grD8H2JQ0WKxSV2LCtw9j950BgLHSD7JO9oL8Tz8OK26iCmONkUbY4mNYxgDWtaLAAcAAqkRAREQEREBERAREQEREBERAREQEREBERAREQf/2Q==',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQHZpX2h-s2bHEBM4QVTHrdBu0XUumr87T5WIrIApr5oqcqehwxZhtCEGi73nse3kVdsCzndeeQ&usqp=CAc',
            'data:image/jpeg;base64,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',
        ],
        tops: ['https://simage-kr.uniqlo.com/goods/31/12/43/71/421078_COL_COL00_1000.jpg'],
        pants: ['data:image/jpeg;base64,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'],
        shoes: [],
        outers: [],
        bags: [],
        watches: [
            'https://image-cdn.hypb.st/https%3A%2F%2Fkr.hypebeast.com%2Ffiles%2F2020%2F09%2Frolex-submariner-41mm-new-generation-release-info-01.jpg?q=75&w=800&cbr=1&fit=max',
            'https://img.danawa.com/prod_img/500000/639/587/img/3587639_1.jpg?shrink=500:500&_v=20151207091445',
            'https://img.danawa.com/prod_img/500000/573/228/img/3228573_1.jpg?shrink=500:500&_v=20181114175810',
            'https://m.seokwatches.com/web/product/big/201810/96a4f07f467efc012ad523633a5aec7d.jpg',
            'https://www.cartier.co.kr/content/dam/rcq/car/14/70/71/9/1470719.png.scale.314.high.%EB%B0%9C%EB%A1%B1-%EB%B8%94%EB%A3%A8-%EB%93%9C-%EA%B9%8C%EB%A5%B4%EB%9D%A0%EC%97%90-%EC%9B%8C%EC%B9%98-%EC%8A%A4%ED%8B%B8.jpg',
            'https://www.cartier.co.kr/content/dam/rcq/car/14/37/99/7/1437997.png.scale.314.high.%ED%8C%AC%EB%8D%94-%EB%93%9C-%EA%B9%8C%EB%A5%B4%EB%9D%A0%EC%97%90-%EC%9B%8C%EC%B9%98-%EC%8A%A4%ED%8B%B8.png',
            'https://mblogthumb-phinf.pstatic.net/MjAxODAxMTJfNiAg/MDAxNTE1NzQ0OTc0MjU1.FDN4M2VSUEpySSr7mQ0NBK9In-NTo6h_vgkvRtnJ7yUg.B8GfhvxkTpqic1iyIvqQw2VVY9Kc9ftsg2aNhNQHr7Eg.JPEG.singsing7792/6002G_001_AMB.jpg?type=w800',
            'https://t1.daumcdn.net/cfile/tistory/23298742530164C31E',
        ],
        accs: [],
    }
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalImageVisible, setModalImageVisible] = React.useState(false);
    const [myOrLikeVisible, setMyOrLikeVisible] = React.useState(false);
    const [uploadCategory, setUploadCategory] = React.useState();
    // const [userItems, setUserItems] = React.useState();
    const [showData, setShowData] = React.useState(UserData.codis);
    const [buttonText, setButtonText] = React.useState('하트코디 보기');
    
    const { signOut } = React.useContext(AuthContext);

    React.useEffect(() => {
        const imageUri = route.params?.image.uri
        // imageUri 서버에 업로드 uploadCategory 첨부, 후 모달 재오픈
        // setModalVisible(true);
    }, [route.params?.image]);

    function changeMyOrLikeVisible() {
        setMyOrLikeVisible(!myOrLikeVisible);
        if (myOrLikeVisible) {
            setButtonText('하트코디 보기');
            setShowData(UserData.codis);
        } else {
            setButtonText('내 코디 보기')
            setShowData(UserData.likeCodis);
        }
    }

    function MyOrLike() {
        const items = showData
        const itemsList = []
        if (items.length !== 0) {
            for (let i = 0; i <= parseInt(items.length / 3); i++) {
                let startPoint = (i * 3)
                let endPoint = (i * 3) + 3
                if (endPoint > items.length) {
                    endPoint = endPoint - 1
                    if (endPoint > items.length) {
                        endPoint = endPoint - 1
                    }
                }
                try {
                    itemsList.push(items.slice(startPoint, endPoint))
                } catch (error) {
                    console.log(error)
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
                                                navigation.navigate('Detail', {item: item})
                                            }}>
                                            <CodiItemImg source={{uri: item.img}}/>
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        // 서버에 result 업로드, uploadCategory 첨부
    }

    return (
        <TopContainer>
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
                                setModalVisible(!modalVisible);
                                setModalImageVisible(!modalImageVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>카메라</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                pickImage();
                                setModalImageVisible(!modalImageVisible);
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                <ScrollView>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>상의</Text>
                        <Container>
                            <ScrollView
                                horizontal={true}
                            >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory('top');
                                        setModalImageVisible(true);
                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.tops.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : item}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        <Text style={styles.modalText}>하의</Text>
                        <Container>
                            <ScrollView
                                horizontal={true}
                            >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory('pants');
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.pants.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : item}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>


                        <Text style={styles.modalText}>외투</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory('outer');
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.outers.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : item}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>


                        <Text style={styles.modalText}>신발</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory('shoes');
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.shoes.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : item}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>


                        <Text style={styles.modalText}>모자</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory('hat');
                                        setModalImageVisible(true);

                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.hats.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : item}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        
                        <Text style={styles.modalText}>가방</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory('bag');
                                        setModalImageVisible(true);
                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.bags.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : item}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        <Text style={styles.modalText}>시계</Text>
                        <Container>
                            <ScrollView
                                    horizontal={true}
                                >
                                <ItemBox>
                                    <TouchableHighlight onPress={() => {
                                        setUploadCategory('watch');
                                        setModalImageVisible(true);
                                    }}>
                                        <Ionicons name={'ios-add'} size={50} color={"black"} />
                                    </TouchableHighlight>
                                </ItemBox>
                                {userItems.watches.map((item, index) => {
                                    return (
                                        <ItemBox key={index}>
                                            <ImageBackground 
                                                style={{ width: "100%", height: "100%" }}
                                                source={{uri : item}}
                                                resizeMode="cover"
                                            />
                                        </ItemBox>
                                    );
                                })}
                            </ScrollView>
                        </Container>
                        <Seperator/>

                        <Text style={styles.modalText}>악세서리</Text>
                        <Container>
                        <ScrollView
                                horizontal={true}
                            >
                            <ItemBox>
                                <TouchableHighlight onPress={() => {
                                    setUploadCategory('accessory');
                                    setModalImageVisible(true);

                                }}>
                                    <Ionicons name={'ios-add'} size={50} color={"black"} />
                                </TouchableHighlight>
                            </ItemBox>
                            {userItems.accs.map((item, index) => {
                                return (
                                    <ItemBox key={index}>
                                        <ImageBackground 
                                            style={{ width: "100%", height: "100%" }}
                                            source={{uri : item}}
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
                                setModalVisible(!modalVisible);
                            }}
                        >
                        <Text style={styles.textStyle}>닫기</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
                </View>
            </Modal>

            <UserProfileContainer>
                <UserProfileImg
                    source={{uri: UserData.profileImg}}
                />
                <UserProfileTextContainer>
                    <Text>
                        {UserData.name}
                    </Text>
                    <Text>
                        {UserData.color}
                    </Text>
                    <NormalButton
                        onPress={() => {
                            // UserItems 데이터를 수신합니다.
                            signOut();
                        }}
                    >
                        로그아웃
                    </NormalButton>
                    <NormalButton
                        onPress={() => {
                            // UserItems 데이터를 수신합니다.
                            setModalVisible(true);
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
            <ScrollView>
                <MyOrLike />
            </ScrollView>
        </TopContainer>
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
      maxWidth: '90%',
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
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
      width: 250,
      height: 30,
      backgroundColor: '#F194FF',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 5,
      textAlign: 'left',
    },
  });

export default CodiMyListScreen;