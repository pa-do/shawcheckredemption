import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

function MypageButton(props) {
    return (
        <TouchableHighlight
        value={props.value}
        style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#0d3754', width: '26%', marginRight: '2%', padding: 0}}
        onPress={props.onPress} 
        >   
            {/* value가 closet일 경우 */}
            {props.value === 'closet' ? (
                <>  
                    <MaterialCommunityIcons name="file-cabinet" size={36} color="black" />
                    <Text>내옷장</Text>
                </>
                ) :
                (
                <>  
                    <MaterialCommunityIcons name="bookmark-plus-outline" size={36} color="black" />
                    <Text>코디 등록</Text>
                </>
                )
                }
            
        </TouchableHighlight>

    )
}

export default MypageButton;