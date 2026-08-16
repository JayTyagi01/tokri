import { Platform } from 'react-native'
import * as IntentLauncher from 'expo-intent-launcher'

export async function listenForSearch() {
  if (Platform.OS !== 'android') {
    throw new Error('Voice search is available on Android. Please type to search.')
  }

  const result = await IntentLauncher.startActivityAsync('android.speech.action.RECOGNIZE_SPEECH', {
    extra: {
      'android.speech.extra.LANGUAGE_MODEL': 'free_form',
      'android.speech.extra.PROMPT': 'Search fruits on Tokriii',
      'android.speech.extra.LANGUAGE': 'en-IN',
    },
  })

  const extra = result?.extra || {}
  const spoken =
    extra['android.speech.extra.RESULTS']?.[0] ||
    extra.androidSpeechExtraRESULTS?.[0] ||
    extra.results?.[0] ||
    extra.query ||
    extra.QUERY

  if (!spoken) {
    throw new Error('Could not hear that. Please try again.')
  }

  return String(spoken)
}
