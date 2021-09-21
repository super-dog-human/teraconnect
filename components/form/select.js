/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const Select = React.forwardRef((props, ref) => {
  const { options, topLabel, topValue, size, color, backgroundColor, ...selectProps } = props
  const bodyStyle = css({
    appearance: 'none',
    width: '100%',
    height: '100%',
    lineHeight: '100%',
    padding: '0px',
    margin: '0px',
    fontSize: size && `${size}px`,
    border: 'none',
    borderRadius: '0px',
    borderBottom: '1px solid var(--text-gray)',
    color,
    backgroundColor: backgroundColor || 'inherit',
    ':active': {
      outline: 'none',
    },
    ':focus': {
      outline: '2px dotted gray',
    },
  })

  return (
    <select ref={ref} css={bodyStyle} {...selectProps}>
      {topLabel && (
        <option label={topLabel} value={topValue}>
          {topLabel}
        </option>
      )}

      {Array.isArray(options) && options.map((opt, i) => (
        <option value={opt.value} key={i} label={opt.label}>
          {opt.label}
        </option>
      ))}

      {!Array.isArray(options) && Object.keys(options).map((key, i) => (
        <optgroup label={ key } key={ i }>
          {options[key].map((opt, i) => (
            <option value={opt.value} key={i} label={opt.label}>
              {opt.label}
            </option>
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