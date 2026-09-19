import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Keyboard, Platform } from 'react-native'

export function useKeyboardHeight() {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (event) => {
      setHeight(event.endCoordinates?.height || 0)
    })
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      setHeight(0)
    })
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return height
}

export function useScrollFocusedInput(scrollRef) {
  const keyboardHeight = useKeyboardHeight()
  const keyboardHeightRef = useRef(0)
  const scrollY = useRef(0)

  useEffect(() => {
    keyboardHeightRef.current = keyboardHeight
  }, [keyboardHeight])

  const onScroll = useCallback((event) => {
    scrollY.current = event.nativeEvent.contentOffset.y
  }, [])

  const ensureVisible = useCallback(
    (fieldRef) => {
      const delay = keyboardHeightRef.current > 0 ? 40 : Platform.OS === 'ios' ? 80 : 300
      setTimeout(() => {
        fieldRef?.current?.measureInWindow((_x, y, _width, height) => {
          const windowHeight = Dimensions.get('window').height
          const keyboard = keyboardHeightRef.current
          const keyboardTop = keyboard > 0 ? windowHeight - keyboard : windowHeight
          const margin = 96
          const fieldBottom = y + height
          if (fieldBottom > keyboardTop - margin) {
            scrollRef.current?.scrollTo({
              y: scrollY.current + (fieldBottom - keyboardTop + margin),
              animated: true,
            })
            return
          }
          if (y < 96) {
            scrollRef.current?.scrollTo({
              y: Math.max(0, scrollY.current - (96 - y)),
              animated: true,
            })
          }
        })
      }, delay)
    },
    [scrollRef],
  )

  return { keyboardHeight, onScroll, ensureVisible }
}
