import React from 'react'
import Link from 'next/link'

const PageLink = ({ path, children }) => (
  <Link href={path}>
    <a>{ children }</a>
  </Link>
)

export default PageLink