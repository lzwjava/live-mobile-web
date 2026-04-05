<template>
  <div>
    <input type="text" class="v-date-picker-result" @click="onInputFocus" v-model="dateResult" readonly />
    <div class="v-date-picker-input" v-show="showPicker">
      <input type="date" :min="minDate" :max="maxDate" v-model="datePicked" />
      <span>{{ timePicked }}</span>
      <br />
      <span class="key">小时</span>
      <input type="range" :max="maxHour" :min="minHour" step="1" v-model.number="hourPicked" />
      <br />
      <span class="key">分钟</span>
      <input type="range" :max="maxMinute" :min="minMinute" step="1" v-model.number="minutePicked" />
      <br />
      <div class="divider"></div>
      <button v-if="allowNow" @click="setNow">当前时间</button>
      <button @click="setDate(date)">完成</button>
      <div class="divider"></div>
      <button class="close-btn" @click="hidePicker">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  allowNow: {
    type: Boolean,
    default: true
  },
  maxDate: {
    type: String,
    default: ''
  },
  minDate: {
    type: String,
    default: '1970-01-01'
  },
  maxHour: {
    type: Number,
    default: 23
  },
  minHour: {
    type: Number,
    default: 0
  },
  maxMinute: {
    type: Number,
    default: 59
  },
  minMinute: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const datePicked = ref('')
const hourPicked = ref(0)
const minutePicked = ref(0)
const secondPicked = ref(0)

const dateResult = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const addZero = (val) => {
  val = Number(val)
  if (val < 10) return '0' + val
  return val
}

const timePicked = computed(() => {
  return addZero(hourPicked.value) + ':' + addZero(minutePicked.value) + ':' + addZero(secondPicked.value)
})

const date = computed(() => datePicked.value + ' ' + timePicked.value)

const onInputFocus = () => {
  showPicker.value = !showPicker.value
}

const hidePicker = () => {
  showPicker.value = false
}

const setNow = () => {
  const now = new Date()
  datePicked.value = now.getFullYear() + '-' + addZero(now.getMonth() + 1) + '-' + addZero(now.getDate())
  hourPicked.value = now.getHours()
  minutePicked.value = now.getMinutes()
  secondPicked.value = 0
}

const setDate = (d) => {
  if (d === ' 00:00:00') {
    return false
  }
  dateResult.value = d
  hidePicker()
}

onMounted(() => {
  if (!props.modelValue) {
    setNow()
  }
})
</script>

<style lang="stylus">


.v-date-picker-result
  text-align center

.v-date-picker-input
  position absolute
  padding 5px
  text-align center
  background-color #F5F5F5
  width 220px
  z-index 1
  .divider
    border-top 1px solid rgba(34,36,38,.15)
    border-bottom 1px solid rgba(255,255,255,.1)
    margin 10px 0
  .key
    color #FFFFFF
    background-color #807F7F
    display inline-block
    width 60px
    text-align center
  .close-btn
    width 100%
  button
    background-color #9B9B9B
    border-radius 3px
    color #fff
    &:hover
      background-color #505050


</style>
