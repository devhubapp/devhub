import {
  formatPrice,
  formatPriceAndInterval,
  getDateSmallText,
  Plan,
} from '@devhub/core'
import React from 'react'
import { Platform, Text, View } from 'react-native'

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
  isPartOfAList: boolean
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
    isPartOfAList,
    isSelected,
    onSelect,
    plan,
    showFeatures,
    width = defaultPricingBlockWidth,
  } = props

  const userPlan = useReduxState(selectors.currentUserPlanSelector)
  const isPlanExpired = useReduxState(selectors.isPlanExpiredSelector)

  const isMyPlan = userPlan && userPlan.id && userPlan!.id === plan.id
  const banner = isMyPlan && isPartOfAList ? 'Current plan' : _banner

  const estimatedMonthlyPrice =
    (plan.interval === 'day'
      ? plan.amount * 30
      : plan.interval === 'week'
      ? plan.amount * 4
      : plan.interval === 'year'
      ? plan.amount / 12
      : plan.amount) / (plan.intervalCount || 1)

  const planLabel = `${plan.label || ''}${
    !isMyPlan
      ? ''
      : userPlan && userPlan.status === 'trialing'
      ? (plan.label || '').toLowerCase().includes('trial')
        ? ''
        : userPlan.amount
        ? ` (trial${isPlanExpired ? ' expired' : ''})`
        : ` trial${isPlanExpired ? ' (expired)' : ''}`
      : ''
  }`

  const _priceLabel = formatPrice(estimatedMonthlyPrice, plan)
  const _cents = estimatedMonthlyPrice % 100
  const priceLabelWithoutCents =
    _cents && _priceLabel.endsWith(_cents.toString())
      ? _priceLabel.substring(0, _priceLabel.length - 3)
      : _priceLabel
  const priceLabelCents =
    _cents && _priceLabel.endsWith(_cents.toString())
      ? _priceLabel.substr(-3)
      : ''

  const additionalFooterText = isPartOfAList
    ? undefined
    : userPlan && userPlan.trialEndAt && isMyPlan
    ? `${isPlanExpired ? 'Expired' : 'Expires'} ${getDateSmallText(
        userPlan.trialEndAt,
        {
          pastPrefix: '',
          futurePrefix: 'in',
          showPrefixOnFullDate: false,

          pastSuffix: 'ago',
          futureSuffix: '',
          showSuffixOnFullDate: false,
        },
      )}`
    : undefined

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
            {planLabel}
          </ThemedText>

          <Spacer height={contentPadding / 2} />

          {!!(plan.description || isPartOfAList) && (
            <>
              <ThemedText
                color="foregroundColorMuted65"
                style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
              >
                {plan.description}
              </ThemedText>

              <Spacer height={contentPadding} />
            </>
          )}

          <ThemedText
            color="foregroundColor"
            style={[
              sharedStyles.textCenter,
              {
                height: normalTextSize + 40,
                lineHeight: normalTextSize + 40,
                fontSize: normalTextSize + 30,
                fontWeight: '800',
              },
            ]}
          >
            <Text>{`${priceLabelWithoutCents}`}</Text>
            {!!priceLabelCents && (
              <Text style={{ fontSize: normalTextSize }}>
                {priceLabelCents}
              </Text>
            )}
          </ThemedText>

          <Spacer height={contentPadding / 3} />

          {!!(plan.amount || isPartOfAList) && (
            <>
              <ThemedText
                color="foregroundColorMuted65"
                style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
              >{`/month${
                estimatedMonthlyPrice !== plan.amount ? '*' : ''
              }`}</ThemedText>

              {/* {plan.interval ? (
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
          )} */}

              <Spacer height={contentPadding} />
            </>
          )}

          <Spacer height={contentPadding} />

          {!!(
            estimatedMonthlyPrice !== plan.amount ||
            additionalFooterText ||
            isPartOfAList
          ) && (
            <>
              <ThemedText
                color="foregroundColorMuted65"
                style={[
                  sharedStyles.textCenter,
                  { fontSize: smallTextSize, fontStyle: 'italic' },
                ]}
              >
                {estimatedMonthlyPrice !== plan.amount
                  ? `*Billed ${formatPriceAndInterval(plan.amount, plan)}${
                      additionalFooterText ? `\n\n${additionalFooterText}` : ''
                    }`
                  : additionalFooterText || ' '}
              </ThemedText>

              <Spacer height={contentPadding * 2} />
            </>
          )}

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
