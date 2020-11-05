import React from  'react';
import { Alert, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Container from '../components/Container';
import RowContainer from '../components/RowContainer';
import NormalButton from '../components/buttons/NormalButton';

function HomeScreen({ navigation }) {
    const [value, setValue] = React.useState('school');
    const [secondValue, setSecondValue] = React.useState(null);

    return (
        <Container>
            <RowContainer>
                <RadioButton.Group
                    onValueChange={value => {
                        setValue(value)
                        setSecondValue('freind')
                    }}
                    value={value}
                >
                    <RadioButton.Item label="학교" value="school" />
                    <RadioButton.Item label="장례식" value="funeral" />
                    <RadioButton.Item label="결혼식" value="marry" />
                    <RadioButton.Item label="운동" value="exercise" />
                    <RadioButton.Item label="발표" value="presentation" />
                    <RadioButton.Item label="PC방/편한 곳" value="comfortable" />
                    <RadioButton.Item label="외식" value="restaurant" />
                </RadioButton.Group>
                <RadioButton.Group onValueChange={value => setSecondValue(value)} value={secondValue}>
                    {value === 'school' ? (
                        <>
                            <RadioButton.Item label="교수님" value="professor"/>
                            <RadioButton.Item label="여사친" value="girl-freind"/>
                            <RadioButton.Item label="친구" value="freind"/>
                        </>
                     ) : null}
                     {value === 'comfortable' ? (
                        <>
                            <RadioButton.Item label="여사친" value="girl-freind"/>
                            <RadioButton.Item label="친구" value="freind"/>
                        </>
                     ) : null}
                    {value === 'restaurant' ? (
                        <>
                            <RadioButton.Item label="교수님" value="professor"/>
                            <RadioButton.Item label="여사친" value="girl-freind"/>
                            <RadioButton.Item label="친구" value="freind"/>
                            <RadioButton.Item label="가족" value="family"/>
                        </>
                     ) : null}
                </RadioButton.Group>
            </RowContainer>

            <RowContainer>
                <NormalButton onPress={ () => {
                    console.log(value, secondValue, '<<<<<<<<<<<<<<<<<<<< user pick')
                    if (value === 'school' || value === 'comfortable' || value === 'restaurant') {
                        navigation.navigate("ImgUpload", {value: value, secondValue: secondValue})
                    } else {
                        navigation.navigate("ImgUpload", {value: value})
                    }
                }}
                >
                    추천 받기
                </NormalButton>
            </RowContainer>
        </Container>
    )
}

export default HomeScreen;