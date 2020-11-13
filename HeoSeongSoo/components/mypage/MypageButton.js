import React from 'react';
import { Text, TouchableHighlight, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

function MypageButton(props) {
    return (
        <TouchableHighlight
        value={props.value}
        underlayColor= 'none'
        style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', width: 40, height: 40, margin: '2%'}}
        onPress={props.onPress} 
        >   
            {/* value가 closet일 경우 */}
            {props.value === 'closet' ? (
                <>  
                    <Image
                        style={{width: '100%', height: '100%', resizeMode: 'center'}}
                        source={require('../../assets/items/closet.png')}
                    />
                </>
                ) :
                (
                <>  
                    <Image
                        style={{width: '100%', height: '100%', resizeMode: 'center'}}
                        source={require('../../assets/items/coordiPlus.png')}
                    />
                </>
                )
                }
            
        </TouchableHighlight>

    )
}

export default MypageButton;