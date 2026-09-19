import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useMemo } from 'react'
import { View } from 'react-native'
import Icon from '../components/Icon'
import HomeScreen from '../screens/HomeScreen'
import ShopScreen from '../screens/ShopScreen'
import CartScreen from '../screens/CartScreen'
import ReorderScreen from '../screens/ReorderScreen'
import AccountScreen from '../screens/AccountScreen'
import ProductScreen from '../screens/ProductScreen'
import LoginScreen from '../screens/LoginScreen'
import OtpScreen from '../screens/OtpScreen'
import CheckoutScreen from '../screens/CheckoutScreen'
import SearchScreen from '../screens/SearchScreen'
import OrdersScreen from '../screens/OrdersScreen'
import OrderDetailScreen from '../screens/OrderDetailScreen'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import AddressPicker from '../components/AddressPicker'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function TabIcon({ name, focused, badge }) {
  const { colors } = useTheme()
  return (
    <View>
      <Icon name={focused ? name : `${name}-outline`} size={22} color={focused ? colors.brand : colors.muted} />
      {badge ? <View style={[styles.dot, { backgroundColor: colors.brand }]} /> : null}
    </View>
  )
}

const styles = {
  dot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}

function Tabs() {
  const { totalCount } = useCart()
  const { colors } = useTheme()

  const tabBarStyle = {
    backgroundColor: colors.panel,
    borderTopColor: colors.line,
    height: 58,
    paddingTop: 6,
    paddingBottom: 6,
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        safeAreaInsets: { bottom: 0 },
        tabBarStyle,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Reorder"
        component={ReorderScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="reload" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={ShopScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="grid" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: totalCount ? `Cart (${totalCount})` : 'Cart',
          tabBarIcon: ({ focused }) => <TabIcon name="cart" focused={focused} badge={totalCount > 0} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function RootNavigator() {
  const { colors, isDark } = useTheme()
  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: isDark,
      colors: {
        ...DefaultTheme.colors,
        background: colors.canvas,
        card: colors.panel,
        text: colors.text,
        border: colors.line,
        primary: colors.brand,
      },
    }),
    [colors, isDark],
  )

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.panel },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerTitle: '',
          headerBackTitleVisible: false,
          contentStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Otp" component={OtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <AddressPicker />
    </NavigationContainer>
  )
}
