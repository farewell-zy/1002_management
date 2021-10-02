import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'
import { resetRouter,allAsyncRoutes,constantRoutes,anyRoute } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'


const getDefaultState = () => {
  return {
    token: getToken(), // 用户登陆成功的token
    name: '', // 获取用户信息保存用户信息名称
    avatar: '', // 获取用户信息保存用户信息头像

    buttons:[], // 按钮权限
    roles:[], // 角色
    routes:[], // 最终所有路由
    asyncRoutes:[], // 异步路由
  }
}

function filterAsyncRoutes(allAsyncRoutes, routeNames){
  let asyncRoutes =  allAsyncRoutes.filter(item => {
    if(routeNames.indexOf(item.name) !== -1){
      if(item.children && item.children.length){
        item.children = filterAsyncRoutes(item.children,routeNames)
      }
      return true
    }
  })
  return asyncRoutes
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    // Object.assign合并后面的对象的属性 到 前面的对象中
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_USERINFO(state,userInfo){
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },

  SET_ROUTES(state,asyncRoutes){
    state.asyncRoutes = asyncRoutes
    state.routes = constantRoutes.concat(asyncRoutes,anyRoute)

    router.addRoutes([...asyncRoutes,anyRoute])
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token) // 原来咱们是把获取到的token保存到localStorage,而这里他是保存再cookies
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // async login({ commit }, userInfo) {
  //   const result = await login(userInfo)
  //   if (result.code === 20000) {
  //     commit('SET_TOKEN', result.data.token)
  //     setToken(result.data.token)
  //     return 'ok'
  //   } else {
  //     return Promise.reject(new Error('failed'))
  //   }
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        commit('SET_USERINFO', data)
        commit('SET_ROUTES',filterAsyncRoutes(cloneDeep(allAsyncRoutes), data.routes)) // 需要深拷贝，防止对象丢失
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 把cookies内部的token删除掉
        resetRouter() // 退出之后重置路由器
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

