import { useState, forwardRef, useImperativeHandle } from 'react'
import Fab from '@mui/material/Fab'
import { Button } from '@mui/material'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility} size="small" variant="contained">{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility} size="small" variant="outlined" color="warning">{props.cancelLabel}</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
