import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import Ganhos from './Inside/Ganhos';
import Gasto from './Inside/Gasto';
import Perfil from './Inside/Perfil';
import Historico from './Inside/Historico';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';


const Tab = createBottomTabNavigator();

export default function Home({route}) {

  const navigation = useNavigation();

  const docId = route.params?.docId;
  const updateSaldoNoFirebase = route.params?.updateSaldoNoFirebase;

  

  return (
    <Tab.Navigator
      initialRouteName="Gastos"
      screenOptions={{
        tabBarActiveTintColor: '#E4E4E4',
        tabBarStyle: { backgroundColor: '#29322C', borderTopWidth: 0 /* Removendo a borda superior */ },
      }}>

<Tab.Screen
  name="Historico"
  options={({ navigation }) => {
    const isFocused = useIsFocused();

    return {
      headerShown: false,
      tabBarLabel: 'Histórico',
      tabBarIcon: ({ color }) => (
        <MaterialIcons name="history" size={28} color={color} />
      ),
      /* tabBarBadge: 3, */     // Isso é para mostrar a quantidade de notificações no ícone
      tabBarOnPress: () => {
        if (isFocused) {
          // Atualize a tela aqui
          // Por exemplo, recarregue os dados ou execute ações de atualização
          console.log('Ícone do Histórico pressionado - Atualizando tela...');
        }
        navigation.navigate('Historico');
      },
    };
  }}
>
  {() => <Historico docId={docId}/>}
</Tab.Screen>


<Tab.Screen
  name="Gastos"
  options={{
    headerShown: false,
    tabBarLabel: 'Início',
    tabBarIcon: ({ color }) => (
      <AntDesign name="home" size={24} color={ color } />
    ),
  }}
>
  {() => <Gasto docId={docId} />}
</Tab.Screen>



<Tab.Screen
  name="Perfil"
  options={{
    headerShown: false,
    tabBarLabel: 'Perfil',
    tabBarIcon: ({ color }) => (
      <MaterialCommunityIcons name="account" color={ color } size={28} />
    ),
  }}
>
  {() => <Perfil docId={docId}  />}
</Tab.Screen>
    </Tab.Navigator>
  );
}
