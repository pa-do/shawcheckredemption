import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

function LogoutButton(props) {
    return (

        <MaterialCommunityIcons name="logout" size={30} color="#0d3754" onPress={props.onPress} />

    )
}

export default LogoutButton;