import React from 'react';
import { ScrollView, Image, View } from 'react-native';
import Constants from 'expo-constants';
import AuthContext from '../components/AuthContext';
import BackButton from '../components/buttons/BackButton';
import { personalStyles } from '../components/StyleSheetComponent';

function PersonalColorScreen({ navigation, route }) {
    const [color, setColor] = React.useState(route.params.color);
    const [userToken, setUserToken] = React.useState(route.params.userToken);

    const { signUp } = React.useContext(AuthContext);

    function moveBack() {
        signUp(userToken);
    }

    return (
        <ScrollView>
            <View
                style={personalStyles.imageContainer, {backgroundColor:'white', flex: 1, marginTop: Constants.statusBarHeight}}
            >
                <BackButton 
                onPress={() => moveBack()}
                ></BackButton>
                {color === 'spring' ? 
                    <Image
                        style={personalStyles.imageStyles}
                        source={require('../assets/personal/spring.png')}
                    />
                :
                    null
                }
                {color === 'summer' ? 
                    <Image
                        style={personalStyles.imageStyles}
                        source={require('../assets/personal/summer.png')}
                    />
                :
                    null
                }
                {color === 'fall' ? 
                    <Image
                        style={personalStyles.imageStyles}
                        source={require('../assets/personal/fall.png')}
                    />
                :
                    null
                }
                {color === 'winter' ? 
                    <Image
                        style={personalStyles.imageStyles}
                        source={require('../assets/personal/winter.png')}
                    />
                :
                    null
                }

            </View>
        </ScrollView>
    );
}

export default PersonalColorScreen;