import wpicker from './components/index.vue'
import dpicker from './components/DatePicker.vue'

const pickerObj = {
  __installed: false,
  __Vue: null,
  vm: null,
  __config: null,
  install (Vue) {
    if (this.__installed) return
    this.__installed = true
    this.__Vue = Vue
    Vue.prototype.$wheelPicker = pickerObj
    Vue.component('wheel-picker', wpicker)
    Vue.component('wheel-datepicker', dpicker)
  },
  show (config) {
    if (this.vm) {
      this.vm.$el.remove()
      this.vm = null
    }
    pickerObj.__config = config || {}
    let propBody = {}
    const type = pickerObj.__config.mode || 'picker'
    const compt = type === 'picker' ? wpicker : dpicker
    Object.keys(pickerObj.__config).map(itm => {
      propBody[itm] = pickerObj.__config[itm]
    })
    propBody.value = true
    const node = document.createElement('div')
    document.body.appendChild(node)
    this.vm = new this.__Vue({
      name: 'wheel-picker',
      el: node,
      components: {
        'picker': compt
      },
      render (h) {
        return h('picker', {
          props: propBody,
          on: {
            change: config.cb || pickerObj.cb
          }
        })
      }
    })
  },
  cb (type) {
    console.log('cb type:>>' + type)
  }
}

export default pickerObj