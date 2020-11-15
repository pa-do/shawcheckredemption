import React, { useState, useEffect, useRef } from 'react';
import { StackActions } from '@react-navigation/native';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

// 카메라 화면입니다. 비율을 맞추는 것을 제외하고는 추가적 디자인 작업 필요없습니다.

function CameraScreen({ navigation, route }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        alert('죄송합니다. 카메라 권한 허가가 필요합니다.');
        return navigation.goBack();
    }
    return (
        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 0.8 }} type={type} ref={ref => {
            setCameraRef(ref) ;
        }}>
            <View
                style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'flex-end'
                }}>
                <TouchableOpacity
                style={{
                    flex: 0,
                    alignSelf: 'flex-end'
                }}
                onPress={() => {
                    setType(
                    type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                </TouchableOpacity>

            </View>
            </Camera>
            <View style={{flex: 0.2, justifyContent: 'center'}}>
            <TouchableOpacity style={{alignSelf: 'center'}} onPress={async() => {
                if(cameraRef){
                    let photo = await cameraRef.takePictureAsync({ quality: 0.5 });
                    navigation.navigate(route.params.backScreen, {image: photo})
                    // navigation.dispatch(
                    //     StackActions.replace(route.params.backScreen, {
                    //         image: photo
                    //     })
                    // );
                }
                }}>
                <View style={{ 
                    borderWidth: 2,
                    // borderRadius:"50%",
                    borderColor: 'black',
                    height: 80,
                    width: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'}}
                >
                    <View style={{
                        borderWidth: 2,
                        // borderRadius:"50%",
                        borderColor: 'white',
                        height: 60,
                        width:60,
                        backgroundColor: 'black'}} >
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CameraScreen;