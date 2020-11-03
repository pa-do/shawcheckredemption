import React from  'react';
import { Text } from 'react-native';
import Container from '../components/Container';
import NormalButton from '../components/buttons/NormalButton';

function HomeScreen({ navigation }) {
    return (
        <Container>
            <Text>
                홈 화면 뭐가 들어갈지 아직 모름
            </Text>
            <NormalButton onPress={ () => navigation.navigate("All") }>모든 리스트</NormalButton>
            <NormalButton onPress={ () => navigation.navigate("MyList") }>마이페이지</NormalButton>
            <NormalButton onPress={ () => navigation.navigate("ImgUpload") }>추천 받기</NormalButton>
        </Container>
    )
}

export default HomeScreen;