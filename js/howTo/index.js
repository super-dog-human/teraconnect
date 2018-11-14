import React from 'react'

export default () => (
    <div id="how-to" className="app-back-color-light-gray">
        <div
            id="how-to-body"
            className="app-back-color-soft-white app-text-color-dark-gray"
        >
            <div>
                <h3>使い方</h3>
            </div>
            <ul>
                <li>
                    <h4>Q. どうやって使うの？</h4>
                    1.
                    最初の画面です。タイトルや説明を入力し、授業内で使用する画像やアバターを選択します。
                    <br />
                    画像やアバターは、自分のものをアップロードして使うことができます。
                    <br />
                    2.
                    授業を収録する画面です。マイクに向かって話し、授業を行います。
                    <br />
                    画像を切り替えたり、アバターの表情を切り替えることができます。
                    <br />
                    3. 編集画面です。
                    文字起こしのテキストを修正し、プレビューで収録した授業を確認します。
                    <br />
                </li>
                <li>
                    <h4>Q. 動作環境は？</h4>
                    対応ブラウザは、PC版ChromeまたはFirefoxの最新版です。
                    <br />
                    PCの推奨環境は下記の通りです。
                    <br />
                    <br />
                    <h5>CPU</h5>
                    Googleのベンチマーク「
                    <a href="http://chromium.github.io/octane/" target="_blank">
                        Octane
                    </a>
                    」のスコアが30,000以上のものが目安です。
                    <br />
                    <br />
                    <h5>メモリ</h5>
                    8GB程度が必要です。収録時は不要なソフトやタブを閉じておくことをお勧めします。
                    <br />
                    <br />
                    <h5>Webカメラ</h5>
                    画質は低めでも大丈夫です（640x480の解像度があればOK）。
                    <br />
                    収録は明るい環境で行い、逆光でないことを確認してください。
                    <br />
                    <br />
                    <h5>マイク</h5>
                    どんなものでも使用できますが、安い製品はホワイトノイズが目立つようです。
                    <br />
                    開発では
                    <a
                        href="https://www.amazon.co.jp/gp/product/B01GJ9IUNY/"
                        target="_blank"
                    >
                        MPM-2000U
                    </a>
                    というマイクにポップガードをつけて動作確認をしています。
                    <br />
                </li>
                <li>
                    <h4>Q. ボイスチェンジして収録したい</h4>
                    WindowsではREAPERや恋声にNETDUETTOを、
                    <br />
                    macOSではREAPERにSoundFlowerを併用することで収録が可能です。
                    <br />
                </li>
                <li>
                    <h4>Q. 授業時間は何分まで？</h4>
                    最長で10分の収録が可能です。
                    <br />
                    また、収録中に一時停止や再開が可能です。
                    <br />
                </li>
                <li>
                    <h4>
                        Q. 画面を録画して、Youtubeなどにアップロードしてもよい？
                    </h4>
                    自分で作成した授業なら、用途を問わず自由にお使い頂けます。
                    <br />
                    「Teraconnect」の表記も必要ありません。
                    <br />
                </li>
                <li>
                    <h4>Q. 自作3Dモデル（アバター）がうまく使えない</h4>
                    VRMファイルは、以下の条件を満たすものが使用できます。
                    <br />
                    <br />
                    ・VRoid Studio 0.2.10以降でエクスポートしたもの
                    <br />
                    ・再配布が可能な設定
                    <br />
                    ・ファイルサイズが30MB以下
                    <br />
                </li>
                <li>
                    <h4>Q. アップしたアバターを保護したい</h4>
                    アップロードされたVRMファイルは、授業の再生のため
                    <b className="text-danger">視聴者全員に再配布されます。</b>
                    <br />
                    再配布可能なVRMファイルのみをお使いください。
                    <br />
                </li>
            </ul>
        </div>
        <style jsx>{`
            #how-to {
                width: 100%;
                text-align: center;
                padding-top: 100px;
                padding-bottom: 100px;
            }
            #how-to-body {
                width: 80vw;
                margin-left: auto;
                margin-right: auto;
                padding-top: 30px;
            }
            #how-to-body li {
                display: block;
                text-align: left;
                padding: 30px;
            }
            #how-to-body li h4 {
                margin-bottom: 20px;
            }
            #how-to-body li img {
                width: 70px;
                height: 70px;
                object-fit: contain;
            }
            #how-to-body li a {
                text-decoration: none;
                color: var(--powder-blue);
            }
            #how-to-body li a:link {
                color: var(--powder-blue);
            }
            #how-to-body li a:visited {
                color: var(--powder-blue);
            }
            #how-to-body li a:hover {
                text-decoration: none;
                color: var(--powder-blue);
            }
            #how-to-body li a:active {
                color: var(--powder-blue);
            }
        `}</style>
    </div>
)
