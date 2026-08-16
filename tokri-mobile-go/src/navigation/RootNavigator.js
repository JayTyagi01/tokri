import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../config'
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
import AddressPicker from '../components/AddressPicker'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.canvas,
    card: COLORS.panel,
    text: COLORS.text,
    border: COLORS.line,
    primary: COLORS.brand,
  },
}

function TabIcon({ name, focused, badge }) {
  return (
    <View>
      <Icon name={focused ? name : `${name}-outline`} size={22} color={focused ? COLORS.brand : COLORS.muted} />
      {badge ? <View style={styles.dot} /> : null}
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
    backgroundColor: COLORS.brand,
  },
}

function Tabs() {
  const { totalCount } = useCart()
  const insets = useSafeAreaInsets()
  const bottomInset = Math.max(insets.bottom, 8)

  const tabBarStyle = {
    backgroundColor: COLORS.panel,
    borderTopColor: COLORS.line,
    height: 52 + bottomInset,
    paddingTop: 6,
    paddingBottom: bottomInset,
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        safeAreaInsets: { bottom: 0 },
        tabBarStyle,
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.muted,
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
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.panel },
          headerTintColor: COLORS.text,
          headerShadowVisible: false,
          headerTitle: '',
          headerBackTitleVisible: false,
          contentStyle: { backgroundColor: COLORS.canvas },
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
