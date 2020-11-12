import React from 'react';
import styled from 'styled-components/native';

const Label = styled.Text`
    font-size: 35px;
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 20px;
`;

function MainText(props) {
    return (
        <Label>{props.children}</Label>
    )
}

export default MainText;