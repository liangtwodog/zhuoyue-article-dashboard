import Vue from 'vue'
import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const is_admin = store.getters && store.getters.is_admin
  if (is_admin) return true
  const permissions = store.getters && store.getters.permissions
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionList = value

      const hasPermission = permissions.some(role => {
        return permissionList.includes(role)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need permissions! Like v-permission="['admin','editor']"`)
  }
}

Vue.directive('permission', {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
})

export default Vue.directive('permission')
