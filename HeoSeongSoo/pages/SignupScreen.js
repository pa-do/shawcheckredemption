import React from  'react';
import { Alert, Text, View, Modal, TouchableHighlight, StyleSheet, Image } from 'react-native';
import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../components/AuthContext';
import axios from 'axios';
import ServerUrl from '../components/ServerUrl';

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
    const [textAccount, setTextAccount] = React.useState('');
    const [textNickname, setTextNickname] = React.useState('');
    const [textPassword, setTextPassword] = React.useState('');
    const [textPasswordConfrim, setTextPasswordConfrim] = React.useState('');
    const [modalImageVisible, setModalImageVisible] = React.useState(false);
    const [userImage, setUserImage] = React.useState();

    const [accountError, setAccountError] = React.useState(null);
    const [nicknameError, setNicknameError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);

    const { signUp } = React.useContext(AuthContext);

    React.useEffect(() => {
        const imageUri = route.params?.image.uri
        setUserImage(imageUri);
        // imageUri 서버에 업로드 uploadCategory 첨부, 후 모달 재오픈
        // setModalVisible(true);
    }, [route.params?.image]);

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
                                navigation.navigate('Camera', {backScreen: 'Sign up'});
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
                label="Account"
                value={textAccount}
                onChangeText={text => setTextAccount(text)}
            />
            {accountError !== null ? <ErrorMsg>{ accountError }</ErrorMsg> : null}
            <TextInput
                label="Nickname"
                value={textNickname}
                onChangeText={text => setTextNickname(text)}
            />
            {nicknameError !== null ? <ErrorMsg>{ nicknameError }</ErrorMsg> : null}
            <TextInput
                label="Password"
                type="password"
                value={textPassword}
                onChangeText={text => setTextPassword(text)}
                secureTextEntry
            />
            <TextInput
                label="Password Confirm"
                value={textPasswordConfrim}
                onChangeText={text => setTextPasswordConfrim(text)}
                secureTextEntry
            />
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
            <Button
                icon="account-plus"
                mode="contained"
                onPress={() => {
                    if (textAccount.length === 0 || textPassword.length === 0 || textPasswordConfrim.length === 0 || textNickname.length === 0) {
                        return Alert.alert("", "모든 정보를 입력해주세요.");
                    } else if (textPassword !== textPasswordConfrim) {
                        return Alert.alert("", "비밀번호가 일치하지 않습니다.");
                    } else if (textPassword.length < 8) {
                        return setPasswordError('비밀번호는 8자리 이상 이어야 합니다.');
                    } else if (textAccount.length < 6) {
                        return setAccountError('아이디는 6글자 이상 이어야 합니다.');
                    } else {
                        const signupData = {
                            username: textAccount,
                            nickname: textNickname,
                            password1: textPassword,
                            password2: textPasswordConfrim
                        }
                        // 회원가입 로직 -> 닉네임, 아이디 중복 확인 처리
                        axios.post(ServerUrl.url + 'rest-auth/registration/', null, signupData)
                        .then(res => {
                            console.log(res)
                            signUp(res.data.token);
                        })
                        .catch(err => console.error(err))
                    }
                }}
            >
                제출
            </Button>
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

export default SignupScreen;