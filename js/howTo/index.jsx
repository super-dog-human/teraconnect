import React from 'react';

export default () => (
    <div id="how-to" className="app-back-color-light-gray">
        <div id="how-to-body" className="app-back-color-soft-white app-text-color-dark-gray">
            <div>
                <h3>使い方</h3>
            </div>
            <ul>
                <li>
                    <h4>Q. うまく動かないよ〜〜！</h4>
                    今のところスマートフォンだと動かないよ…ごめんね。<br />
                    <b>PC版のChromeまたはFirefoxの最新版</b>で動作するはずだよ！<br />
                    それでもダメだったら…<a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2" target="_blank">教えてね！</a>
                </li>
                <li>
                    <h4>Q. 3Dモデル（アバター）を持ってないと使えないの？</h4>
                    わたし（てらこ）で授業ができるよ！アバター選択のところで<br />
                    <img src="https://storage.googleapis.com/teraconn_thumbnail/avatar/bdiuotgrbj8g00l9t3ng.png" />👈🏻このアイコンを選んでね！
                </li>
                <li>
                    <h4>Q. どうやって他の人に見てもらうの？</h4>
                    ベータ版なので、一定期間（10日ぐらい）が経つと自動的に授業が消えちゃうよ。<br />
                    消えるまでの間は、URLをお友達に教えると見てもらえるよ！
                </li>
                <li>
                    <h4>Q. 画面を録画してYoutubeとかにアップしてもいい？</h4>
                    自分で作成した授業ならもちろんOKだよ！好きなように使ってね！
                </li>
                <li>
                    <h4>Q. 大切なアバターなんだけど、アップロードしても大丈夫？</h4>
                    アップロードされたVRMファイルは、授業の再生のため、<b className="text-danger">見た人全てに再配布されるよ。</b><br />
                    みんなに見て欲しいけど、ファイルを配布したくない時は、画面を録画して動画サイトにアップして欲しいな。<br/>
                    Teraconnect側で、VRMファイルを配布せずに動画に変換する仕組みも検討中だよ…！<br />
                </li>
                <li>
                    <h4>Q. 自分で作ったアバターがうまく使えないよ〜</h4>
                    以下の条件を満たすVRMファイルが使えるよ！<br /><br />

                    ・<b>VRoid Studio 0.2.10以降</b>でエクスポートしたもの<br />
                    ・ライセンスがCC0（いかなる権利も保有しない）<br />
                    ・ファイルサイズが30MB以内<br /><br />

                    それでもダメだったら…<a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2" target="_blank">教えてね！</a>
                </li>
                <li>
                    <h4>Q. 収録した授業を消したい/残したいんだけど…</h4>
                    ベータ版なので、一定時間（10日ぐらい）経つと授業が消えるよ。<br />
                    どうしても早く消したい！とかがあったら教えて欲しいな。<br />
                </li>
                <li>
                    <h4>Q. 腕がパタパタ、カクカクしちゃう〜…</h4>
                    首と腕の動き検出はまだ実験段階なの…コツとしてはこんなのがあるよ。<br /><br />
                    ・明るい部屋で撮る<br />
                    ・頭から腕の先が映るぐらいまで、カメラから距離をとる<br />
                    ・服と背景が似たような色なら、別の服に着替えちゃう<br />
                </li>
                <li>
                    <h4>Q. なんか暗くて何もない画面になったよ…</h4>
                    <a href="https://authoring.teraconnect.org/img/not-speaking-edit-screen.png"><img src="https://authoring.teraconnect.org/img/not-speaking-edit-screen.png" /></a><br />
                    収録中、何も喋らないとこうなるよ！分かりにくくてひっくりかえるね！直すように言っておくよ！
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
                width: 70vw;
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
            #how-to-body li a { text-decoration: none; color: #04acb4; }
            #how-to-body li a:link { color: #04acb4; }
            #how-to-body li a:visited { color: #04acb4; }
            #how-to-body li a:hover { text-decoration: none; color: #04acb4; }
            #how-to-body li a:active { color: #04acb4; }
            #lesson-creator {
                padding-top: 50px;
                padding-bottom: 100px;
            }
        `}</style>
    </div>
)