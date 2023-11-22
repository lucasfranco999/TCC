import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { database } from '../fb';
import { PieChart } from 'react-native-svg-charts';
import Meu from '../Components/graphs/grafico'
import { StackedBarChart } from 'react-native-svg-charts'
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function Historico({ docId }) {
  const [gastos, setGastos] = useState([]);
  const [ganhos, setGanhos] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [totalGanhos, setTotalGanhos] = useState(0); // Alteração aqui
  const [totalGastos, setTotalGastos] = useState(0);

  const fetchData = async () => {
    try {
      const docRef = doc(database, 'Usuarios', docId);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.gastos) {
          setGastos([...data.gastos]);
        }
        if (data.ganhos) {
          setGanhos([...data.ganhos]);
        }
        if (data.saldo || data.saldo === 0) {
          setSaldo(data.saldo); // Definir o saldo a partir dos dados recuperados
        }
      } else {
        console.log('Documento não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados: ', error);
    }
  };
  
   const pieData = [
    {
      value: totalGastos,
      key: 'gastos',
      svg: { fill: '#214A37' },
    },
    {
      value: totalGanhos,
      key: 'ganhos',
      svg: { fill: '#578372' },
    },
  ];

const Label = ({ slices }) => {
  return slices.map((slice, index) =>  {
    const {pieCentroid, data} = slice;
    return(
      <Meu 
      index={index}
      pieCentroid={pieCentroid}
      data={data}
      />
    )
  })
}

const handleDeleteGasto = async (index, currentSaldo) => {
  try {
    if (Array.isArray(gastos) && index >= 0 && index < gastos.length) {
      const deletedGasto = gastos[index];
      const updatedGastos = [...gastos];
      updatedGastos.splice(index, 1);

      // Deduzir o valor da despesa do saldo atual
      const diferencaSaldo = parseFloat(deletedGasto.valor);

      let novoSaldo = 0;

      // Verificar se o saldo atual é NaN, se não, calcular o novo saldo
      if (!isNaN(currentSaldo)) {
        novoSaldo = currentSaldo + diferencaSaldo;
      }

      // Atualizar o estado de gastos com os gastos atualizados
      setGastos(updatedGastos);

      // Recalcular o total de gastos a partir dos gastos atualizados
      const novoTotalGastos = updatedGastos.reduce((total, gasto) => total + parseFloat(gasto.valor), 0);

      // Atualizar o estado de totalGastos com o novo cálculo
      setTotalGastos(novoTotalGastos);

      // Atualizar o documento do usuário com as novas despesas e o novo saldo
      const docRef = doc(database, 'Usuarios', docId);
      await updateDoc(docRef, { gastos: updatedGastos, saldo: novoSaldo });

      setSaldo(novoSaldo);

      console.log('Gasto excluído com sucesso. Novo saldo:', novoSaldo);
    } else {
      console.error('Índice de gasto inválido.');
    }
  } catch (error) {
    console.error('Erro ao excluir gasto: ', error);
  }
};



useEffect(() => {
  if (Array.isArray(gastos)) {
    // Recalcula o total de gastos
    const novoTotalGastos = gastos.reduce((total, gasto) => total + parseFloat(gasto.valor), 0);
    setTotalGastos(novoTotalGastos); // Atualiza o total de gastos
  }
}, [gastos]); // Observa alterações no estado de gastos

const handleDeleteGanho = async (index, currentSaldo) => {
  try {
    if (ganhos && ganhos.length > index) {
      const deletedGanho = ganhos[index];
      const updatedGanhos = [...ganhos];
      updatedGanhos.splice(index, 1);

      // Adicione o valor do ganho de volta ao saldo atual
      const diferencaSaldo = parseFloat(deletedGanho.valor);

      let novoSaldo = 0;

      // Verificar se o saldo atual é NaN, se não, calcular o novo saldo
      if (!isNaN(currentSaldo)) {
        novoSaldo = currentSaldo - diferencaSaldo;
      }

      setGanhos(updatedGanhos);

      // Recalcular o total de ganhos a partir dos ganhos atualizados
      const novoTotalGanhos = updatedGanhos.reduce((total, ganho) => total + parseFloat(ganho.valor), 0);
      setTotalGanhos(novoTotalGanhos);

      // Atualizar o documento do usuário com os ganhos atualizados e o novo saldo
      const docRef = doc(database, 'Usuarios', docId);
      await updateDoc(docRef, { ganhos: updatedGanhos, saldo: novoSaldo });

      // Atualizar o estado de 'saldo' com o novo saldo calculado
      setSaldo(novoSaldo);

      console.log('Ganho excluído com sucesso. Novo saldo:', novoSaldo);
    } else {
      console.error('Índice de ganho inválido.');
    }
  } catch (error) {
    console.error('Erro ao excluir ganho: ', error);
  }
};
useEffect(() => {
  if (Array.isArray(ganhos)) {
    const novoTotalGanhos = ganhos.reduce((total, ganho) => total + parseFloat(ganho.valor), 0);
    setTotalGanhos(novoTotalGanhos);
  }
}, [ganhos]);

  // Use o useFocusEffect para atualizar os dados quando a tela for focada
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  
  return (
    <LinearGradient style={styles.container} colors={['#AFFFA8', '#4b726b']}>
      <ScrollView>
        <View style={styles.boxTitle}>
          <Text style={styles.titleGraf}>Razão do dia</Text>
        </View>
      <View style={styles.boxGraf}>
        <View style={styles.graf}>
          
          <PieChart style={styles.pie} data={pieData}><Label/></PieChart>

        </View>
        <View style={styles.boxLeg}>
          <View style={styles.legPlus}>
            <FontAwesome name="square" size={24} color="#214A37" />
            <Text style={styles.leg}>Despesas</Text>
          </View>
          <View style={styles.legPlus}>
            <FontAwesome name="square" size={24} color="#578372" />
            <Text style={styles.leg}>Receita</Text>
          </View>
        </View>
      </View>
        
      <View style={styles.bigbox}>
        <View style={styles.box}>
          <Text style={styles.title}>Despesas</Text>
          {gastos.map((item, index) => (
            <View style={styles.insideBox} key={index}>
              <Text style={styles.itens}>
                {item.nome} - R$ {item.valor}
              </Text>
              <TouchableOpacity style={styles.delete} onPress={() => handleDeleteGasto(index, saldo)}>

                <Text style={styles.txtBtn}><Feather name="trash-2" size={24} color="red"/></Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View> 

      <View style={styles.bigbox}>
        <View style={styles.box}>
        <Text style={styles.title}>Receita</Text>
          {ganhos.map((item, index) => (
            <View style={styles.insideBox} key={index}>
              <Text style={styles.itens}>
                {item.nome} - R$ {item.valor}
              </Text>
              
              <TouchableOpacity style={styles.delete} onPress={() => handleDeleteGanho(index)}>
                <Text style={styles.icondelete}><Feather name="trash-2" size={24} color="red" /></Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eefafa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#29322C',
    borderRadius: 20,
    marginBottom: 20,
    minBlockSize: "150px",
    writingMode: "horizontal-tb",
    padding: 20,
    width: '100%',
  },
  insideBox:{
    display:"flex",
    flexDirection: "row",
    justifyContent:"space-between",
    marginVertical:10,
  },

  bigbox: {
    width: 370,
  },
  boxTitle:{
    borderRadius:10,
    margin:0,
    borderRadius:10,
    backgroundColor:"#29322C",
    marginTop:35,
  },
  title: {
    fontSize: 20,
    color:"#e4e4e4",
    marginLeft: '5%',
    marginBottom:15,
  },
  titleGraf: {
    fontSize: 20,
    color:"#E4E4E4",
    paddingLeft: '5%',
    paddingBottom:15,
    paddingTop: 15,
  },
  itens: {
    marginBottom: 10,
    color: '#E4E4E4',
  },
  btn: {
    borderRadius: 10,
    backgroundColor: '#29322C',
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
  delete:{
    backgroundColor: 'transparent',
  },
  icondelete:{

  },
  refreshButtonText: {
    color: '#fff',
  },
  pie: {
    height: 150,
    width: 150,
  },
  boxGraf:{
    flexDirection: "row",
    marginTop:25,
    marginBottom:25
  },
  boxLeg: {
    justifyContent:"space-evenly",
  },
  legPlus:{
    flexDirection: "row",
  },
  leg:{
    fontSize: 20,
    marginLeft: 8,
  },
  graf: {
    margin: 25,
    fontFamily:"",
  }
});