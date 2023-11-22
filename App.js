import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Outside/Login';
import Home from './Home';
import Cadastrar from './Outside/cadastrar';
import Ganhos from './Inside/Ganhos';
import Gasto from './Inside/Gasto';
import Perfil from './Inside/Perfil';

export default function App() {

  // Criando um stack navigator usando o createStackNavigator da biblioteca @react-navigation/stack
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      {/* O componente NavigationContainer é um contêiner que gerencia o estado de navegação do aplicativo */}
      <Stack.Navigator>
        {/* Stack.Navigator é usado para definir a pilha de telas no aplicativo */}
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        {/* Stack.Screen representa uma tela na pilha de navegação */}
        {/* A propriedade name especifica o nome da tela */}
        {/* A propriedade component especifica o componente a ser renderizado para essa tela */}
        {/* A propriedade options permite configurar várias opções de tela */}
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Cadastrar" component={Cadastrar} options={{ headerShown: false }}/>
        <Stack.Screen name="Ganhos" component={Ganhos} options={{ headerShown: false }}/>
        <Stack.Screen name="Gastos" component={Gasto} options={{ headerShown: false }}/>
        <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
