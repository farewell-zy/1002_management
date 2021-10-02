import store from '@/store'

export function hasBtnPrmission(btnName){
  let buttons = store.getters.buttons
  return buttons.indexOf(btnName) !== -1
} 