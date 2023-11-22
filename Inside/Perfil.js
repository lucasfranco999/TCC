import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View, TextInput, Alert, Modal, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

  const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp); 

export default function Perfil({ docId }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [salario, setSalario] = useState(0);
  const [senha, setSenha] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [newSalario, setNewSalario] = useState(0);
  const [isSalarioModalVisible, setIsSalarioModalVisible] = useState(false);
  const [isSaldoModalVisible, setIsSaldoModalVisible] = useState(false);

  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          const docRef = doc(database, 'Usuarios', docId);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setNome(data.nome);
            setEmail(data.email);
            setSaldo(data.saldo);

            

          } else {
            console.log('Documento não encontrado');
          }
        } catch (error) {
          console.log('Erro ao buscar o documento:', error);
        }
      }

      fetchData();
    }, [docId])
  );

  // Function to open the modal for changing salary
  const handleOpenModal = () => {
    setIsSalarioModalVisible(true);
  };

  // Function to close the modal and update the salary state
  const handleCloseModal = async () => {
    setIsSalarioModalVisible(false);

    try {
      const docRef = doc(database, 'Usuarios', docId);

      // Atualiza o campo 'salario' no documento do Firebase com o novo salário
      await updateDoc(docRef, {
        salario: parseFloat(newSalario),
      });

      console.log('Novo salário registrado com sucesso:');
    } catch (error) {
      console.error('Erro ao atualizar o salário no Firebase:', error);
    }

    setSalario(parseFloat(newSalario));
    setNewSalario('');
  };

  return (
    <LinearGradient style={styles.container} colors={['#AFFFA8', '#4b726b']}>
      <View style={styles.top}>
        <FontAwesome name="user-circle-o" style={styles.fotoPerfil} size={100} />
        <View>
          <Text style={styles.nome}>{nome}</Text>
          <View style={styles.saldoBox}>
            <Text style={styles.saldo}>Saldo: R$ {saldo}</Text>
          </View>
        </View>
      </View>

      <View style={styles.painel}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoText}>{email}</Text>

        <Text style={styles.infoLabel}>Nome Completo:</Text>
        <Text style={styles.infoText}>{nome}</Text>

        <View style={styles.infoBox}>
          <View>
            <Text style={styles.infoLabel}>Salário:</Text>
            <Text style={styles.infoText}>R$ {isNaN(salario) ? 0 : salario}</Text>
          </View>

          <TouchableOpacity onPress={handleOpenModal}>
            <MaterialCommunityIcons name="pencil" size={24} color="#E4E4E4" />
          </TouchableOpacity>
        </View>

        <View style={styles.exitContainer}>
          <Text style={styles.infoLabel}>Versão:</Text>
          <Text style={styles.infoText}>1.0.1</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.logOut}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for changing salary */}
      <Modal
        animationType="slide"
        transparent={true}
        style={styles.modal}
        visible={isSalarioModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.topModal}>
              <Text style={styles.saldo}>Edite o seu salário:</Text>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={handleCloseModal}>
                <FontAwesome name="close" size={24} color="#29322C" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={newSalario}
              onChangeText={(text) => setNewSalario(text)}
              placeholder="Digite o novo salário"
            />
            <Button title="Salvar" onPress={handleCloseModal} color={"#29322C"} />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    marginBottom: 30,
    alignSelf: "center",
    alignItems: 'center',
    width: 400,
  },
  fotoPerfil: {
    color: '#29322C',
    marginLeft: 20,
    marginTop: 50,
  },
  nome: {
    color: '#292D32',
    fontSize: 20,
    marginTop: 70,
    marginLeft: 10,
  },
  saldo: {
    color: '#292D32',
    fontSize: 15,
    marginLeft: 10,
  },
  saldoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 230,
  },
  infoLabel: {
    color: '#E4E4E4',
    fontSize: 15,
  },
  infoText: {
    color: '#C3C3C3',
    fontSize: 12,
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: "row",
    width: 300,
    justifyContent: "space-between",
  },
  painel: {
    width: 350,
    borderRadius: 10,
    padding: '5%',
    backgroundColor: '#29322C',
    alignSelf: 'center',
    marginBottom: 50,
  },
  exitContainer: {
    height: 340,
    justifyContent: "flex-end",
  },
  logOut: {
    color: '#E4E4E4',
    fontSize: 15,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modal: {
    width: 300,
    height: 400,
    backgroundColor: '#E4E4E4',
    padding: 20,
    borderRadius: 10,
    direction: "right"
  },
  closeIcon: {
    direction: "rtl",
    marginBottom: 20
  },
  input: {
    marginBottom: 40,
    borderWidth: 1,
    borderRadius: 10,
    height: 39,
    padding: 10,
  },
  topModal: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
