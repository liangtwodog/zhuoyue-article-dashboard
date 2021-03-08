import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  const is_admin = store.getters && store.getters.is_admin
  if (is_admin) return true
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    const permissionList = value

    const hasPermission = permissions.some(role => {
      return permissionList.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need permissions! Like v-permission="['admin','editor']"`)
    return false
  }
}
