import React from 'react';
import { ScrollView, Image, View, Dimensions } from 'react-native';
import { personalStyles } from '../components/StyleSheetComponent';

function PersonalColorScreen({ route }) {
    const [color, setColor] = React.useState(route.params.color);
    // console.log(path)
    return (
        <ScrollView>
            <View
                style={personalStyles.imageContainer}
            >
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