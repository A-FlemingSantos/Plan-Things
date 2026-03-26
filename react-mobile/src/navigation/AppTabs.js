import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { PlanosScreen } from '../screens/PlanosScreen';
import { BoardScreen } from '../screens/BoardScreen';
import { ListaScreen } from '../screens/ListaScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-variant-outline',
            Planos: 'view-dashboard-outline',
            Board: 'view-kanban-outline',
            Lista: 'format-list-bulleted',
            Perfil: 'account-circle-outline'
          };
          return <MaterialCommunityIcons name={icons[route.name]} color={color} size={size} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Planos" component={PlanosScreen} />
      <Tab.Screen name="Board" component={BoardScreen} />
      <Tab.Screen name="Lista" component={ListaScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
