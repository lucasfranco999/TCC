import * as React from 'react';
import { StyleSheet,Text, View} from 'react-native';
import { database } from '../fb';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Product ({
    id,
    name,
    valor,
    isVendido
}) {
    const navigation = useNavigation();

    const onEdit  = () =>  {
        const docRef = doc(database, 'Real', id);
        updateDoc(docRef, {
            isVendido: true,
        })
    }

    const onDelete = () => {
        const docRef = doc(database, 'Real', id);
        deleteDoc(docRef);
    }
    return(
       
        <View style={styles.container}>
            <View style={styles.row}> 
                <View style={styles.col}>
                    <Text style={styles.txt}>{name}</Text>
                    <Text style={styles.txt}>R$ {valor}</Text>
                </View>
                <Text>                             </Text>
                <TouchableOpacity onPress={onDelete}>
                    <AntDesign name="delete" size={32} color="#615856" />
                </TouchableOpacity>
                
                    
             
            </View>
            {isVendido ? (
                <TouchableOpacity style={[styles.btn, {backgroundColor:'gray'}]}>
                    <Text style={styles.txtbtn}>Comprar</Text>
                </TouchableOpacity>
            ): (
                <TouchableOpacity style={styles.btn}
                    onPress={onEdit}
                >
                    <Text style={styles.txtbtn}>Comprar</Text>
                </TouchableOpacity>
            )}
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      width:'50%',
      borderRadius: 10,
      paddingBottom: 10,
      marginBottom: '2%',
    },
    col:{
        flexDirection: 'column',
       
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    txt:{
        fontSize: 32,
        color: "#615856",
    },
    btn:{
        backgroundColor: "#615856",
        paddingHorizontal: "3%",
        paddingVertical: "1%", 
        justifyContent: 'center',
        borderRadius: 5,
        marginBottom: 5,
        width: 200,
        height: 40,
        
      },
      txtbtn :{
        color: "#ddd2d2",
        fontSize: 32,
        textAlign: 'center',
        justifyContent: 'center'
      },
})