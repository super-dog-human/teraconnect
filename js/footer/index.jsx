import React from 'react'
import styled from '@emotion/styled'

const FooterBody = styled.div`
    position: relative;
    width: 100%;
    height: 50px;
`

const FooterLink = styled.a`
    position: absolute;
    color: var(--soft-white);
    font-size: 14px;
    height: 20px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    &:hover {
        color: var(--soft-white);
        text-decoration: none;
    }
`

export default () => (
    <footer className="fixed-bottom">
        <FooterBody className="text-center app-back-color-dark-gray">
            <FooterLink href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2">
                ZYGOPTERA
            </FooterLink>
        </FooterBody>
    </footer>
)
