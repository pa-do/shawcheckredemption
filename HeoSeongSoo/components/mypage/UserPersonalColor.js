import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Text } from 'react-native';



function UserPersonalColor(props) {

    var bgColor = 'white'
    {props.children === 'spring' ? bgColor = '#cad99e' : null}
    {props.children === 'summer' ? bgColor = '#a5c3e8' : null}
    {props.children === 'fall' ? bgColor = '#e0c6a4' : null}
    {props.children === 'winter' ? bgColor = '#c4c4c4' : null}

    return (
        <View style={{flexDirection:'row',  
        flexWrap:'wrap', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: bgColor,
        borderRadius:20}}>
            {props.children === 'spring' ? (
                <>  

                    <Text style={{ padding:5}}>🌱</Text>

                </>
                ) : null}
            {props.children === 'summer' ? (
                <>  
                    <Text style={{ padding:5}}>☀️</Text>
                </>
                ) : null}
            {props.children === 'fall' ? (
                <>  
                    <Text style={{ padding:5}}>🍁</Text>
                </>
                ) : null}
            {props.children === 'winter' ? (
                <>  
                    <Text style={{ padding:5}}>❄️</Text>
                </>
                ) : null}

        </View>
    )
}

export default UserPersonalColor;