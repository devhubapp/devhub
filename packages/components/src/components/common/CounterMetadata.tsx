import React, { Fragment } from 'react'
import { StyleSheet } from 'react-native'

import { ThemeColors } from '@devhub/core'
import {
  contentPadding,
  mutedOpacity,
  radius,
  smallerTextSize,
} from '../../styles/variables'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export interface CounterMetadataProps {
  alwaysRenderANumber?: boolean
  backgroundColor?: keyof ThemeColors
  foregroundColor?: keyof ThemeColors
  read?: number | undefined
  total?: number | undefined
  unread?: number | undefined
}

interface NumberMetadata {
  key: string
  number: number | string
  color: keyof ThemeColors
  opacity: number
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius,
    paddingVertical: contentPadding / 8,
    paddingHorizontal: contentPadding / 2,
  },

  number: {
    fontSize: smallerTextSize,
  },

  separator: {
    fontSize: smallerTextSize,
    paddingHorizontal: contentPadding / 4,
  },
})

export function CounterMetadata(props: CounterMetadataProps) {
  const {
    alwaysRenderANumber,
    backgroundColor = 'backgroundColorLess2',
    read,
    total,
    unread,
  } = props

  const isCustomBackground = !(
    backgroundColor && backgroundColor.startsWith('backgroundColor')
  )
  const mutedColorOpacity = isCustomBackground ? mutedOpacity : 1
  const foregroundMutedColor = isCustomBackground
    ? 'foregroundColor'
    : 'foregroundColorMuted40'

  const firstNumberMetadata: NumberMetadata | undefined =
    unread !== undefined && unread > 0
      ? {
          key: 'unread',
          number: formatNumber(unread),
          color: 'foregroundColor',
          opacity: 1,
        }
      : read !== undefined && read > 0
      ? {
          key: 'read',
          number: formatNumber(read),
          color: foregroundMutedColor,
          opacity: mutedColorOpacity,
        }
      : undefined

  const numberNodesMetadata: Array<NumberMetadata | undefined> = [
    firstNumberMetadata,
    total !== undefined &&
    total > 0 &&
    !(firstNumberMetadata && total === firstNumberMetadata.number)
      ? ({
          key: 'total',
          number: formatNumber(total),
          color: foregroundMutedColor,
          opacity: mutedColorOpacity,
        } as NumberMetadata)
      : undefined,
  ].filter(Boolean)

  if (!(numberNodesMetadata.length > 0)) {
    if (alwaysRenderANumber) {
      numberNodesMetadata.push({
        key: 'zero',
        number: formatNumber(0),
        color: foregroundMutedColor,
        opacity: mutedColorOpacity,
      })
    } else {
      return null
    }
  }

  return (
    <ThemedView backgroundColor={backgroundColor} style={styles.container}>
      {numberNodesMetadata.map(
        (meta, index) =>
          !!meta && (
            <Fragment key={meta.key}>
              {index > 0 && (
                <ThemedText
                  color={foregroundMutedColor}
                  style={[styles.separator, { opacity: mutedColorOpacity }]}
                  themeTransformer={
                    isCustomBackground ? 'force-dark' : undefined
                  }
                >
                  /
                </ThemedText>
              )}

              <ThemedText
                color={meta.color}
                style={[styles.number, { opacity: meta.opacity }]}
                themeTransformer={isCustomBackground ? 'force-dark' : undefined}
              >
                {meta.number}
              </ThemedText>
            </Fragment>
          ),
      )}
    </ThemedView>
  )
}

// return max of 4 digits to not overflow UI
function formatNumber(n: number | undefined) {
  if (typeof n !== 'number' || n < 0) return 0

  if (n < 10000) return n

  const thousands = Math.floor(n / 1000)
  return `${Math.min(thousands, 99)}k+`
}
