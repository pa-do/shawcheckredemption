import React from  'react';
import { Text, View } from 'react-native';
import NormalButton from '../components/buttons/NormalButton';

function MyItemsScreen() {
    return (
        <View>
            <Text>
                내가 가진 아이템을 확인하는 화면
            </Text>
            <NormalButton>
                아이템 업로드
            </NormalButton>
        </View>
    )
}

export default MyItemsScreen;