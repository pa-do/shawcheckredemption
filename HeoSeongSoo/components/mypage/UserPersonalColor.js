import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';


const Label = styled.Text`
    font-size: 18px;
`;

function UserPersonalColor(props) {

    var bgColor = 'white'
    {props.children === 'spring' ? bgColor = '#cad99e' : null}
    {props.children === 'summer' ? bgColor = '#a5c3e8' : null}
    {props.children === 'fall' ? bgColor = '#e0c6a4' : null}
    {props.children === 'winter' ? bgColor = '#c4c4c4' : null}

    return (
        <View style={{flexDirection:'row', 
        padding: 3, 
        flexWrap:'wrap', 
        marginVertical:10, 
        width: 120, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: bgColor,
        borderRadius:20}}>
            {props.children === 'spring' ? (
                <>  
                    <Label>봄웜톤 🌱</Label>
                </>
                ) : null}
            {props.children === 'summer' ? (
                <>  
                    <Label>여름쿨톤 ☀️</Label>
                </>
                ) : null}
            {props.children === 'fall' ? (
                <>  
                    <Label>가을웜톤 🍁</Label>
                </>
                ) : null}
            {props.children === 'winter' ? (
                <>  
                    <Label>겨울쿨톤 ❄️</Label>
                </>
                ) : null}

        </View>
    )
}

export default UserPersonalColor;