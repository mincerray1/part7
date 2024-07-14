import Notification from './Notification'
import { useSetNotification } from '../context/NotificationContext'
import { useLogin } from '../context/AuthContext'
import { Typography, Button } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Container } from '@mui/material'

const LoginForm = () => {
  const setNotification = useSetNotification()
  const login = useLogin()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login(event.target.username.value, event.target.password.value)
    } catch (exception) {
      setNotification(exception.response.data.error, 'error', 2)
    }
  }

  return (
    <Container>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleLogin}
      >
        <Typography variant="h6" color="primary">Login to the application</Typography>
        <TextField id="username" label="Username" name="username" variant="standard" size="small" />
        <br />
        <TextField id="password" label="Password" name="password" variant="standard" size="small" type="password" />
        <br />
        <Button variant="contained" type="submit" size="small">Login</Button>
      </Box>
      <Notification />
    </Container>
  )
}

export default LoginForm