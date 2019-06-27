import React from 'react'

import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'
import { Button, ButtonProps } from './Button'
import { Link, LinkProps } from './Link'

export interface ButtonLinkProps extends Omit<ButtonProps, 'onPress'> {
  href?: LinkProps['href']
  openOnNewTab?: LinkProps['openOnNewTab']
}

export const ButtonLink = React.memo((props: ButtonLinkProps) => {
  const { href, openOnNewTab, ...otherProps } = props

  if (Platform.OS === 'web' && href) {
    return (
      <Link
        analyticsLabel={otherProps.analyticsLabel}
        href={href}
        openOnNewTab={openOnNewTab}
      >
        <Button
          {...otherProps}
          analyticsLabel={undefined}
          onPress={undefined}
        />
      </Link>
    )
  }

  return (
    <Button
      {...otherProps}
      onPress={
        href
          ? href.startsWith('http')
            ? () => Browser.openURL(href)
            : () => Linking.openURL(href)
          : undefined
      }
    />
  )
})

ButtonLink.displayName = 'ButtonLink'
