import React from  'react';
import { Alert, Text, View, Modal, TouchableHighlight, Image } from 'react-native';
import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { StackActions } from '@react-navigation/native';
import { TextInput, Button, ActivityIndicator, Colors } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../components/AuthContext';
import axios from 'axios';
import { ServerUrl } from '../components/TextComponent';
import { styles } from '../components/StyleSheetComponent';

const Container = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    padding-top: ${Constants.statusBarHeight}px;
`;

const ErrorMsg = styled.Text`
    color: red;
    font-size: 12px;
`;

function SignupScreen({ navigation, route }) {
    const [modalImageVisible, setModalImageVisible] = React.useState(false);
    const [indicatorVisible, setIndicatorVisible] = React.useState(false);
    const [userImage, setUserImage] = React.useState(null);
    const [textNickname, setTextNickname] = React.useState(route.params?.nickname);
    const [userToken, setUserToken] = React.useState(route.params?.userToken);

    const [nicknameError, setNicknameError] = React.useState(null);
    const [imageError, setimageError] = React.useState(null);

    React.useEffect(() => {
        const imageUri = route.params?.image?.uri
        setUserImage(imageUri);
        // imageUri 서버에 업로드 uploadCategory 첨부, 후 모달 재오픈
        // setModalVisible(true);
    }, [route.params?.image]);

    const patchUserNickname = () => {
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`
            }
        }

        const patchData = {
            nickname: textNickname
        }

        axios.patch(ServerUrl.url + 'rest-auth/user/', patchData, requestHeaders)
        .then(res => {
            console.log(res.data, '<<<<<<<<<<<<<<<<<<<<<< patched user data')
        })
        .catch(err => console.log(err.response))
    }

    const getUserPersonalColor = () => {
        setIndicatorVisible(true);
        const requestHeaders = {
            headers: {
                Authorization: `JWT ${userToken}`,
                "Content-Type": "multipart/form-data",
            }
        }

        const userImageData = {
            uri: userImage,
            type: 'image/jpeg',
            name: 'item.jpg',
        }
        const fd = new FormData();
        fd.append('img', userImageData);

        axios.post(ServerUrl.url + 'accounts/personalcolor/', fd, requestHeaders)
        .then(res => {
            console.log(res.data)
            if (res.data === '정면 사진을 올려주세요.') {
                setimageError('다른 이미지를 올려주세요');
            } else {
                let color;
                switch (res.data){
                    case ('봄웜톤(spring)'):
                        color = 'spring';
                        break;
                    case ('여름쿨톤(summer)'):
                        color = 'summer';
                        break;
                    case ('가을웜톤(fall)'):
                        color = 'fall';
                        break;
                    case ('겨울쿨톤(winter)'):
                        color = 'winter';
                        break;
                }
                navigation.dispatch(
                    StackActions.replace("PersonalColor", {color: color})
                );
            }
            setIndicatorVisible(false);
        })
        .catch(err => {
            setIndicatorVisible(false);
            console.error(err.response.data)
        })
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        setUserImage(result.uri);
        // 서버에 result 업로드, uploadCategory 첨부
    }
    return (
        <Container>
            <>  
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
                            <Text>퍼스널 컬러를 분석중입니다</Text>
                        </View>
                    </View>
                </Modal>
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
                                    navigation.navigate('Camera', {backScreen: 'Sign up2'});
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
                                    setModalImageVisible(!modalImageVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>닫기</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <TextInput
                    label="Nickname"
                    value={textNickname}
                    onChangeText={text => setTextNickname(text)}
                />
                {nicknameError !== null ? <ErrorMsg>{ nicknameError }</ErrorMsg> : null}
                {userImage && <Image source={{ uri: userImage }} style={{ width: 150, height: 150, resizeMode: 'center' }} />}
                <Button
                    icon="account-circle-outline"
                    mode="outlined"
                    onPress={() => {
                        setModalImageVisible(true);
                    }}
                >
                    퍼스널 컬러 진단을 위한 사진 업로드
                </Button>
                {imageError && <ErrorMsg>{ imageError }</ErrorMsg>}
                <Button
                    icon="account-plus"
                    mode="contained"
                    onPress={() => {
                        if (textNickname === undefined) {
                            return setNicknameError('닉네임을 입력해주세요.')
                        } else if (textNickname.length === 0) {
                            return setNicknameError('닉네임을 입력해주세요.')
                        } else if (userImage === undefined) {
                            return setimageError('이미지를 등록해주세요. 이미지는 저장되지 않습니다.')
                        } else {
                            console.log(userImage);
                            patchUserNickname();
                            getUserPersonalColor();
                        }
                    }}
                >
                    제출
                </Button>
            </>
        </Container>
    );
}

export default SignupScreen;