import React, { Fragment } from 'react'

export default function MultilineText({ texts }) {
  return (
    <>
      {texts.split(/(\n)/).map((line, i) => (
        <Fragment key={i}>
          {line.match(/\n/) ? <br /> : line}
        </Fragment>
      ))}
    </>
  )
}