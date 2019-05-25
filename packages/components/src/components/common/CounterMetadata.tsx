import React, { Fragment } from 'react'
import { StyleSheet } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { contentPadding, radius, smallerTextSize } from '../../styles/variables'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export interface CounterMetadataProps {
  alwaysRenderANumber?: boolean
  read?: number | undefined
  total?: number | undefined
  unread?: number | undefined
}

interface NumberMetadata {
  key: string
  number: number | string
  color: keyof ThemeColors
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
  const { alwaysRenderANumber, read, total, unread } = props

  const firstNumberMetadata: NumberMetadata | undefined =
    unread !== undefined && unread > 0
      ? {
          key: 'unread',
          number: formatNumber(unread),
          color: 'foregroundColor',
        }
      : read !== undefined && read > 0
      ? {
          key: 'read',
          number: formatNumber(read),
          color: 'foregroundColorMuted40',
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
          color: 'foregroundColorMuted40',
        } as NumberMetadata)
      : undefined,
  ].filter(Boolean)

  if (!(numberNodesMetadata.length > 0)) {
    if (alwaysRenderANumber) {
      numberNodesMetadata.push({
        key: 'zero',
        number: formatNumber(0),
        color: 'foregroundColorMuted40',
      })
    } else {
      return null
    }
  }

  return (
    <ThemedView backgroundColor="backgroundColorLess2" style={styles.container}>
      {numberNodesMetadata.map(
        (meta, index) =>
          !!meta && (
            <Fragment key={meta.key}>
              {index > 0 && (
                <ThemedText
                  color="foregroundColorMuted40"
                  style={styles.separator}
                >
                  /
                </ThemedText>
              )}

              <ThemedText color={meta.color} style={styles.number}>
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
