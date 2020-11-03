import React from 'react';
import styled from 'styled-components/native';

const Container = styled.TouchableHighlight`
    width: 70%;
    height: 50px;
    background: #034F84;
    justify-content: center;
    align-items: center;
    margin: 12px;
`;

const Label = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #F3E7DB;
`;

function LongButton(props) {
    return (
        <Container onPress={ props.onPress }>
            <Label>{props.children}</Label>
        </Container>
    )
}

export default LongButton;