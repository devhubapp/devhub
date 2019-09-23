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
      'powershell',
    ])
    if (!command) throw new Error('No executable found to play sounde.')

    // TODO: Fix delay on windows, it's taking a couple seconds to play
    const args =
      command === 'powershell'
        ? ['-c', `(New-Object System.Media.SoundPlayer '${file}').PlaySync();`]
        : [file]
    const process = spawn(command, args, { stdio: 'ignore' })
    if (!process) throw new Error('Unable to spawn process .')

    return true
  } catch (error) {
    console.error('Failed to play sound', error)
    return false
  }
}
