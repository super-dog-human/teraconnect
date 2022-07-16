/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Spacer from './spacer'
import ContainerSpacer from './containerSpacer'
import PlainText from './plainText'

const Licenses = () => (
  <div css={bodyStyle}>
    <PlainText color='gray' size='16'>
      <ContainerSpacer left='100' right='100'>
        <Spacer height='50' />

        <PlainText color='gray' size='14'>
          サービス内で使用している素材と製作者のお名前の一覧です。（敬称略）
        </PlainText>

        <Spacer height='50' />

        <div>
          <PlainText color='gray' size='30'>
            画像
          </PlainText>
        </div>
        <Spacer height='20' />
        <div>Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/bqlqn" title="bqlqn">bqlqn</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/catalin-fertu" title="Catalin Fertu">Catalin Fertu</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/dighital" title="Dighital">Dighital</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>          <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/kirill-kazachek" title="Kirill Kazachek">Kirill Kazachek</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/prettycons" title="prettycons">prettycons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/riajulislam" title="riajulislam">riajulislam</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div><a href="https://jp.freepik.com/psd/background">Rawpixel.com - jp.freepik.com によって作成された background フォトショップドキュメント</a></div>

        <Spacer height='50' />

        <div>
          <PlainText color='gray' size='30'>
            音楽
          </PlainText>
        </div>
        <Spacer height='20' />
        <div>Alexander Nakarada</div>
        <div>Autore Anonimo</div>
        <div>Bryan Teoh</div>
        <div>Dexter Britain</div>
        <div>Rafael Krux</div>
        <div>畑のVTuber陽菜</div>
        <div></div>
        <div></div>

        <Spacer height='50' />

        <div>
          <PlainText color='gray' size='30'>
            アバター
          </PlainText>
        </div>
        <Spacer height='20' />
        <div>メシエナンバー</div>
        <div>やまろん製作所</div>

        <Spacer height='100' />
      </ContainerSpacer>
    </PlainText>
  </div>
)

export default Licenses

const bodyStyle = css({
  maxWidth: '1280px',
  margin: 'auto',
})