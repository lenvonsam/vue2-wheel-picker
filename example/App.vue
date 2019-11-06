<template>
  <div id="app">
    <div class="demo-header row align-center">
      <div class="col">Wheel Picker Demo</div>
    </div>
    <div class="demo-body">
      <div class="demo-item" @click="demoClick('single')">
        <div class="col">单列选择</div>
        <div class="col right">{{singleValue === '戳我' ? singleValue : singleValue[0]}}</div>
      </div>
      <div class="demo-item" @click="demoClick('muli')">
        <div class="col">多列选择</div>
        <div class="col right">{{muliValue}}</div>
      </div>
      <div class="demo-item" @click="demoClick('muliObj')">
        <div class="col">多列(含对象)选择</div>
        <div class="col right">{{muliObjValue}}</div>
      </div>
      <div class="demo-item" @click="demoClick('date')">
        <div class="col">时间选择</div>
        <div class="col right">{{dateValue}}</div>
      </div>
      <div class="demo-item" @click="demoClick('singleRed')">
        <div class="col">选择按钮换成红色</div>
        <div class="col right">{{singleRedValue === '戳我' ? singleRedValue : singleRedValue[0]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      // 单列选择
      singleList: ['1', '2', '3', '4', '5'],
      singleValue: '戳我',
      // 多列选择
      muliList: [['1', '2', '3', '4', '5'], ['3', '2', '1']],
      muliValue: '戳我',
      // 多列对象
      muliObjList: [[{'fruit': 'orange'}, {'fruit': 'banana'}], [{'animal': 'dog'}, {'animal': 'cat'}]],
      muliObjValue: '戳我',
      // 日期对象
      dateValue: '2019-11-05',
      // 红色单选
      singleRedValue: '戳我'
    }
  },
  methods: {
    demoClick (type) {
      const me = this
      let mode = 'date'
      let configBody = {
        mode: mode,
        cb (value) {
          console.log('value', value)
          me[type + 'Value'] = value
        }
      }
      if (type !== 'date') {
        configBody.mode = 'picker'
        configBody.listData = type === 'singleRed' ? this.singleList : this[type + 'List']
        configBody.listValue = this[type + 'Value']
        if (type === 'muli' || type === 'muliObj') {
          configBody.colLen = this.muliList.length
        }
        if (type === 'muliObj') {
          configBody.rowKeys = ['fruit', 'animal']
        }
        if (type === 'singleRed') {
          configBody.confirmColor = 'red'
        }
      } else {
        configBody.dateValue = this.dateValue
      }
      this.$wheelPicker.show(configBody)
    }
  }
}
</script>

<style>
@import url('./plugins/css/common.css');
#app {
  max-width: 600px;
  margin: 0 auto;
  height: 100vh;
  background: #efefef;
}
body {
  box-sizing: border-box;
  margin: 0px !important;
  padding: 0px !important;
}
.demo-header {
  height: 50px;
  background: #3db0fc;
  box-sizing: border-box;
  padding-left: 15px;
  color: white;
}
.demo-body {
  background: #fff;
}
.demo-item {
  font-size: 14px;
  display: flex;
  padding-left: 15px;
  padding-right: 15px;
  height: 46px;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.demo-item:active {
  background: #ccc;
}

.demo-item .col {
  flex: 1;
}
.demo-item .col.right {
  text-align: right;
  font-size: 13px;
  color: #888;
}
.demo-item:last-child {
  border-bottom: 0px;
}
</style>
