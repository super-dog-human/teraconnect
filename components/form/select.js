/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const Select = React.forwardRef(({ options, topLabel, value, color='inherit', backgroundColor='inherit', disabled=false, onChange }, ref) => {
  const bodyStyle = css({
    width: '100%',
    height: '100%',
    lineHeight: '100%',
    padding: '0px',
    margin: '0px',
    border: 'none',
    borderBottom: '1px solid var(--text-gray)',
    color,
    backgroundColor,
    ':active': {
      outline: 'none',
    },
    ':focus': {
      outline: '2px dotted gray',
    },
  })

  return (
    <select ref={ref} css={bodyStyle} value={value} disabled={disabled} onChange={onChange}>
      {topLabel && (
        <option label={ topLabel }></option>
      )}

      {Array.isArray(options) && options.map((opt, i) => (
        <option value={ opt.value } key={ i } label={ opt.label } />
      ))}

      {!Array.isArray(options) && Object.keys(options).map((key, i) => (
        <optgroup label={ key } key={ i }>
          {options[key].map((opt, i) => (
            <option value={ opt.value } key={ i } label={ opt.label } />
          ))}
        </optgroup>
      ))}
    </select>
  )})

Select.defaultProps = {
  options: [],
  topLabel: ' ',
}

export default Select