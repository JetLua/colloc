export default {
  id: null,
  user: null,
  diamond: 0,

  get unlocked() {
    const v = +localStorage.getItem('unlocked')
    return v || 1
  },

  set unlocked(v) {
    return localStorage.setItem('unlocked', v)
  },

  setting: {
    get voice() {
      const v = localStorage.getItem('setting:voice')
      return v === false ? false : true
    },

    set voice(v) {
      return localStorage.setItem('setting:voice', v)
    },

    get music() {
      const v = localStorage.getItem('setting:music')
      return v === false ? false : true
    },

    set music(v) {
      return localStorage.setItem('setting:music', v)
    }
  }
}