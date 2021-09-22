/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import ContainerSpacer from '../components/containerSpacer'
import Flex from '../components/flex'
import Select from '../components/form/select'
import PlainText from '../components/plainText'
import PageLink from '../components/pageLink'
import Spacer from '../components/spacer'
import useSubjects from '../libs/hooks/lesson/useSubjects'

const Page = () => {
  const { selectRef, selectOptions, subjects, handleSubjectChange } = useSubjects()

  const selectBarStyle = css({
    position: 'fixed',
    opacity: selectOptions.length > 0 ? 1 : 0,
    width: '100%',
    backgroundColor: 'var(--bg-light-gray)',
  })

  return (
    <>
      <Head>
        <title>教科・単元から授業を探す - TERACONNECT</title>
      </Head>
      <Layout>
        <div css={backgroundStyle}>
          <div css={bodyStyle}>
            <div css={selectBarStyle}>
              <Container width='300'>
                <ContainerSpacer left='20'>
                  <Spacer height='20' />
                  <Flex alignItems='center'>
                    <PlainText size='20' color='gray' whiteSpace='nowrap'>教科</PlainText>
                    <Spacer width='20' />
                    <Select size='25' topLabel='' color='gray' options={selectOptions} onChange={handleSubjectChange} ref={selectRef} />
                  </Flex>
                  <Spacer height='20' />
                </ContainerSpacer>
              </Container>
            </div>

            <Spacer height='70' />

            {subjects && subjects.map((s, i) => {
              let groupName = ''

              return (
                <div key={i}>
                  <ContainerSpacer top='20' bottom='20' left='20' right='20'>
                    <div>
                      <a id={'subject-' + s.subject.id}>
                        <PlainText size='45' lineHeight='45' color='var(--border-dark-gray)'>{s.subject.japaneseName}</PlainText>
                      </a>
                    </div>

                    {s.categories.map((categoryForGroup, i) => {
                      const isNewGroup = groupName !== categoryForGroup.groupName
                      if (isNewGroup) {
                        groupName = categoryForGroup.groupName
                      } else {
                        return // グループ単位でレンダリングするため、次のグループになるまで何もしない
                      }

                      const categories = []
                      s.categories.slice(i).some(c => {
                        if (c.groupName === groupName) {
                          categories.push(c)
                          return false
                        } else {
                          return true
                        }
                      })

                      return (
                        <div key={i}>
                          <ContainerSpacer top='20' bottom='20'>
                            <PlainText size='28' color='var(--border-dark-gray)' lineHeight='25'>{categoryForGroup.groupName}</PlainText>
                          </ContainerSpacer>
                          <Flex flexDirection='column' gap='15px'>
                            {categories.map((category, i) => (
                              <div key={i}>
                                <PageLink path={`/lessons?subject_id=${s.subject.id}&category_id=${category.id}`} key={i}>
                                  <PlainText size='22' color='gray' lineHeight='25'>{category.name}</PlainText>
                                </PageLink>
                              </div>
                            ))}
                          </Flex>
                          <Spacer height='30' />
                        </div>
                      )
                    })}
                  </ContainerSpacer>
                </div>
              )
            })}
          </div>
        </div>
      </Layout>
    </>
  )
}

const backgroundStyle = css({
  width: '100%',
  minHeight: 'calc(100vh - 60px)',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const bodyStyle = css({
  maxWidth: '1280px',
  height: '100%',
  margin: 'auto',
})

export default Page