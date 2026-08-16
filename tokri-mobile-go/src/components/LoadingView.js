import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { COLORS } from '../config'

export default function LoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.brand} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.canvas,
  },
})
