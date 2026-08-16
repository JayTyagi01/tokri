import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../config'

export const SEARCH_HINTS = [
  'mango',
  'apple',
  'dragon fruit',
  'avocado',
  'blueberry',
  'coconut',
  'kiwi',
  'banana',
  'strawberry',
  'papaya',
  'grapes',
  'watermelon',
]

const LINE_HEIGHT = 20
const HOLD_MS = 2200
const SLIDE_MS = 380

export default function SearchPlaceholderSlider({ visible }) {
  const [index, setIndex] = useState(0)
  const translateY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!visible) {
      translateY.setValue(0)
      return undefined
    }

    const tick = () => {
      Animated.timing(translateY, {
        toValue: -LINE_HEIGHT,
        duration: SLIDE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return
        setIndex((current) => (current + 1) % SEARCH_HINTS.length)
        translateY.setValue(0)
      })
    }

    const timer = setInterval(tick, HOLD_MS)
    return () => {
      clearInterval(timer)
      translateY.stopAnimation()
    }
  }, [visible, translateY])

  if (!visible) return null

  const current = SEARCH_HINTS[index]
  const next = SEARCH_HINTS[(index + 1) % SEARCH_HINTS.length]

  return (
    <View pointerEvents="none" style={styles.clip}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Text style={styles.line} numberOfLines={1}>
          Search “{current}”
        </Text>
        <Text style={styles.line} numberOfLines={1}>
          Search “{next}”
        </Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  clip: {
    position: 'absolute',
    left: 40,
    right: 42,
    height: LINE_HEIGHT,
    top: 13,
    overflow: 'hidden',
  },
  line: {
    height: LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
    color: COLORS.muted,
    fontSize: 14,
  },
})
