import React from 'react';
import { Button } from 'react-native-paper';

function MainSelectText(props) {
    return (
        <Button
        value={props.value}
        style={{borderWidth: 1, borderColor: '#0d3754', width: 200, marginBottom: 15}}
        labelStyle={{fontSize:20, fontWeight: 'bold', color: '#0d3754'}}
        onPress={props.onPress} 
        >
        {props.label}</Button>

    )
}

export default MainSelectText;