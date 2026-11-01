import { Fragment, type ReactNode } from 'react'

/** Renders `*words*` in a content string as <em>, the serif accent face. */
export function Emphasis({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, index) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
      <em key={index}>{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  )
}

/** Link text that rolls up to a copy of itself on hover or focus. */
export function RollingText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll__track">
        <span className="roll__text">{children}</span>
        <span className="roll__text" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  )
}

type LabelProps = {
  index: string
  children: ReactNode
  /** Render as the section heading when the section has no other title. */
  as?: 'p' | 'h2'
  id?: string
}

/** Section eyebrow, e.g. "(01) —— About". */
export function SectionLabel({ index, children, as: Tag = 'p', id }: LabelProps) {
  return (
    <Tag className="section-label" id={id}>
      <span className="section-label__index" aria-hidden="true">
        ({index})
      </span>
      <span className="section-label__rule" aria-hidden="true" />
      <span>{children}</span>
    </Tag>
  )
}
