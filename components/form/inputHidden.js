import React from 'react'

const InputHidden = React.forwardRef(function inputHidden(props, ref) {
  return (
    <input type="hidden" ref={ref} {...props} />
  )
})

export default InputHidden