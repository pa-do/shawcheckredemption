import React from  'react';
import { Alert, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Container from '../components/Container';
import RowContainer from '../components/RowContainer';
import NormalButton from '../components/buttons/NormalButton';
import { RadioButtonText } from '../components/TextComponent';

function HomeScreen({ navigation }) {
    const [value, setValue] = React.useState('school');
    const [secondValue, setSecondValue] = React.useState('friend');

    return (
        <Container>
            <RowContainer>
                <RadioButton.Group
                    onValueChange={value => {
                        setValue(value)
                        setSecondValue('friend')
                    }}
                    value={value}
                >
                    <RadioButton.Item label={RadioButtonText.school} value="school" />
                    <RadioButton.Item label={RadioButtonText.funeral} value="funeral" />
                    <RadioButton.Item label={RadioButtonText.marry} value="marry" />
                    <RadioButton.Item label={RadioButtonText.exercise} value="exercise" />
                    <RadioButton.Item label={RadioButtonText.presentation} value="presentation" />
                    <RadioButton.Item label={RadioButtonText.comfortable} value="comfortable" />
                    <RadioButton.Item label={RadioButtonText.restaurant} value="restaurant" />
                </RadioButton.Group>
                <RadioButton.Group onValueChange={value => setSecondValue(value)} value={secondValue}>
                    {value === 'school' ? (
                        <>
                            <RadioButton.Item label={RadioButtonText.professor} value="professor"/>
                            <RadioButton.Item label={RadioButtonText.girlFriend} value="girlFriend"/>
                            <RadioButton.Item label={RadioButtonText.friend} value="friend"/>
                        </>
                     ) : null}
                     {value === 'comfortable' ? (
                        <>
                            <RadioButton.Item label={RadioButtonText.girlFriend} value="girlFriend"/>
                            <RadioButton.Item label={RadioButtonText.friend} value="friend"/>
                        </>
                     ) : null}
                    {value === 'restaurant' ? (
                        <>
                            <RadioButton.Item label={RadioButtonText.professor} value="professor"/>
                            <RadioButton.Item label={RadioButtonText.girlFriend} value="girlFriend"/>
                            <RadioButton.Item label={RadioButtonText.friend} value="friend"/>
                            <RadioButton.Item label={RadioButtonText.family} value="family"/>
                        </>
                     ) : null}
                </RadioButton.Group>
            </RowContainer>

            <RowContainer>
                <NormalButton
                    onPress={ () => {
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