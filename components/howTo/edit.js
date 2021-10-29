/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useMobileDetector from '../../libs/hooks/useMobileDetector'
import Spacer from '../spacer'
import ContainerSpacer from '../containerSpacer'
import PlainText from '../plainText'
import EditImage from './editImage'
import HeaderText from './headerText'
import DetailText from './detailText'

const HowToEdit = () => {
  const isMobile = useMobileDetector()

  return (
    <div css={bodyStyle}>
      <PlainText color='gray' size='16'>
        <ContainerSpacer left={isMobile ? '20' : '50'} right={isMobile ? '20' : '50'}>
          <Spacer height='50' />

          <div>
            <PlainText size='30'>
            入力編集モードの使いかた
            </PlainText>
          </div>

          <Spacer height='50' />

          <div>
            <EditImage name='1' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ①授業更新メニュー
            </HeaderText>
          </div>

          <Spacer height='30' />

          <div>
            <DetailText>保存ボタンです。授業に変更を加えていない場合は、ボタンを押しても何も起きません。</DetailText>
            <EditImage name='2' alt='' />

            <Spacer height='20' />

            <DetailText>授業の変更差分がある場合は、赤いバッジが表示されます。保存ボタンを押すと、現在の内容で上書き保存されます。</DetailText>
            <EditImage name='3' alt='' />

            <Spacer height='20' />

            <DetailText>展開ボタンを押すと、授業更新メニューが表示されます。</DetailText>
            <EditImage name='32' alt='' />

            <Spacer height='20' />

            <DetailText>授業更新メニューです。「上書き保存」は、保存ボタンと同じ働きをします。変更差分を削除する時は、「変更の破棄」を選びます。</DetailText>
            <EditImage name='21' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ②プレビュー
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>授業の内容を確認します。再生・一時停止・シークのほか、字幕のオンオフが切り替えられます。</DetailText>
            <EditImage name='4' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ③画像一覧
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>アップロードした画像のサムネイルです。右下のメニューボタンを押すと、画像編集メニューが展開します。</DetailText>
            <EditImage name='22' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>画像編集メニューです。「差し替え」は画像の入れ替えを、「削除」は画像の削除を行います。</DetailText>
            <EditImage name='5' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ④画像アップロードボタン
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>ボタンを押すと、画像ファイルのアップロードができます。</DetailText>
            <EditImage name='6' alt='' />
          </div>


          <Spacer height='100' />

          <div>
            <HeaderText>
            ⑤行編集メニュー
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>各行のメニューボタンを押すと、メニューが展開します。</DetailText>
            <EditImage name='7' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>行の編集、追加、削除が行えます。</DetailText>
            <EditImage name='8' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>行がないときは、行追加ボタンが表示されます。ボタンを押すと行追加パネルを表示します。</DetailText>
            <EditImage name='9' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>行追加パネルです。6種類の中から一つを選んで、新しい行を追加します。</DetailText>
            <EditImage name='10' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ⑥音声
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>音声の行です。音声が設定済みの場合は、音声ボタンが紫色になり、音声を再生できます。</DetailText>
            <EditImage name='24' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>音声に対応した字幕です。合成音声の場合は、変更時に音声が更新されます。</DetailText>
            <EditImage name='26' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>音声の行の編集時は、以下のパネルが表示されます。<br /><br />
          収録モードで話した内容は、自動的に字幕として入力されます。<br />
          テロップには色・位置を指定できます。</DetailText>
            <EditImage name='11' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>音声設定では、録音した音声の再生と、新しい音声の録音を行います。</DetailText>
            <EditImage name='12' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>メニューボタンを押すと、音声設定メニューが展開します。</DetailText>
            <EditImage name='28' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>音声設定メニューです。mp3ファイルのアップロードと、録音した音声のダウンロードができます。</DetailText>
            <EditImage name='27' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>切り替えボタンを押すと、録音した音声を使用しない合成音声へ切り替えます。</DetailText>
            <EditImage name='29' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>合成音声設定です。言語や声の種類などを選択し、合成音声を作成できます。</DetailText>
            <EditImage name='13' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>再生ボタンを押すと、現在の内容で合成音声を作成し、再生します。</DetailText>
            <EditImage name='33' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>切り替えボタンを押すと、録音した音声を使用する音声設定へ切り替えます。</DetailText>
            <EditImage name='30' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ⑦画像
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>画像の行です。サムネイルをクリックすると、拡大して表示します。</DetailText>
            <EditImage name='23' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>画像設定のパネルです。表示する画像を選択したり、表示中の画像を非表示にします。</DetailText>
            <EditImage name='14' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ⑧描画
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>描画の行です。描画ペンで描いた内容を再生できます。</DetailText>
            <EditImage name='25' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>描画の行の編集時は、以下のパネルが表示されます。<br />描き直すほか、描画のクリアや非表示状態に変更することができます。</DetailText>
            <EditImage name='15' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>描画の再生を任意の場所で停止し、そこから描き直すことができます。<br />収録を開始するには、収録ボタンを押します。</DetailText>
            <EditImage name='16' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>収録中は、描画以外の操作が無効になります。収録の停止は、再度収録ボタンを押してください。</DetailText>
            <EditImage name='17' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ⑨アバター
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>アバターの行の編集時は、以下のパネルが表示されます。<br />アバターをドラッグまたはスワイプすると、移動させることができます。<br />移動に要する時間も設定できます。</DetailText>
            <EditImage name='18' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ⑩埋め込み動画
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>埋め込み動画の行の編集時は、以下のパネルが表示されます。<br />GeoGebraやYouTube（試験実装）の表示・非表示を設定できます。</DetailText><br />
            <PlainText size='12'>※表示のみに対応しており、ボタンやプレーヤーを操作することはできません。</PlainText>
            <EditImage name='19' alt='' />
          </div>

          <Spacer height='100' />

          <div>
            <HeaderText>
            ⑪BGM
            </HeaderText>
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>BGMの行の編集時は、以下のパネルが表示されます。BGMの選択や開始・停止などが設定できます。</DetailText>
            <EditImage name='20' alt='' />
          </div>

          <Spacer height='50' />

          <div>
            <DetailText>アップロードボタンを押すと、mp3ファイルをアップロードすることができます。</DetailText><br />
            <PlainText size='12'>※著作者の権利を必ずご確認ください。</PlainText>
            <EditImage name='31' alt='' />
          </div>

          <Spacer height='100' />
        </ContainerSpacer>
      </PlainText>
    </div>
  )
}

export default HowToEdit

const bodyStyle = css({
  maxWidth: '1280px',
  margin: 'auto',
})