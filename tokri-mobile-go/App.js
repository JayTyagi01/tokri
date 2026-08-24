import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './src/context/AuthContext'
import { CartProvider } from './src/context/CartContext'
import { AddressProvider } from './src/context/AddressContext'
import { ThemeProvider, useTheme } from './src/context/ThemeContext'
import RootNavigator from './src/navigation/RootNavigator'

function ThemedStatusBar() {
  const { isDark } = useTheme()
  return <StatusBar style={isDark ? 'light' : 'dark'} />
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AddressProvider>
              <ThemedStatusBar />
              <RootNavigator />
            </AddressProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
