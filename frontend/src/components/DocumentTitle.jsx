import { useEffect } from 'react'

export default function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title ? `${title} · PayLens` : 'PayLens'
  }, [title])
  return null
}
