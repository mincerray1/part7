import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, notificationType: 'success' },
  reducers: {
    notificationChange(state, action) {
      return {
        message: action.payload.message,
        notificationType: action.payload.notificationType,
      }
    },
    clearNotification(state, action) {
      return { message: null, notificationType: 'success' }
    },
  },
})

export const setNotification = (message, notificationType, seconds) => {
  console.log('setNotification')
  return async (dispatch) => {
    dispatch(notificationChange({ message, notificationType }))
    setTimeout(() => dispatch(clearNotification()), 1000 * seconds)
  }
}

export const { notificationChange, clearNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
