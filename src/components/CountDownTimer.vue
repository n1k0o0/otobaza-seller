<template>
  <span>
    <slot :time="formattedTimeLeft">{{ formattedTimeLeft }}</slot>
  </span>
</template>
<script>
export default {
  name: 'CountDownTimer',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    timeLimit: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      timePassed: 0,
      timerInterval: null
    }
  },

  computed: {
    formattedTimeLeft() {
      const timeLeft = this.timeLeft
      const minutes = Math.floor(timeLeft / 60)
      let seconds = timeLeft % 60

      if (seconds < 10) {
        seconds = `0${seconds}`
      }
      return `${minutes}:${seconds}`
    },
    timeLeft() {
      return this.timeLimit - this.timePassed
    }
  },

  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp()
      }
    }
  },

  mounted() {
    this.startTimer()
  },
  beforeDestroy() {
    this.timePassed = 0
    this.timerInterval = null
  },

  methods: {
    onTimesUp() {
      clearInterval(this.timerInterval)
      this.$emit('update:show', false)
      this.$emit('ended')
    },

    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000)
    }
  }
}
</script>
