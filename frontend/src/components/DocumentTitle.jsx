import { useEffect } from 'react'

export default function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title ? `${title} · ACME Pay` : 'ACME Pay'
  }, [title])
  return null
}
