import 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthStack } from './src/navigation/AuthStack';
import { AppTabs } from './src/navigation/AppTabs';
import { colors } from './src/theme/colors';

const RootStack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.brand
  }
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        <RootStack.Screen name="Auth" component={AuthStack} />
        <RootStack.Screen name="App" component={AppTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
