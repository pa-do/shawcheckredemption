import React from 'react';
import { Ionicons } from '@expo/vector-icons';  
import { TouchableHighlight } from 'react-native';

function BackButton(props) {
    return (
        <TouchableHighlight
        style={{position: 'absolute', zIndex: 1, top: 15, left: 10}}
        underlayColor="none"
        onPress={props.onPress} >
            <Ionicons name="ios-arrow-dropleft" size={50} color="black" />
        </TouchableHighlight>

    )
}

export default BackButton;