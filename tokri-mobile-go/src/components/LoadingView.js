import { ActivityIndicator, View } from 'react-native'
import { useTheme, useThemedStyles } from '../context/ThemeContext'

export default function LoadingView() {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brand} />
    </View>
  )
}

const createStyles = (c) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.canvas,
  },
})
