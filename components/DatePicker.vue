<template>
<p-container @hide="containerHide" v-model="dateShow">
  <btn-group @click="containerHide"></btn-group>
  <div class="row" v-if="dateShow">
    <div class="col" v-for="(localItem, idx) in localList" :key="idx">
      <w-item :listData="localItem" v-model="localValue[idx]" :ref="'pi' + idx" dataType="number"></w-item>
    </div>
  </div>
</p-container>
</template>

<script>
import pContainer from './Container.vue'
import wItem from './WheelItem.vue'
import btnGroup from './Toolbar.vue'
export default {
  props: {
    value: {
      type: null,
      default: false
    },
    dateValue: {
      type: null,
      default: false
    },
    separator: {
      type: String,
      default: '-'
    },
    yearCount: {
      type: Number,
      default: 15
    },
    // 按钮配置
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmColor: {
      type: String,
      default: '#3db0fc'
    },
    cancelColor: {
      type: String,
      default: '#888'
    },
    bottomColor: {
      type: String,
      default: '#ddd'
    }
  },
  components: {
    pContainer,
    wItem,
    btnGroup
  },
  data () {
    return {
      localList: [],
      localValue: [],
      pickerYearVal: '',
      pickerMonthVal: '',
      dateShow: false,
      currentDate: new Date(),
      monthArr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    }
  },
  beforeMount () {
    this.initDate()
    this.$nextTick(function () {
      if (this.value) this.dateShow = this.value
    })
  },
  watch: {
    localValue: {
      handler (newVal) {
        this.pickerYearVal = newVal[0]
        this.pickerMonthVal = newVal[1]
      },
      deep: true
    },
    pickerYearVal (newVal) {
      if (this.pickerMonthVal === '02') {
        this.localList[2] = this.getDayArray(newVal, this.pickerMonthVal)
      }
    },
    pickerMonthVal (newVal) {
      this.localList[2] = this.getDayArray(this.pickerYearVal, newVal)
      // if (this.$refs.pi2) this.$refs.pi2[0].autoUpdate('01')
    },
    value (newVal) {
      this.dateShow = newVal
    },
    dateValue (newVal) {
      this.localValue = newVal.split(this.separator)
    }
  },
  methods: {
    containerHide (type) {
      this.dateShow = false
      this.$emit('input', this.dateShow)
      if (type && type === 'confirm') this.$emit('change', this.localValue.join(this.separator))
    },
    initDate () {
        // calc year of date arrays
        this.yearArr = this.getYearArray()
        this.pickerYearVal = `${this.currentDate.getFullYear()}`

        // calc month of date
        const monthVal = `${this.currentDate.getMonth() + 1}`

        // calc day of date
        let dayVal = `${this.currentDate.getDate()}`
        if (Number(dayVal) < 10) dayVal = `0${dayVal}`
        this.dayArr = this.getDayArray(this.currentYear, monthVal)
        this.localList = [this.yearArr, this.monthArr, this.getDayArray(this.pickerYearVal, '01')]
        if (this.dateValue) {
          this.localValue = this.dateValue.split(this.separator)
          this.pickerYearVal = this.localValue[0]
          this.pickerMonthVal = this.localValue[1]
        } else {
          this.localValue = [this.pickerYearVal, monthVal, dayVal]
        }
    },
    getDayArray (year, month) {
      if (month === '02') {
        if (this.isLeapYear(year)) {
          return this.autoGeneratorDateStrArray(29)
        }
        else {
          return this.autoGeneratorDateStrArray(28)
        }
      }
      else if (['01', '03', '05', '07', '08', '10', '12'].includes(month)) {
        return this.autoGeneratorDateStrArray(31)
      }
      else {
        return this.autoGeneratorDateStrArray(30)
      }
    },
    isLeapYear (y) {
      if (y % 4 === 0 && y % 100 > 0) {
        return true
      }
      else if (y % 400 === 0) {
        return true
      }
      else {
        return false
      }
    },
    getYearArray () {
      const startYear = this.currentDate.getFullYear() - this.yearCount
      return this.autoGeneratorArray(this.yearCount * 2, startYear)
    },
    autoGeneratorDateStrArray (length) {
      return Array.from({length: length}, (v, i) => {
        let d = i + 1
        if (d < 10) {
          return `0${d}`
        }
        else {
          return `${d}`
        }
      })
    },
    autoGeneratorArray (length, start = 0) {
      if (start === 0) {
        return Array.from({length: length}, (v, i) => (i + 1).toString())
      }
      else {
        return Array.from({length: length}, (v, i) => (start + i).toString())
      }
    },
    confirmFunc () {
      this.choosedVal = `${this.pickerValYear}-${this.pickerValMonth}-${this.pickerValDay}`
      this.valFunc(this.choosedVal)
    },
    handler (type) {
      // change feb month days index
      if (type === 'month') {
        this.pickerValDay = '01'
        if (this.pickerValMonth === '02') {
          if (this.isLeapYear(this.pickerValYear)) {
            if (this.dayArr.length !== 29) {
              this.dayArr = this.autoGeneratorDateStrArray(29)
            }
          }
          else {
            let dayPickVal = Number(this.pickerValDay)
            if (this.dayArr.length !== 28) {
              if (dayPickVal > 28) {
                this.pickerValDay = `${28}`
              }
              this.dayArr = this.autoGeneratorDateStrArray(28)
            }
          }
        }
        else {
          this.dayArr = this.getDayArray(this.currentDay, this.pickerValMonth)
        }
      }
    }
  }
}
</script>

