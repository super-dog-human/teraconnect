import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { css } from 'emotion'

const Header = styled.header`
    height: 64px;
`

const AppLogo = styled.span`
    width: 200px;
    height: 64px;
    padding: 0;
    margin-left: 50px;
`

const AppLogoImage = styled.img`
    width: 200px;
    height: 64px;
`

const Menu = styled.span`
    color: var(--soft-white);
    font-size: 16px;
    min-width: 100px;
    margin-left: 10px;
    margin-right: 10px;
    text-align: center;
    line-height: 64px;
    &::after {
        display: block;
        content: '';
        background-color: var(--dark-navy);
        margin-top: -3px;
        height: 3px;
    }
    &:hover::after {
        background-color: var(--attention-orange);
    }
`
//    &:nth-of-type(${props => props.selectedIndex})::after {
//        background-color: var(--attention-orange);
//    }

const linkStyle = css`
    text-decoration: none;
    padding: 0;
    &:link {
        color: var(--soft-white);
    }
    &:visited {
        color: var(--soft-white);
    }
    &:hover {
        text-decoration: none;
        color: var(--soft-white);
    }
    &:active {
        color: var(--soft-white);
    }
`

export default (
    { selectedIndex = 0 } // FIXME selectedIndex value
) => (
    <Header className="app-back-color-dark-navy fixed-top">
        <div className="d-flex justify-content-right">
            <AppLogo className="mr-auto">
                <Link to="/">
                    <AppLogoImage src="/img/logo-beta.png" />
                </Link>
            </AppLogo>
            <Menu className="link-text" selectedIndex={selectedIndex}>
                <Link
                    className={`nav-link font-weight-light ${linkStyle}`}
                    to="/how_to"
                />
            </Menu>
        </div>
    </Header>
)
