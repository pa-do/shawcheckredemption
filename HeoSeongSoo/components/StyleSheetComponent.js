import { StyleSheet } from 'react-native';
import Constants from 'expo-constants'
import { Dimensions } from 'react-native';
import AuthContext from './AuthContext';

// 모든 스타일을 관리하는 컴포넌트

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      openButton: {
		    width: 250,
        height: 40,
        backgroundColor: '#191970',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
      },
      recButton: {
          alignSelf: 'center',
          backgroundColor: '#0d3754',
          borderRadius: 5,
          paddingVertical: 15,
          paddingHorizontal: 40,
          elevation: 2,
          marginTop: 22,
          marginBottom: 22,
        },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      uploadboxText: {
        color: 'black',
        textAlign: 'center',

      },
})

const formStyles = StyleSheet.create({
	RowContainerHeight: {
    width: '100%',
    height: undefined,
    aspectRatio: 1/0.3,
	},
	uploadBox: {
		width: '30%',
    height: undefined,
    aspectRatio: 1 / 1,
		backgroundColor: 'white',
    borderColor: '#0d3754',
    borderWidth: 0.5,
	},
	uploadedItem: {
		width: '100%',
		height: '100%',
		resizeMode: 'center',
	}
})

const personalStyles = StyleSheet.create({
  imageContainer: {
    width: '90%', 
    backgroundColor: '#000000', 
    marginTop: Constants.statusBarHeight,
  },
  imageStyles: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 300
  }
})

const gridStyles = StyleSheet.create({
  col: {
    backgroundColor: 'black',
    width: '33%',
    height: undefined,
    aspectRatio: 1 / 1,
    margin: 1,
    padding: 0,
  },
  row: {
    width: '100%',
    backgroundColor: 'red',
  }

})
export { styles, formStyles, personalStyles, gridStyles };