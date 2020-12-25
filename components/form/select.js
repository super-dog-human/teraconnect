/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/core'

const style = css({
  width: '100%',
  height: '100%',
  lineHeight: '100%',
  padding: '0px',
  margin: '0px',
  border: '1px solid var(--border-gray)'
})

const Select = React.forwardRef((props, ref) => {
  const selectProps = Object.assign({}, props)
  Object.keys(Select.defaultProps).forEach((key) => {
    delete selectProps[key]
  })

  return (
    <select ref={ ref } css={ style } { ...selectProps }>
      { props.toplabel && (
        <option label={ props.toplabel }></option>
      ) }

      { Array.isArray(props.options) && props.options.map((opt, i) => (
        <option value={ opt.value } key={ i } label={ opt.label } />
      )) }

      { !Array.isArray(props.options) && Object.keys(props.options).map((key, i) => (
        <optgroup label={ key } key={ i }>
          { props.options[key].map((opt, i) => (
            <option value={ opt.value } key={ i } label={ opt.label } />
          )) }
        </optgroup>
      )) }
    </select>
  )} )

Select.defaultProps = {
  options: [],
  toplabel: ' ',
}

export default Select