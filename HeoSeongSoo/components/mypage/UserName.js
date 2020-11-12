import React from 'react';
import styled from 'styled-components/native';



const Label = styled.Text`
    font-size: 24px;
    margin-right: 10px;
`;

function UserName(props) {
    return (
        <Label>{props.children}</Label>
    )
}

export default UserName;