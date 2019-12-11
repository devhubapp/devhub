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
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Spacer } from '../../common/Spacer'
import { ThemedIcon } from '../../themed/ThemedIcon'
import { ThemedText } from '../../themed/ThemedText'
import { ThemedTouchableOpacity } from '../../themed/ThemedTouchableOpacity'

export const defaultPricingBlockWidth = 230

export interface PricingPlanBlockProps {
  banner?: string | boolean
  highlightFeature?: keyof Plan['featureFlags']
  isSelected?: boolean | undefined
  onSelect?: (() => void) | undefined
  plan: Plan
  showCurrentPlanDetails: boolean
  showFeatures?: boolean
  totalNumberOfVisiblePlans: number
  width?: string | number
}

export function PricingPlanBlock(props: PricingPlanBlockProps) {
  const {
    banner: _banner,
    highlightFeature,
    isSelected,
    onSelect,
    plan,
    showCurrentPlanDetails,
    showFeatures,
    totalNumberOfVisiblePlans,
    width = defaultPricingBlockWidth,
  } = props

  const userPlan = useReduxState(selectors.currentUserPlanSelector)
  const isPlanExpired = useReduxState(selectors.isPlanExpiredSelector)

  const isMyPlan = userPlan && userPlan.id && userPlan!.id === plan.id
  const banner =
    isMyPlan && totalNumberOfVisiblePlans > 1
      ? plan.interval
        ? 'Current plan'
        : 'You bought this'
      : _banner

  const estimatedMonthlyPrice =
    (plan.interval === 'day'
      ? plan.amount * 30
      : plan.interval === 'week'
      ? plan.amount * 4
      : plan.interval === 'year'
      ? plan.amount / 12
      : plan.amount) /
    (plan.intervalCount || 1) /
    (plan.transformUsage && plan.transformUsage.divideBy > 1
      ? plan.transformUsage.divideBy
      : 1)

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

  const _priceLabel = formatPrice({ ...plan, amount: estimatedMonthlyPrice })
  const _cents = estimatedMonthlyPrice % 100
  const priceLabelWithoutCents =
    _cents && _priceLabel.endsWith(_cents.toString())
      ? _priceLabel.substring(0, _priceLabel.length - 3)
      : _priceLabel
  const priceLabelCents =
    _cents && _priceLabel.endsWith(_cents.toString())
      ? _priceLabel.substr(-3)
      : ''

  let footerText = ''

  if (
    (estimatedMonthlyPrice !== plan.amount ||
      (plan.transformUsage && plan.transformUsage.divideBy > 1)) &&
    !(isMyPlan && userPlan && userPlan.cancelAt && showCurrentPlanDetails)
  ) {
    footerText =
      footerText +
      `*Billed ${plan.amount % 100 > 50 ? '~' : ''}${formatPriceAndInterval({
        ...plan,
        amount:
          plan.amount % 100 > 50
            ? plan.amount + (100 - (plan.amount % 100))
            : plan.amount,
      })}`
  }

  if (isMyPlan && userPlan && userPlan.cancelAt && showCurrentPlanDetails) {
    footerText =
      footerText +
      `${footerText ? '\n\n' : ''}${getDateSmallText(userPlan.cancelAt, {
        pastPrefix: 'Cancelled: ',
        futurePrefix: 'Scheduled for cancellation: ',
        showPrefixOnFullDate: true,

        pastSuffix: '',
        futureSuffix: '',
        showSuffixOnFullDate: true,
      })}`
  } else if (
    isMyPlan &&
    userPlan &&
    userPlan.status &&
    (userPlan.status !== 'active' && userPlan.status !== 'trialing') &&
    showCurrentPlanDetails
  ) {
    footerText =
      footerText +
      `${footerText ? '\n\n' : ''}Status: ${userPlan.status}${
        userPlan.status === 'incomplete' ||
        userPlan.status === 'incomplete_expired'
          ? ' (failed to charge your card. please try again with a different one)'
          : ''
      }`
  } else if (
    isMyPlan &&
    userPlan &&
    userPlan.trialEndAt &&
    showCurrentPlanDetails
  ) {
    footerText =
      footerText +
      `${footerText ? '\n\n' : ''}${
        isPlanExpired ? 'Expired' : 'Expires'
      } ${getDateSmallText(userPlan.trialEndAt, {
        pastPrefix: '',
        futurePrefix: 'in',
        showPrefixOnFullDate: false,

        pastSuffix: 'ago',
        futureSuffix: '',
        showSuffixOnFullDate: false,
      })}`
  }

  return (
    <View
      style={[
        sharedStyles.fullWidth,
        sharedStyles.paddingHorizontalQuarter,
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
          <Spacer height={contentPadding} />

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

          <Spacer height={contentPadding} />

          {!!plan.description && (
            <>
              <ThemedText
                color="foregroundColorMuted65"
                style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
              >
                {totalNumberOfVisiblePlans === 1
                  ? plan.description.trim()
                  : plan.description}
              </ThemedText>

              <Spacer height={contentPadding / 2} />
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

          {!!(plan.amount || totalNumberOfVisiblePlans > 1) && (
            <>
              <ThemedText
                color="foregroundColorMuted65"
                style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
              >
                {`${
                  plan.type === 'team' ||
                  (plan.transformUsage && plan.transformUsage.divideBy > 1)
                    ? '/user'
                    : ''
                }${plan.interval ? '/month' : ''}${
                  estimatedMonthlyPrice !== plan.amount ? '*' : ''
                }` || ' '}
              </ThemedText>

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

              <Spacer height={contentPadding / 2} />
            </>
          )}

          <Spacer height={contentPadding} />

          {!!(footerText || totalNumberOfVisiblePlans > 1) && (
            <>
              <IntervalRefresh interval={1000}>
                {() => (
                  <ThemedText
                    color={
                      footerText && footerText.toLowerCase().includes('cancel')
                        ? 'red'
                        : 'foregroundColorMuted65'
                    }
                    style={[
                      sharedStyles.textCenter,
                      { fontSize: smallTextSize, fontStyle: 'italic' },
                    ]}
                  >
                    {footerText || ' '}
                  </ThemedText>
                )}
              </IntervalRefresh>

              <Spacer height={contentPadding} />
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
