/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Spacer from '../spacer'
import ContainerSpacer from '../containerSpacer'
import PlainText from '../plainText'
import RecordImage from './recordImage'
import HeaderText from './headerText'
import DetailText from './detailText'

const HowToRecord = () => (
  <div css={bodyStyle}>
    <PlainText color='gray' size='16'>
      <ContainerSpacer left='50' right='50'>
        <Spacer height='50' />

        <div>
          <PlainText size='30'>
            収録モードの使いかた
          </PlainText>
        </div>

        <Spacer height='50' />

        <RecordImage name='1' alt='' />

        <Spacer height='100' />

        <div>
          <HeaderText>
            ①収録ボタン
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>停止中です。ボタンを押すと、収録が始まります。</DetailText>
          <RecordImage name='13' alt='' />

          <Spacer height='20' />

          <DetailText>収録中です。ボタンを押すと、収録が停止します。</DetailText>
          <RecordImage name='14' alt='' />

          <Spacer height='20' />

          <DetailText>収録を開始してから停止した状態です。右のボタンを押すと、収録を再開します。</DetailText>
          <RecordImage name='15' alt='' />

          <Spacer height='20' />

          <DetailText>左のボタンを押すと、収録を完了し、入力編集モードへ移動します。</DetailText>
          <RecordImage name='22' alt='' />

        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ②描画切り替えボタン
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>ボタンを押すと、描画を非表示にします。もう一度押すと再度表示します。</DetailText>
          <RecordImage name='16' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ③描画ペンボタン
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>ボタンを押すと、描画ペンのオン・オフを切り替えます。オンになっていると、マウスやタッチで線が描けます。</DetailText>
          <RecordImage name='17' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ④描画設定ボタン
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>ボタンを押すと、描画設定パネルが展開します。</DetailText>
          <RecordImage name='23' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>描画設定パネルでは、描画ペンの太さ・色の変更と、消しゴムへの切り替えができます。</DetailText>
          <RecordImage name='6' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>消しゴムの描画設定パネルです。太さの変更と、描画ペンへの切り替えができます。</DetailText>
          <RecordImage name='7' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ⑤描画戻すボタン
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>直近の描画を、1ストローク分戻します。</DetailText>
          <RecordImage name='18' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ⑥描画クリアボタン
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>ボタンを押すと、現在の描画を全て削除します。</DetailText>
          <RecordImage name='20' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ⑦詳細設定ボタン
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>ボタンを押すと、詳細設定パネルを表示します。</DetailText>
          <RecordImage name='19' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>詳細設定パネルの背景設定です。背景画像を変更できます。</DetailText>
          <RecordImage name='8' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>詳細設定パネルのアバター設定です。アバターと環境光の色合いを変更できます。</DetailText>
          <RecordImage name='9' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>詳細設定パネルのマイク設定です。使用するマイクの変更、文章の区切りを検出する閾値の変更と、スペアナの表示・非表示の切り替えができます。</DetailText>
          <RecordImage name='10' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ⑧音声スペアナ表示
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>マイクのスペクトルアナライザです。正しくマイクが認識されていると、入力に応じて波形が表示されます。</DetailText>
          <RecordImage name='3' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>騒音のある環境では、何も喋っていなくても小さな波形が表示されます。<br />このような表示が続く場合は、静かな場所に移動してください。</DetailText>
          <RecordImage name='5' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ⑨アバター
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>あなたの分身となるアバターです。ドラッグまたはスワイプで移動できます。<br />一定以上の音量で話すと、口が連動して動きます。</DetailText>
          <RecordImage name='2' alt='' />
        </div>

        <Spacer height='100' />

        <div>
          <HeaderText>
            ⑩画像管理
          </HeaderText>
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>初期状態では、画像アップロードボタンが表示されます。ボタンを押すと、画像ファイルのアップロードができます。</DetailText>
          <RecordImage name='11' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>画像をアップロードすると、サムネイルが表示されます。サムネイルを押すと授業内で表示し、再度押すと非表示になります。</DetailText>
          <RecordImage name='12' alt='' />
        </div>

        <Spacer height='50' />

        <div>
          <DetailText>右端のボタンを押すと、さらに画像ファイルをアップロードできます。</DetailText>
          <RecordImage name='21' alt='' />
        </div>

        <Spacer height='100' />
      </ContainerSpacer>
    </PlainText>
  </div>
)

export default HowToRecord

const bodyStyle = css({
  maxWidth: '1280px',
  margin: 'auto',
})