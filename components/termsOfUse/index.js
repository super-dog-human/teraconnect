/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Spacer from '../spacer'
import ContainerSpacer from '../containerSpacer'
import PlainText from '../plainText'
import Head from './head'

const TermsOfUse = () => (
  <div css={bodyStyle}>
    <PlainText color='gray' size='16'>
      <ContainerSpacer left='20' right='20'>
        <Spacer height='30' />
        <div>
          この利用規約（以下、「本規約」といいます。）は、サービス運営者ZYGOPTERA（以下、「運営者」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
        </div>
        <Spacer height='50' />

        <Head>第1条（適用）</Head>
        本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。
        <Spacer height='50' />

        <Head>第2条（利用の同意）</Head>
        サービス利用希望者が本サービス内において本規約への同意を示すことによって、運営者は利用を承認します。
        <br />
        運営者は、サービス利用希望者に以下の事由があると判断した場合、利用を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
        <br />
        <br />
        （1）利用申請に際して虚偽または不正な手段にて同意を示した場合
        <br />
        （2）本規約に違反したことがある者からの申請である場合
        <br />
        （3）その他、運営者が利用申請を相当でないと判断した場合
        <Spacer height='50' />

        <Head>第3条（コンテンツの配布と制限）</Head>
        ユーザーは、本サービス内に、ユーザーが使用する権利を持つ音声、画像ファイル、3Dモデルファイル（以下、「デジタルコンテンツ」といいます。）のみをアップロードするものとします。
        <br />
        運営者は、ユーザーがアップロードしたデジタルコンテンツのうち、ユーザーが公開操作を行ったものについて、本サービスから公衆に発信します。
        <br />
        運営者は、アップロードされたデジタルコンテンツが本規約に反すると判断した場合、ユーザーの同意を得ることなく削除できるものとします。
        <br />
        運営者は、ユーザーに対して、アップロードされたデジタルコンテンツおよび本サービスの使用を、本規約に反しない限り制限することはなく、運営者がデジタルコンテンツの著作権および著作者人格権を主張することはありません。
        <br />
        運営者は、ユーザーがアップロードしたデジタルコンテンツを、本サービスの円滑な提供、システムの構築、改良、メンテナンス等に必要な範囲内で、一部および全部の変更、削除その他の改変を行うことができるものとします。
        <Spacer height='50' />

        <Head>第4条（プライバシー）</Head>
        運営者は、本サービスの全ての利用者に対して、Google Analyticsを使用し、サービス利用状況の取得を行うものとします。これに付随して、CookieファイルやIPアドレス等の個人を特定しない情報の一部が、Google社に収集されます。
        <br />
        運営者は、Google Analyticsを通じて取得したサービス利用状況を、本サービスの改善およびサービスの周知のために使用します。
        <br />
        Google社による情報収集についての詳細は、
        <a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer">
          GOOGLE のサービスを使用するサイトやアプリから収集した情報の
          GOOGLE による使用
        </a>
        にて確認することができます。
        <Spacer height='50' />

        <Head>第5条（禁止事項）</Head>
        ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
        <br />
        <br />
        （1）法令または公序良俗に違反する行為
        <br />
        （2）犯罪行為に関連する行為
        <br />
        （3）運営者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
        <br />
        （4）運営者のサービスの運営を妨害するおそれのある行為
        <br />
        （5）他のユーザーに関する個人情報等を収集または蓄積する行為
        <br />
        （6）他のユーザーに成りすます行為
        <br />
        （7）運営者のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
        <br />
        （8）ユーザーが使用または配布する権利を有しないデジタルコンテンツをアップロードする行為
        <br />
        （9）その他、運営者が不適切と判断する行為
        <Spacer height='50' />

        <Head>第6条（本サービスの提供の停止等）</Head>
        運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
        <br />
        <br />
        （1）本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
        <br />
        （2）地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
        <br />
        （3）コンピュータまたは通信回線等が事故により停止した場合
        <br />
        （4）その他、運営者が本サービスの提供が困難と判断した場合
        <br />
        <br />
        運営者は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害について、理由を問わず一切の責任を負わないものとします。
        <Spacer height='50' />

        <Head>第7条（利用制限および登録抹消）</Head>
        運営者は、以下の場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限することができるものとします。
        <br />
        <br />
        （1）本規約のいずれかの条項に違反した場合
        <br />
        （2）その他、運営者が本サービスの利用を適当でないと判断した場合
        <br />
        <br />
        運営者は、本条に基づき運営者が行った行為によりユーザーに生じた損害について、一切の責任を負いません。
        <Spacer height='50' />

        <Head>第8条（免責事項）</Head>
        運営者の債務不履行責任は、運営者の故意または重過失によらない場合には免責されるものとします。
        <br />
        運営者は、何らかの理由によって責任を負う場合にも、通常生じうる損害の範囲内においてのみ賠償の責任を負うものとします。
        <br />
        運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
        <Spacer height='50' />

        <Head>第9条（サービス内容の変更等）</Head>
        運営者は、本サービスの内容の変更または本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
        <Spacer height='50' />

        <Head>第10条（利用規約の変更）</Head>
        運営者は、必要と判断した場合には、いつでも本規約を変更することができるものとします。
        <Spacer height='50' />

        <Head>第11条（通知または連絡）</Head>
        ユーザーと運営者との間の通知または連絡は、本サービス内の各表示、Googleフォーム、SNSアカウント、電子メールを通じて行うものとします。
        <br />
        運営者は、ユーザーに適切な通知を行うよう務めますが、ユーザーの認識に関わらず、最新の通知および本規約に基づき運営を行います。
        <Spacer height='50' />

        <Head>第12条（準拠法・裁判管轄）</Head>
        本規約の解釈にあたっては、日本法を準拠法とします。
        <br />
        本サービスに関して紛争が生じた場合には、東京地方裁判所を専属的合意管轄裁判所とします。
        <Spacer height='100' />
      </ContainerSpacer>
    </PlainText>
  </div>
)

export default TermsOfUse

const bodyStyle = css({
  maxWidth: '1280px',
  margin: 'auto',
})