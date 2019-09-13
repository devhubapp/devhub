// Modified version of: https://github.com/shime/play-sound/blob/master/index.js

import { spawn } from 'child_process'

import { findExec } from '../find-exec'

export function playAudioFile(file: string) {
  try {
    const command = findExec([
      'mplayer',
      'afplay',
      'mpg123',
      'mpg321',
      'play',
      'omxplayer',
      'aplay',
      'cmdmp3',
    ])
    if (!command) throw new Error('No executable found to play sounde.')

    const process = spawn(command, [file], { stdio: 'ignore' })
    if (!process) throw new Error('Unable to spawn process .')

    return true
  } catch (error) {
    console.error('Failed to play sound', error)
    return false
  }
}
