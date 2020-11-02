import React from  'react';
import { Text, View, Modal, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import NormalButton from '../components/buttons/NormalButton';
import styled from 'styled-components/native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import produce from 'immer';


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

const Container = styled.SafeAreaView`
    flex: 1;
`;

const GridRowContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

function CodiMyListScreen({ navigation }) {
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
        ]
    }
    const [modalVisible, setModalVisible] = React.useState(false);
    const [myOrLikeVisible, setMyOrLikeVisible] = React.useState(false);
    const [showData, setShowData] = React.useState(UserData.codis);
    const [buttonText, setButtonText] = React.useState('하트코디 보기');
    
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
                    {itemsList.map(tempItems => { 
                        return (
                            <GridRowContainer>
                                {tempItems.map(item => {
                                    return (
                                        <TouchableWithoutFeedback
                                            style={{marginBottom: 5}}
                                            onPress={() => {
                                                navigation.navigate('Detail', {item: item})
                                            }}>
                                            <CodiItemImg
                                                source={{
                                                    uri: item.img,
                                                }}
                                            />
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
        <Container>
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
                    <Text style={styles.textStyle}>X</Text>
                    </TouchableHighlight>
                    <Container>
                        <Text style={styles.modalText}>상의</Text>
                        <View
                            style={{
                                alignSelf:'stretch',
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                    </Container>

                    <Container>
                        <Text style={styles.modalText}>하의</Text>
                        <View
                            style={{
                                alignSelf:'stretch',
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                    </Container>

                    <Container>
                        <Text style={styles.modalText}>외투</Text>
                        <View
                            style={{
                                alignSelf:'stretch',
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                    </Container>

                    <Container>
                        <Text style={styles.modalText}>신발</Text>
                        <View
                            style={{
                                alignSelf:'stretch',
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                    </Container>

                    <Container>
                        <Text style={styles.modalText}>모자</Text>
                        <View
                            style={{
                                alignSelf:'stretch',
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                    </Container>

                    <Container>
                        <Text style={styles.modalText}>기타</Text>
                    </Container>

                </View>
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
                            setModalVisible(true);
                        }}
                    >
                        내 아이템
                    </NormalButton>
                </UserProfileTextContainer>
            </UserProfileContainer>
            <NormalButton
                onPress={changeMyOrLikeVisible}
            >
                {buttonText}
            </NormalButton>
            <NormalButton
                onPress={() => {
                    navigation.navigate('Form')
                }}
            >
                코디등록
            </NormalButton>
            <ScrollView>
                <MyOrLike />
            </ScrollView>
        </Container>
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
      height: '70%',
      width: '90%',
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
      height: 30,
      backgroundColor: '#F194FF',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
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

export default CodiMyListScreen;