import React from  'react';
import { Text, View } from 'react-native';
import Container from '../components/Container';
import LongButton from '../components/buttons/LongButton';

function ImgUploadForRecScreen({ navigation }) {
    return (
        <Container>
            <Text>
                내가 가진 아이템으로 추천받기 위해 업로드하는 화면
            </Text>
            <LongButton onPress={ () => navigation.navigate("RecList") }>추천해주세요</LongButton>
        </Container>
    )
}

export default ImgUploadForRecScreen;