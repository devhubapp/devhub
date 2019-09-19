import React from 'react'
import { Platform, Text, View } from 'react-native'

import { formatPrice, Plan } from '@devhub/core'
import { useReduxState } from '../../../hooks/use-redux-state'
import * as selectors from '../../../redux/selectors'
import { sharedStyles } from '../../../styles/shared'
import {
  contentPadding,
  normalTextSize,
  radius,
  smallTextSize,
} from '../../../styles/variables'
import { Checkbox } from '../../common/Checkbox'
import { Spacer } from '../../common/Spacer'
import { ThemedIcon } from '../../themed/ThemedIcon'
import { ThemedText } from '../../themed/ThemedText'
import { ThemedTouchableOpacity } from '../../themed/ThemedTouchableOpacity'

export const defaultPricingBlockWidth = 220

export interface PricingPlanBlockProps {
  banner?: string | boolean
  highlightFeature?: keyof Plan['featureFlags']
  isSelected?: boolean | undefined
  onSelect?: (() => void) | undefined
  plan: Plan
  showFeatures?: boolean
  width?: string | number
}

export function PricingPlanBlock(props: PricingPlanBlockProps) {
  const {
    banner: _banner,
    highlightFeature,
    isSelected,
    onSelect,
    plan,
    showFeatures,
    width = defaultPricingBlockWidth,
  } = props

  const userPlan = useReduxState(selectors.currentUserPlanSelector)

  const banner =
    userPlan && userPlan.id && userPlan!.id === plan.id
      ? 'Current plan'
      : _banner

  return (
    <View
      style={[
        sharedStyles.fullWidth,
        sharedStyles.paddingHorizontalHalf,
        { width },
      ]}
    >
      <ThemedTouchableOpacity
        backgroundColor="backgroundColorMore1"
        borderColor={
          isSelected ? 'primaryBackgroundColor' : 'backgroundColorLess1'
        }
        onPress={onSelect ? () => onSelect() : undefined}
        style={[
          { borderWidth: 1, borderRadius: radius },
          isSelected && Platform.select({ web: { cursor: 'default' } }),
        ]}
      >
        {banner === true ? (
          <Text
            style={[
              sharedStyles.paddingHorizontal,
              sharedStyles.textCenter,
              { paddingVertical: contentPadding / 3, fontWeight: '600' },
            ]}
          >
            {' '}
          </Text>
        ) : banner ? (
          <ThemedText
            backgroundColor={
              isSelected ? 'primaryBackgroundColor' : 'backgroundColorLess1'
            }
            color={isSelected ? 'primaryForegroundColor' : 'foregroundColor'}
            style={[
              sharedStyles.paddingHorizontal,
              sharedStyles.textCenter,
              { paddingVertical: contentPadding / 3, fontWeight: '600' },
            ]}
          >
            {banner}
          </ThemedText>
        ) : null}

        <View
          style={[
            sharedStyles.fullWidth,
            sharedStyles.paddingHorizontal,
            sharedStyles.center,
          ]}
        >
          <Spacer height={contentPadding * 2} />

          <ThemedText
            color="foregroundColor"
            style={[
              sharedStyles.fullWidth,
              sharedStyles.textCenter,
              {
                lineHeight: normalTextSize + 6,
                fontSize: normalTextSize,
                fontWeight: '800',
              },
            ]}
          >
            {plan.label}
          </ThemedText>

          <Spacer height={contentPadding / 2} />

          <ThemedText
            color="foregroundColorMuted65"
            style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
          >
            {plan.description}
          </ThemedText>

          <Spacer height={contentPadding} />

          <ThemedText
            color="foregroundColor"
            style={[
              sharedStyles.textCenter,
              {
                lineHeight: normalTextSize + 30,
                fontSize: normalTextSize + 30,
                fontWeight: '800',
              },
            ]}
          >{`${formatPrice(plan.amount, plan.currency)}`}</ThemedText>

          <Spacer height={contentPadding / 3} />

          {plan.interval ? (
            <ThemedText
              color="foregroundColorMuted65"
              style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
            >{`/${plan.interval}`}</ThemedText>
          ) : (
            <ThemedText
              color="foregroundColorMuted65"
              style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
            >
              {' '}
            </ThemedText>
          )}

          <Spacer height={contentPadding * 2} />

          {!!onSelect && (
            <>
              <Checkbox
                checked={isSelected}
                circle
                containerStyle={sharedStyles.alignSelfCenter}
                onChange={onSelect ? () => onSelect() : undefined}
              />

              <Spacer height={contentPadding * 2} />
            </>
          )}
        </View>
      </ThemedTouchableOpacity>

      {!!(showFeatures && plan.featureLabels && plan.featureLabels.length) && (
        <View style={[sharedStyles.fullWidth, sharedStyles.padding]}>
          {plan.featureLabels.map((feature, index) => (
            <View
              key={`pricing-plan-${plan.id}-feature-${index}`}
              style={sharedStyles.horizontal}
            >
              <ThemedIcon
                color={
                  feature.available
                    ? 'primaryBackgroundColor'
                    : 'foregroundColorMuted65'
                }
                name="check"
                style={[
                  { lineHeight: normalTextSize + (contentPadding * 3) / 4 },
                  feature.available
                    ? sharedStyles.opacity100
                    : sharedStyles.opacity0,
                ]}
              />

              <Spacer width={contentPadding / 2} />

              <ThemedText
                color={
                  feature.available
                    ? highlightFeature === feature.id
                      ? 'primaryBackgroundColor'
                      : 'foregroundColor'
                    : highlightFeature === feature.id
                    ? 'red'
                    : 'foregroundColorMuted65'
                }
                style={[
                  { lineHeight: normalTextSize + (contentPadding * 3) / 4 },
                  !feature.available && { textDecorationLine: 'line-through' },
                ]}
              >
                {feature.label}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
