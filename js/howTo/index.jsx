import React from 'react'
import styled from '@emotion/styled'

const Page = styled.div(() => ({
    paddingTop: '50px',
    paddingLeft: '5vw',
    paddingRight: '5vw',
    paddingBottom: '100px'
}))

const Question = styled.h4(() => ({
    marginBottom: '10px'
}))

const Answer = styled.div(() => ({
    textAlign: 'left',
    marginTop: '20px',
    marginBottom: '60px'
}))

const AnswerHeading = styled.h5(() => ({
    marginTop: '50px',
    marginBottom: '20px'
}))

const Graphic = styled.img(() => ({
    width: '400px',
    objectFit: 'contain',
    margin: '30px'
}))

export default () => (
    <Page className="app-text-color-dark-gray">
        <Question>Q. どうやって使うの？</Question>
        <Answer>
            <AnswerHeading>授業の準備</AnswerHeading>
            授業のタイトルを入力し、授業内で表示する画像やアバターを選択します。
            <br />
            画像やアバターは、自分のものをアップロードして使うことができます。
            <br />
            <br />
            説明欄に入力したテキストは、再生画面のtwitterボタンでつぶやく際に使用されます。
            <br />
            <a href="/img/manual_01.png" target="_blank">
                <Graphic src="/img/manual_01.png" />
            </a>
            <br />
            <AnswerHeading>授業の収録</AnswerHeading>
            収録開始ボタンをクリックし、マイクに向かって話します。
            <br />
            画像を切り替えたり、アバターを前後左右に移動させることができます。
            <br />
            <br />
            Webカメラで顔を認識していると、まばたき、口、首の動きがアバターに反映され、
            <br />
            表情の切り替えボタンが使用できます。
            <br />
            <a href="/img/manual_02.png" target="_blank">
                <Graphic src="/img/manual_02.png" />
            </a>
            <br />
            <AnswerHeading>授業の編集と公開</AnswerHeading>
            編集画面です。
            授業で話した内容が文字起こしされ、手動で修正することが可能です。
            <br />
            収録した授業をプレビューで確認し、公開または削除を行います。
            <br />
            <a href="/img/manual_03.png" target="_blank">
                <Graphic src="/img/manual_03.png" />
            </a>
            <br />
        </Answer>

        <Question>Q. 動作環境は？</Question>
        <Answer>
            対応ブラウザは、PC版ChromeまたはFirefoxの最新版です。
            <br />
            PCの推奨環境は下記の通りです。
            <br />
            <br />
            <h5>CPU</h5>
            <a
                href="https://www.cpubenchmark.net/mid_range_cpus.html"
                target="_blank"
                rel="noopener noreferrer"
            >
                PassMarkのベンチマーク
            </a>
            の結果が4,000以上のCPUが目安です。
            <br />
            Googleのベンチマーク「
            <a
                href="http://chromium.github.io/octane/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Octane
            </a>
            」で、スコアが30,000以上になれば大丈夫です。
            <br />
            <br />
            <h5>メモリ</h5>
            8GB程度が必要です。収録中は不要なソフトやタブを閉じておくことをお勧めします。
            <br />
            <br />
            <h5>Webカメラ</h5>
            画質は低めでも大丈夫です（640x480の解像度があればOK）。
            <br />
            収録は明るい環境で行い、逆光でないことを確認してください。
            <br />
            <br />
            <h5>マイク</h5>
            どんなものでも使用できますが、安い製品はノイズが目立つようです。
            <br />
            <a
                href="https://www.amazon.co.jp/gp/product/B01GJ9IUNY/"
                target="_blank"
                rel="noopener noreferrer"
            >
                MPM-2000U
            </a>
            というコンデンサマイクにポップガードをつけるのがお勧めです。
            <br />
        </Answer>

        <Question>Q. ボイスチェンジして収録したい</Question>
        <Answer>
            WindowsではREAPERや恋声にNETDUETTOを、
            <br />
            macOSではREAPERにSoundFlowerを併用することで収録が可能です。
            <br />
            ブラウザのマイク設定を、NETDUETTOやSoundFlowerの仮想デバイスにして収録してください。
            <br />
        </Answer>

        <Question>Q. 授業時間は何分まで？</Question>
        <Answer>
            最長で10分の収録が可能です。
            <br />
            また、収録中に一時停止や再開をすることができます。
            <br />
        </Answer>

        <Question>
            Q. 画面を録画して、Youtubeなどにアップロードしてもよい？
        </Question>
        <Answer>
            自分で作成した授業なら、用途を問わず自由にお使い頂けます。
            <br />
            「Teraconnect」の表記も必要ありません。
            <br />
        </Answer>

        <Question>Q. 自作3Dモデル（アバター）がうまく使えない</Question>
        <Answer>
            VRMファイルは、以下の条件を満たすものが使用できます。
            <br />
            <br />
            ・VRoid Studio 0.2.10以降でエクスポートしたもの
            <br />
            ・著作権放棄（CC0）設定
            <br />
            ・ファイルサイズが30MB以下
            <br />
        </Answer>

        <Question>Q. アップロードしたアバターを保護したい</Question>
        <Answer>
            アップロードされたVRMファイルは、授業の再生のため
            <b className="text-danger">視聴者全員に再配布されます。</b>
            <br />
            再配布可能なVRMファイルのみをお使いください。
            <br />
        </Answer>
    </Page>
)
