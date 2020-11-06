import { StyleSheet } from 'react-native';


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
          height: 40,
          backgroundColor: '#CD5C5C',
          borderRadius: 20,
          padding: 10,
          elevation: 2,
          marginBottom: 10,
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
})

const formStyles = StyleSheet.create({
	RowContainerHeight: {
		height: '25%',
	},
	uploadBox: {
		width: '30%',
		height: '100%',
		backgroundColor: 'black',
		borderColor: 'white',
		borderWidth: 0.5,
		borderColor: 'white',
	},
	uploadedItem: {
		width: '100%',
		height: '100%',
		resizeMode: 'center',
	}
})

export { styles, formStyles };