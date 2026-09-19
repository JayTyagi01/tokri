import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { AuthProvider } from './src/context/AuthContext'
import { CartProvider } from './src/context/CartContext'
import { AddressProvider } from './src/context/AddressContext'
import { ThemeProvider, useTheme } from './src/context/ThemeContext'
import { useSystemBottomInset } from './src/lib/safeArea'
import RootNavigator from './src/navigation/RootNavigator'

function AppShell() {
  const { colors, isDark } = useTheme()
  const bottomInset = useSystemBottomInset()

  return (
    <View style={{ flex: 1, backgroundColor: colors.panel, paddingBottom: bottomInset }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AddressProvider>
              <AppShell />
            </AddressProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
