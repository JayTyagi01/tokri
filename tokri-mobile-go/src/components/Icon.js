import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../config'

export default function Icon({ name, size = 22, color = COLORS.mint, style }) {
  return <Ionicons name={name} size={size} color={color} style={style} />
}
