import { StyleSheet, Text, View, Image, Button, TouchableOpacity, TextInput, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDoc } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, database, getAuth, auth } from '../fb';

export default function Cadastrar({navigator, route}) {
  const [senha, setSenha] = useState('');
  const [senha1, setSenha1] = useState('');
  const [email, setEmail] = useState('');
  const [nCompleto, setNCompleto] = useState('');
  const [saldo, setSaldo] = useState('');
  const [validarEmail, setvalidarEmail] = useState(false)
  const [botaoPressionado, setbotaoPressionado] = useState(false);
  const navigation = useNavigation();


  const ValidarEmail = (text) => {
    // expressão regular para verificar o formato do email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(text);
    setvalidarEmail(isValid);
    setEmail(text);
  };

  const cadastrarUsuario = async () => {
    setbotaoPressionado(true);
    if (senha !== senha1) {
      Alert.alert('Senhas Diferentes', 'Por favor, certifique-se de que as senhas estejam iguais!');
      setSenha('');
      setSenha1('');
    } else if (!validarEmail) {
      setEmail('');
      Alert.alert('E-mail inválido', 'Por favor, insira um e-mail válido.');
    } else {
      try {
        // Cria o usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
  
        if (user) {
          // Salva os dados no Firestore Database e obtém a referência do documento
          const docRef = await addDoc(collection(database, 'Usuarios'), {
            nome: nCompleto,
            email: user.email,
            senha: senha,
            saldo: saldo,
            createdAt: new Date(),
          });
  
          // Obtém o ID do documento criado
          const docId = docRef.id;
  
          // Redireciona para a tela de Home, passando o ID do documento como parâmetro
          navigation.navigate('Home', { docId } );
        } else {
          console.log('Erro ao cadastrar o usuário');
        }
      } catch (error) {
        console.log('Erro ao cadastrar o usuário:', error);
        setEmail('');
        setSenha('');
        setSenha1('');
      }
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#AFFFA8', '#4b726b']}>
      <TouchableOpacity style={styles.iconBack} onPress={() => navigation.navigate('Login')}>
        <AntDesign name="left" color="#292D32" size={40}/>
      </TouchableOpacity>

      <AntDesign name="adduser" size={120} style={styles.logo} />

      <View style={styles.inputs}>
        <Ionicons name="person" style={styles.icon} size={24}/>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          underlineColorAndroid="transparent"
          onChangeText={setNCompleto}
        />
      </View>
        
      <View style={styles.inputs}>
        <FontAwesome5 name="key" style={styles.icon} size={24}/>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={true}
          value={senha}
          underlineColorAndroid="transparent"
          onChangeText={setSenha}
        />
      </View>

        
      <View style={styles.inputs}>
        <Octicons name="key" style={styles.icon} size={24} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry={true}
          value={senha1}
          underlineColorAndroid="transparent"
          onChangeText={setSenha1}
        />
      </View>
        
      <View style={styles.inputs}>
        <MaterialCommunityIcons name="email-outline" style={styles.icon} size={24} />
        <TextInput
          style={[styles.input, botaoPressionado && !validarEmail && styles.inputError]}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={ValidarEmail}
          value={email}
        />
      </View>
        
      <View style={styles.inputs}>
        <FontAwesome5 name="money-bill-wave" style={styles.icon} size={24} />
        <TextInput
          style={styles.input}
          placeholder="Saldo Mínimo"
          underlineColorAndroid="transparent"
          keyboardType='numeric'
          value={saldo}
          onChangeText={(text) => {
            // Filtra apenas os dígitos numéricos
            const numericValue = text.replace(/[^0-9]/g, '');
            setSaldo(numericValue);
          }}
        />
        </View>

        
      <TouchableOpacity style={styles.btn} onPress={cadastrarUsuario}>
        <Text style={styles.txtBtn}>Cadastrar-se</Text>
      </TouchableOpacity>
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
  logo: {
    color:"#292D32",
    marginBottom:50,
  },
  icon:{
    color:"#292D32",
    marginRight:10
  },
  iconBack:{
    width:"90%",
    flexDirection:"row",
    marginLeft:"10%"
  },
  gradient: {
    height: "100%",
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width:250,
    marginTop: 2,
    marginBottom:4,
    height: 30,
    backgroundColor: "#E4E4E4",
    borderWidth: 0,
    borderRadius: 13,
    paddingLeft:10,
  },
  btn: {
    marginTop: 50,
    borderRadius: 10,
    backgroundColor: "#29322C",
    paddingHorizontal: 50,
    paddingVertical:5,
  },
  txtBtn: {
    color:"#fff"
  },
  inputs: {
    flexDirection:"row",
    alignItems:"center",
    right:17,
    marginBottom:24
  },
  inputError: {
    borderColor: 'red', // Estilo de erro
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -24,
    marginBottom:4,
  },
})