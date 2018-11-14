import React from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Const from '../common/constants'
import { isProduction } from '../common/utility'

export default class Home extends React.Component {
    constructor(props) {
        super(props)

        const agreeToTerms = Cookies.get('agreeToTerms')
        const initAgreeToTerms = agreeToTerms === 'true'
        this.state = {
            isAgreeToTerms: initAgreeToTerms
        }
    }

    changeAgreeToTerms(event) {
        const isAgree = event.target.checked
        let option = {}
        if (isProduction()) {
            option = { path: '/', secure: true }
        } else {
            option = { path: '/' }
        }
        Cookies.set('agreeToTerms', isAgree.toString(), option)
        this.setState({ isAgreeToTerms: isAgree })
    }

    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000
        }
        return (
            <div id="home">
                <div id="slick-hero">
                    <Slider {...settings}>
                        <div id="hero-one">
                            <div id="app-large-title">「教えたい」を形に。</div>
                            <div id="app-caption" className="text-gray">
                                好きなアバターで、自由に授業をつくろう。
                                <br />
                                画像を貼りつけたり、クイズを出したり。
                                <br />
                                いつでも更新できて、いつまでも誰かに届く、そんな授業を。
                                <br />
                            </div>
                            <div id="app-small-title" className="text-gray">
                                なりたい先生に、なろう。
                            </div>
                            <Link to="/lessons/new" id="trial-link">
                                <button
                                    id="trial-btn"
                                    className="btn"
                                    disabled={!this.state.isAgreeToTerms}
                                >
                                    <div id="trial-btn-label">
                                        <FontAwesomeIcon icon="edit" />
                                        &nbsp;お試し授業をつくる
                                    </div>
                                    <div id="trial-btn-notice">
                                        機能の一部がお試しできます
                                    </div>
                                </button>
                            </Link>
                            <div id="terms-of-use">
                                <input
                                    id="agree-terms-checkbox"
                                    type="checkbox"
                                    checked={this.state.isAgreeToTerms}
                                    onChange={this.changeAgreeToTerms.bind(
                                        this
                                    )}
                                />
                                &nbsp;
                                <Link to="/terms_of_use">利用規約</Link>
                                に同意する
                            </div>
                        </div>
                        <div id="hero-two">
                            <div id="feature-title" className="text-gray">
                                きっと、素敵な先生になれる。
                            </div>
                            <ul
                                id="feature-sentences"
                                className="list-unstyled text-gray"
                            >
                                <li className="feature">
                                    <h2>自由な姿、自由な声。</h2>
                                    <h3>
                                        アバターをアップロードして、好きな姿で授業をしよう。
                                        <br />
                                        音声ファイルを差し替えて、声の変更も可能。
                                        <br />
                                    </h3>
                                </li>
                                <li className="feature">
                                    <h2>文字起こしはおまかせ。</h2>
                                    <h3>
                                        旧来の動画編集はもう不要。
                                        <br />
                                        喋った内容は、自動で文字起こし。
                                        <br />
                                    </h3>
                                </li>
                                <li className="feature">
                                    <h2>みんなの意見を聞こう。</h2>
                                    <h3>
                                        授業づくりが不安になったら、レビューを依頼。
                                        <br />
                                        他の先生からアドバイスをもらおう。
                                        <br />
                                    </h3>
                                </li>
                            </ul>
                        </div>
                        <div id="hero-three">
                            <h3 className="text-gray">
                                インターネットは、たくさんの人を繋げてくれた。
                                <br />
                                遠くの先生と、遠くの生徒を。
                                <br />
                                いくつもの壁を乗り越えて、すごい先生達が、
                                <br />
                                頑張って素敵な授業を作ってくれた。
                                <br />
                                <br />
                                けれど、まだ足りない。
                                <br />
                                声を届けたい人はこんなにも多いのに、
                                <br />
                                壁を越えられる人はごく僅かだ。
                                <br />
                                <br />
                                いま、壁を越える道具と共に、新しい授業をつくろう。
                                <br />
                                意思と継続を以って、大切な何かを次代に渡そう。
                                <br />
                            </h3>
                            <h2 className="text-gray">もう一人じゃない。</h2>
                        </div>
                    </Slider>
                </div>
                <div id="app-large-logo">
                    <img src="/img/logo-large.png" alt="Teraconnect" />
                </div>
                <div id="license-notation">
                    <span>designed by Freepik, Pixel Buddha from Flaticon</span>
                </div>
                <style jsx>{`
                    --default-gray: #767676;
                    --heading-pink: #da7b7b;
                    #home {
                        width: 100%;
                        height: 100%;
                    }
                    .text-gray {
                        color: var(--default-gray);
                    }
                    #slick-hero {
                        width: calc(100% - 30px);
                        height: 40vw;
                        max-height: 512px;
                    }
                    #hero-one {
                        width: 100%;
                        height: 100%;
                        background-image: url('/img/avatar.png');
                        background-repeat: no-repeat;
                        background-position: 20% 0%;
                        background-size: contain;
                    }
                    #app-large-title {
                        font-size: 3.5vw;
                        font-weight: 700;
                        color: var(--heading-pink);
                        margin-top: 5vw;
                        margin-left: 45vw;
                    }
                    #app-caption {
                        font-size: 1.4vw;
                        font-weight: 500;
                        line-height: 4vw;
                        margin-top: 2vw;
                        margin-left: 50vw;
                    }
                    #app-small-title {
                        font-size: 2.2vw;
                        font-weight: 700;
                        line-height: 4vw;
                        margin-top: 2vw;
                        margin-left: 50vw;
                    }
                    :global(#trial-link) {
                        pointer-events: ${this.state.isAgreeToTerms
                ? 'auto'
                : 'none'};
                        cursor: ${this.state.isAgreeToTerms
                ? 'pointer'
                : 'cursor'};
                    }
                    #trial-btn {
                        width: 17vw;
                        height: 5vw;
                        padding: 0;
                        margin-top: 2.5vw;
                        margin-left: 60vw;
                        background-color: var(--attention-orange);
                    }
                    #trial-btn-label {
                        color: white;
                        font-size: 1.5vw;
                        font-weight: 700;
                    }
                    #trial-btn-notice {
                        font-size: 0.5vw;
                        font-weight: 500;
                        color: white;
                    }
                    #terms-of-use {
                        margin-top: 0.5vw;
                        margin-left: 62.5vw;
                        font-size: 1vw;
                    }
                    #agree-terms-checkbox {
                        width: 1vw;
                        height: 1vw;
                    }
                    #hero-two {
                        width: 100%;
                        height: 100%;
                        background-image: url('/img/screenshot.jpg');
                        background-repeat: no-repeat;
                        background-position: 0% 50%;
                        background-size: contain;
                    }
                    #feature-title {
                        font-size: 2.2vw;
                        font-weight: 700;
                        line-height: 4vw;
                        margin-top: 3vw;
                        margin-bottom: 4vw;
                        margin-left: 58vw;
                    }
                    .feature {
                        padding-left: 7vw;
                    }
                    #feature-sentences li {
                        margin-left: 54vw;
                        margin-bottom: 3vw;
                    }
                    #feature-sentences li h2 {
                        font-size: 1.5vw;
                        font-weight: 500;
                    }
                    #feature-sentences li h3 {
                        font-size: 1.1vw;
                        line-height: 2vw;
                    }
                    #feature-sentences li:nth-child(1) {
                        background-image: url('/img/yeti.png');
                        background-repeat: no-repeat;
                        background-size: 5vw auto, contain;
                    }
                    #feature-sentences li:nth-child(2) {
                        background-image: url('/img/microphone.png');
                        background-repeat: no-repeat;
                        background-size: 4.5vw auto, contain;
                    }
                    #feature-sentences li:nth-child(3) {
                        background-image: url('/img/chat.png');
                        background-repeat: no-repeat;
                        background-size: 5.5vw auto, contain;
                    }
                    #hero-three {
                        width: 100%;
                        height: 100%;
                        background-image: url('/img/adult-black-and-white-children.jpg');
                        background-repeat: no-repeat;
                        background-position: 100% 50%;
                        background-size: contain;
                    }
                    #hero-three h3 {
                        margin-top: 5vw;
                        margin-left: 8vw;
                        font-size: 1.1vw;
                        line-height: 2vw;
                    }
                    #hero-three h2 {
                        margin-top: 3vw;
                        margin-left: 8vw;
                        font-size: 2vw;
                        font-weight: 700;
                    }
                    #license-notation {
                        text-align: right;
                        margin-right: 20px;
                        margin-bottom: 100px;
                        color: gray;
                        font-size: 0.5vw;
                    }
                    #app-large-logo {
                        width: 100%;
                        margin-top: 200px;
                        text-align: center;
                    }
                    #app-large-logo img {
                        width: 25vw;
                        max-width: 250px;
                        margin: auto;
                    }
                    @media (min-width: 1280px) {
                        #hero-one {
                            background-position: 25% 0%;
                        }
                        #app-large-title {
                            font-size: 3em;
                            margin-top: 50px;
                        }
                        #app-caption {
                            font-size: 1.3em;
                            line-height: 2.7em;
                            margin-top: 20px;
                        }
                        #app-small-title {
                            font-size: 2em;
                            line-height: 2em;
                            margin-top: 10px;
                        }
                        #trial-btn {
                            width: 220px;
                            height: 65px;
                            margin-top: 20px;
                            margin-left: 55vw;
                        }
                        #trial-btn-label {
                            font-size: 1.2em;
                        }
                        #trial-btn-notice {
                            font-size: 0.2em;
                        }
                        #terms-of-use {
                            margin-top: 10px;
                            margin-left: 57vw;
                            font-size: 0.9em;
                        }
                        #agree-terms-checkbox {
                            width: 15px;
                            height: 15px;
                        }
                        #hero-two {
                            background-position: 0% 50%;
                        }
                        #feature-title {
                            font-size: 2em;
                            line-height: 4em;
                            margin-top: 10px;
                            margin-bottom: 10px;
                            margin-left: 55vw;
                        }
                        .feature {
                            padding-left: 100px;
                        }
                        #feature-sentences li {
                            margin-bottom: 40px;
                        }
                        #feature-sentences li h2 {
                            font-size: 1.3em;
                        }
                        #feature-sentences li h3 {
                            font-size: 1em;
                            line-height: 1.6em;
                        }
                        #feature-sentences li:nth-child(1) {
                            background-size: 70px auto, contain;
                        }
                        #feature-sentences li:nth-child(2) {
                            background-size: 60px auto, contain;
                        }
                        #feature-sentences li:nth-child(3) {
                            background-size: 80px auto, contain;
                        }
                        #hero-three h3 {
                            margin-top: 50px;
                            font-size: 1em;
                            line-height: 1.7em;
                        }
                        #hero-three h2 {
                            margin-top: 50px;
                            font-size: 2em;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
