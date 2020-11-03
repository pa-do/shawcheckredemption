import Constants from 'expo-constants';
import styled from 'styled-components/native';

const Container = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding-top: ${Constants.statusBarHeight}px;
`;

export default Container;