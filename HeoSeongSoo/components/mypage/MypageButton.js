import React from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

function MypageButton(props) {
    return (
        <Button
        value={props.value}
        style={{borderWidth: 1, borderColor: '#0d3754', width: '25%', marginRight: '2%'}}
        onPress={props.onPress} 
        >   
            {/* value가 closet일 경우 */}
            <MaterialCommunityIcons name="file-cabinet" size={24} color="black" />
            {/* <Text>내옷장</Text> */}
        </Button>

    )
}

export default MypageButton;