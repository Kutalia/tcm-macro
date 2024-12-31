import nut from "@nut-tree-fork/nut-js"
import { GlobalKeyboardListener } from "node-global-key-listener"
import Audic from "audic"

const v = new GlobalKeyboardListener()

const getCapsLockListener = (extraKey, callback) => (e, down) => {
  if (
    e.name == extraKey &&
    down["CAPS LOCK"]
  ) {
    callback()
  }
}

const getListener = (key) => {
  const listener = getCapsLockListener(key, () => {
    let onSound = null
    let offSound = null
    try {
      onSound = new Audic('./on.mp3')
      offSound = new Audic('./off.mp3')
    } catch (err) {

    }

    v.removeListener(listener)
    try {
      onSound?.play()
    } catch (err) {

    }

    const loop = () => {
      nut.keyboard.type(nut.Key[key])
    }

    const interval = setInterval(loop, 80)

    const stopperListener = getCapsLockListener(key, () => {
      try {
        offSound?.play()
      } catch (err) {

      }
      clearInterval(interval)
      v.removeListener(stopperListener)

      // So it doesn't accidentally fire again before the previous keystrokes are over
      setTimeout(() => {
        v.addListener(listener)
      }, 500)

      setTimeout(() => {
        try {
          onSound?.destroy()
          offSound?.destroy()
        } catch (err) {

        }
      }, 3000)
    })

    setTimeout(() => {
      v.addListener(stopperListener)
    }, 1000)
  })

  return listener
}

v.addListener(getListener('F'))
v.addListener(getListener('E'))
