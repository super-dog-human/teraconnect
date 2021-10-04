import React from 'react'
import Link from 'next/link'

const PageLink = ({ path, target, children }) => (
  <Link href={path} passHref>
    <a target={target}>{children}</a>
  </Link>
)

export default PageLink