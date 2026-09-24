import React from 'react'
import { Icon } from '@adminjs/design-system'
import { useLocation, useNavigate } from 'react-router'

function adminRoot(pathname) {
  const cut = pathname.search(/\/(resources|pages)(\/|$)/)
  const root = cut === -1 ? pathname : pathname.slice(0, cut)
  return root.replace(/\/$/, '') || '/'
}

export default function SidebarResourceSection(props) {
  const Original = props.OriginalComponent
  const location = useLocation()
  const navigate = useNavigate()
  const href = adminRoot(location.pathname)
  const selected = location.pathname.replace(/\/$/, '') === href.replace(/\/$/, '') || location.pathname === `${href}/`

  return (
    <>
      <a
        className={`tokri-sidebar-dashboard${selected ? ' is-active' : ''}`}
        href={href}
        onClick={(event) => {
          event.preventDefault()
          navigate(href)
        }}
      >
        <Icon icon="Home" />
        <span>Dashboard</span>
      </a>
      {Original ? <Original resources={props.resources} /> : null}
    </>
  )
}
