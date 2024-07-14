import { createContext, useReducer, useContext, useEffect } from 'react'

// {message, notification_type}
const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SET_NOTIF':
    return action.payload
  case 'CLEAR_NOTIF':
    return { message: null, notificationType: 'success' }
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  //{ message: null, notificationType: 'success' })
  const [notification, dispatch] = useReducer(notificationReducer, { message: null, notificationType: 'success' })

  useEffect(() => {
    dispatch({ type: 'CLEAR_NOTIF' })
  }, [])


  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const { notification } = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const { dispatch } = useContext(NotificationContext)
  return dispatch
}

export const useSetNotification = () => {
  const dispatch = useNotificationDispatch()
  const useNotify = (message, notificationType, seconds) => {
    dispatch({ type: 'SET_NOTIF', payload: { message, notificationType } })
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIF' }), (seconds * 1000))
  }

  return useNotify
}

export default NotificationContext