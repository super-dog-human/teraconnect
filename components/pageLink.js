import React from 'react'
import Link from 'next/link'

const PageLink = ({ path, children }) => (
  <Link href={path} passHref>
    <a>{children}</a>
  </Link>
)

export default PageLink