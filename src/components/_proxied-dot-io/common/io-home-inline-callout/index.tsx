import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames'
import type { Products } from '@hashicorp/platform-product-meta'
import useProductMeta from '@hashicorp/platform-product-meta'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import s from './style.module.css'

export interface IoHomeInlineCalloutProps {
  link: string
  heading: string
  description: string
  cta: string
  thumbnail: {
    src: string
    width: number
    height: number
    alt: string
  }
}

export default function IoHomeInlineCallout({
  link,
  heading,
  description,
  cta = 'Learn more',
  thumbnail,
}: IoHomeInlineCalloutProps) {
  return (
    <Link href={link}>
      <a className={s.inlineCallout}>
        <div className={s.media}>
          <Image
            src={thumbnail.src}
            width={thumbnail.width}
            height={thumbnail.height}
            alt={thumbnail.alt}
          />
        </div>
        <div className={s.content}>
          <h2 className={s.heading}>{heading}</h2>
          <p className={s.description}>{description}</p>
          <span className={s.cta}>
            {cta} <IconArrowRight16 />
          </span>
        </div>
      </a>
    </Link>
  )
}
