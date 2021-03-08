const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  is_admin: state => state.user.is_admin,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes
}
export default getters
