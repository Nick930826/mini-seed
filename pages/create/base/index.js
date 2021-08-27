import { upload } from '../../../utils/index'

Page({
  data: {
    isRecording: false,
    duration: 1, // 音频总长度，ms
    progress: 0 // 当前播放进度，ms
  },
  onLoad: function (options) {
    this.setData({
      rm: wx.getRecorderManager(),
      audioCtx: wx.createInnerAudioContext()
    })
  },
  onUnload: function () {
    const { audioCtx } = this.data
    audioCtx.destroy()
  },
  handleStart () {
    const { rm, audioCtx } = this.data
    rm.onStart(() => {
      this.setData({ isRecording: true })
    })
    rm.onStop(({ tempFilePath, duration }) => {
      this.setData({ isRecording: false })
      if (duration <= 1000) {
        return wx.showToast({ title: '说话时间太短', icon: 'error' })
      }
      this.setData({
        duration: Math.round(duration),
        progress: 0
      })

      audioCtx.src = tempFilePath
      audioCtx.play()
      // upload({ filePath: tempFilePath }, { showLoading: true })
      //   .then(({ data }) => {
      //     console.log(data.url)
      //   })
    })
    audioCtx.onTimeUpdate(() => {
      this.setData({
        progress: Math.round(audioCtx.currentTime * 1000)
      })
    })
    audioCtx.onEnded(() => {
      this.setData({
        progress: this.data.duration
      })
    })

    rm.start({
      duration: 1000 * 60,
      sampleRate: 48000,
      encodeBitRate: 320000,
      format: 'mp3'
    })
  },
  handleStop () {
    const { rm } = this.data
    rm.stop()
  },
  handleSeek ({ detail }) {
    const { audioCtx } = this.data
    audioCtx.seek(detail.value / 1000)
  }
})
