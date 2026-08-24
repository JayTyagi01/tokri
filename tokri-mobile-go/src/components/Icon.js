import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

export default function Icon({ name, size = 22, color, style }) {
  const { colors } = useTheme()
  return <Ionicons name={name} size={size} color={color || colors.mint} style={style} />
}
