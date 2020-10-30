import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Camera } from 'expo-camera';


function CodiFormScreen({ navigation }) {
    const [uploadCategory, setUploadCategory] = React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [images, setimages] = React.useState([]);
    
    const onSelect = data => {

    }
    return (
        <View>
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
                        navigation.navigate('Camera', {category: uploadCategory});
                        setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>카메라</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>갤러리에서 가져오기</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>내 옷장에서 가져오기</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
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
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('pants');
                }}>
                <Text style={styles.textStyle}>하의</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('shoes');
                }}>
                <Text style={styles.textStyle}>신발</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('outer');
                }}>
                <Text style={styles.textStyle}>외투</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('hat');
                }}>
                <Text style={styles.textStyle}>모자</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('bag');
                }}>
                <Text style={styles.textStyle}>가방</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('watch');
                }}>
                <Text style={styles.textStyle}>시계</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                setModalVisible(true);
                setUploadCategory('accessory');
                }}>
                <Text style={styles.textStyle}>악세서리</Text>
            </TouchableHighlight>
        </View>
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

export default CodiFormScreen;