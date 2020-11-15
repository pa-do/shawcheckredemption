import React from 'react';
import { Button } from 'react-native-paper';

function MainSelectText(props) {
    return (
        <Button
        value={props.value}
        style={{borderWidth: 1, borderColor: '#c9a502', width: 200, marginBottom: 15, backgroundColor: 'white'}}
        labelStyle={{fontSize:20, fontWeight: 'bold', color: '#0d3754'}}
        onPress={props.onPress}
        theme={{colors: {primary: 'rgba(0, 0, 0, 0)'}}}
        >
        {props.label}</Button>

    )
}

export default MainSelectText;