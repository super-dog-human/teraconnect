import React from 'react'
import PageLink from '../../pageLink'

const LessonLink = ({ status, lessonID, viewKey, children }) => (
  <>
    {status === 'draft' &&
      <>{children}</>
    }
    {status === 'limited' &&
      <PageLink path={`/lessons/${lessonID}?view_key=${viewKey}`}>
        {children}
      </PageLink>
    }
    {status === 'public' &&
      <PageLink path={'/lessons/' + lessonID}>
        {children}
      </PageLink>
    }
  </>
)

export default LessonLink