import React, { useState } from 'react';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Text, Button, TouchableOpacity, Image, View, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { addDoc, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import Product from '../Components/Produto';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../fb'
import { useRoute } from '@react-navigation/native'


// Usando o expo.fyi para os ícones
import { AntDesign } from '@expo/vector-icons';

export default function Gasto({docId}) {
  const [products, setProducts] = useState([]); // Estado para armazenar os produtos
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    // Função executada quando o componente é montado
    const collectionRef = collection(database, 'Real');
    const q = query(collectionRef, orderBy('createAt', 'desc'));

    // Configura um snapshot para ouvir as mudanças na coleção 'Real'
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Atualiza o estado dos produtos com os dados do Firestore
      setProducts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          valor: doc.data().valor,
          isVendido: doc.data().isVendido,
          createAt: doc.data().createAt,
        }))
      );
    });

    // Função de retorno para cancelar o snapshot quando o componente é desmontado
    return unsubscribe;
  }, []); 

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [newItem, setNewItem] = useState({
    nome: '',
    valor: '',
    createAt: new Date(),
  });

  const onSend = async () => {
    try {
  
      const idDocumentoExistente = docId;
      const documentoRef = doc(database, 'Usuarios', idDocumentoExistente);
      const documentoExistente = await getDoc(documentoRef);
      const arrayGastosExistente = documentoExistente.data().gastos || [];
  
      // Adiciona a nova despesa ao array 'gastos'
      const novoArrayGastos = [...arrayGastosExistente, newItem];
  
      // Obtém o saldo atual do usuário
      const saldoAtual = documentoExistente.data().saldo || 0;
  
      // Converte o valor da nova despesa para float (considerando que o valor está em formato numérico)
      const valorDespesa = parseFloat(newItem.valor) || 0;
  
      // Calcula o novo saldo após a despesa ser adicionada
      const novoSaldo = saldoAtual - valorDespesa;
  
      // Atualiza o documento existente no Firestore com a nova despesa e o novo saldo
      await updateDoc(documentoRef, {
        gastos: novoArrayGastos,
        saldo: novoSaldo,
      });
  
      Alert.alert('Valor Salvo', 'As informações foram adicionadas ao histórico');
      setNewItem({
        nome: '',
        valor: '',
        createAt: new Date(),
      });
      console.log('Documento atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
    }
  };
  

  const handleValorChange = (text) => {
    // Esta função garante que apenas valores numéricos sejam aceitos no campo de valor
    const numericValue = text.replace(/[^0-9,.]/g, ''); // Remove todos os caracteres que não são números
    setNewItem({...newItem, valor: numericValue});
  };

  return (
      <LinearGradient
        style={styles.container}
        colors={['#AFFFA8', '#4b726b']}>
          <View style={styles.aba}>
            <Text style={styles.txt}>Despesas</Text>
            <TouchableOpacity  style={styles.btn} marginTop="10" onPress={() => navigation.navigate('Ganhos', { docId })} >
              <Text style={styles.txtBtn}>Ganhos</Text>
            </TouchableOpacity>
          </View>
        
        
        {products.map(product=><Product key={product.id} {...product}/> )}

        <View style={styles.row}>
        <Text style={styles.txt2}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do gasto Ex: Padaria"
          underlineColorAndroid="transparent"
          onChangeText={(text) => setNewItem({...newItem, nome:text})}
          value={newItem.nome}
        />

        <Text style={styles.txt2} marginTop="10%">Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="R$"
          underlineColorAndroid="transparent"
          onChangeText={handleValorChange}
          value={newItem.valor}
          keyboardType="numeric" // Define o teclado para numérico
        />

          <TouchableOpacity  style={[styles.btn, {marginTop: 20, backgroundColor:"#fff"}]} onPress={onSend} >
            <Text style={[styles.txtBtn, { color:"#000" }]} >Registrar</Text>
          </TouchableOpacity>
          
      </View>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eefafa",
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    backgroundColor:"#29322C",
    padding: 20,
    borderRadius: 10,
    height:"70%",
    width:350,
    marginHorizontal:"20%",
    
  },
  aba:{
    flexDirection:"row",
    backgroundColor:"#29322C",
    borderRadius: 10,
    width:350,
    padding:15,
    marginBottom:10,
  },
  icon:{
    color:"#292D32",
    right:100,
  },

  input:{
    backgroundColor:"#E4E4E4",
    borderRadius:15,
    paddingVertical:5,
    paddingHorizontal:10,
  },
  txt:{
    fontSize: 25,
    marginRight:"35%",
    color:"#fff",
  },
  txt2:{
    //marginTop:"40%",
    fontSize:15,
    color:"#E4E4E4"
  },
  btn: {
    //marginBottom: 10,
    alignItems: "flex-end",
    width:100,
    borderRadius: 35,
    backgroundColor: "#578372",
    paddingHorizontal: 10,
    paddingVertical:5,
    alignItems:"center",
  },
  txtBtn: {
    color:"#fff"
  }
});