import { useNotificationValue } from '../context/NotificationContext'
import Alert from '@mui/material/Alert'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification || notification.message === null) {
    return null
  }

  return (
    <div>
      <Alert severity={notification.notificationType}>{notification.message}</Alert>
    </div>
  )
}

export default Notification
