import React from  'react';
import { Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Container from '../components/Container';
import RowContainer from '../components/RowContainer';
import NormalButton from '../components/buttons/NormalButton';

function HomeScreen({ navigation }) {
    const [value, setValue] = React.useState('first');

    return (
        <Container>
            <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
                <RadioButton.Item label="First item" value="first" />
                <RadioButton.Item label="Second item" value="second" />
            </RadioButton.Group>
            <RowContainer>
                <NormalButton onPress={ () => navigation.navigate("ImgUpload") }>추천 받기</NormalButton>
            </RowContainer>
        </Container>
    )
}

export default HomeScreen;