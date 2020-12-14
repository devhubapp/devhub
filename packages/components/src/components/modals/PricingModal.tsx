import { constants, Plan, PlanID } from '@devhub/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, FlatListProps, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import { useReduxState } from '../../hooks/use-redux-state'
import { Browser } from '../../libs/browser'
import { bugsnag } from '../../libs/bugsnag'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import { usePlans } from '../context/PlansContext'
import {
  defaultPricingBlockWidth,
  PricingPlanBlock,
} from './partials/PricingPlanBlock'

export interface PricingModalProps {
  highlightFeature?: keyof Plan['featureFlags']
  initialSelectedPlanId?: PlanID | undefined
  showBackButton: boolean
}

const allowChangePlansOnThisApp = false

export function PricingModal(props: PricingModalProps) {
  const {
    highlightFeature: _highlightFeature,
    initialSelectedPlanId,
    showBackButton,
  } = props

  const flatListRef = useRef<FlatList<Plan | undefined>>(null)
  const { sizename } = useAppLayout()
  const hasCalledOnLayoutRef = useRef(false)
  const dispatch = useDispatch()
  const appToken = useReduxState(selectors.appTokenSelector)
  const userPlan = useReduxState(selectors.currentUserPlanSelector)
  const columnCount = useReduxState(selectors.columnCountSelector)
  const columnWidth = useColumnWidth()

  const { freePlan, plans, paidPlans, userPlanInfo } = usePlans()

  const plansToShow = freePlan && !freePlan.trialPeriodDays ? plans : paidPlans

  const highlightFeature: PricingModalProps['highlightFeature'] =
    _highlightFeature ||
    (userPlan && columnCount >= userPlan.featureFlags.columnsLimit
      ? 'columnsLimit'
      : undefined)

  const userPlanStillExist = !!(
    userPlan &&
    userPlan.id &&
    plansToShow.find((p) => p && p.id === userPlan.id)
  )

  const showUserPlanAtTheTop = !!userPlanInfo
  /*
    userPlan &&
    ((userPlanInfo &&
      (userPlanInfo.amount ||
        (userPlanInfo.trialPeriodDays && !isPlanExpired(userPlan))) &&
      !userPlanStillExist) ||
      userPlan.cancelAt ||
      userPlan.type === 'team')
  */

  const [_selectedPlanId, setSelectedPlanId] = useState<PlanID | undefined>(
    undefined,
  )
  const selectedPlanId =
    _selectedPlanId ||
    (initialSelectedPlanId &&
    plansToShow.find((p) => p && p.id === initialSelectedPlanId)
      ? initialSelectedPlanId
      : undefined) ||
    (_highlightFeature &&
    plansToShow.find((p) => p && p.featureFlags[_highlightFeature] === true)
      ? plansToShow.find(
          (p) => p && p.featureFlags[_highlightFeature] === true,
        )!.id
      : undefined) ||
    (userPlan && userPlanStillExist && userPlan.id) ||
    undefined

  const selectedPlan =
    selectedPlanId && plansToShow.find((p) => p && p.id === selectedPlanId)

  const scrollToPlan = useCallback(
    (planId: PlanID | undefined) => {
      if (!flatListRef.current) return

      const index = plansToShow.findIndex((p) => p && p.id === planId)
      if (!(index >= 0 && index < plansToShow.length)) return

      flatListRef.current.scrollToOffset({
        animated: hasCalledOnLayoutRef.current,
        offset: Math.max(
          0,
          index * defaultPricingBlockWidth -
            (columnWidth - defaultPricingBlockWidth) / 2,
        ),
      })
    },
    [plansToShow],
  )

  const appTokenRef = useDynamicRef(appToken)
  useEffect(() => {
    if (allowChangePlansOnThisApp) return

    dispatch(actions.closeAllModals())
    Browser.openURLOnNewTab(
      `${constants.DEVHUB_LINKS.PRICING_PAGE}?appToken=${
        appTokenRef.current || ''
      }`,
    )
  }, [])

  useEffect(() => {
    scrollToPlan(selectedPlanId)
  }, [scrollToPlan, selectedPlanId])

  const getItemLayout = useCallback<
    NonNullable<FlatListProps<Plan | undefined>['getItemLayout']>
  >(
    (_data, index) => ({
      index,
      length: defaultPricingBlockWidth,
      offset: index * defaultPricingBlockWidth,
    }),
    [],
  )

  const onLayout = useCallback<
    NonNullable<FlatListProps<Plan | undefined>['onLayout']>
  >(() => {
    if (!hasCalledOnLayoutRef.current) {
      scrollToPlan(selectedPlanId)
      hasCalledOnLayoutRef.current = true
    }
  }, [scrollToPlan, selectedPlanId])

  const renderItem = useCallback<
    NonNullable<FlatListProps<Plan | undefined>['renderItem']>
  >(
    ({ item: plan }) =>
      plan && plan.amount > 0 ? (
        <PricingPlanBlock
          key={`pricing-plan-${plan.id}`}
          banner={
            plan && typeof plan.banner === 'boolean'
              ? plan.banner
              : (plan && plan.banner) || false
          }
          highlightFeature={highlightFeature}
          isSelected={selectedPlanId === plan.id}
          onSelect={() => {
            setSelectedPlanId(plan.id)
            scrollToPlan(plan.id)
          }}
          plan={plan}
          showCurrentPlanDetails={!showUserPlanAtTheTop}
          showFeatures
          totalNumberOfVisiblePlans={plansToShow.length}
        />
      ) : plan ? (
        <PricingPlanBlock
          key={`pricing-plan-${plan.cannonicalId}`}
          banner
          highlightFeature={highlightFeature}
          isSelected={selectedPlanId === plan.id}
          onSelect={() => {
            setSelectedPlanId(plan.id)
            scrollToPlan(plan.id)
          }}
          plan={plan}
          showCurrentPlanDetails={!showUserPlanAtTheTop}
          showFeatures
          totalNumberOfVisiblePlans={plansToShow.length}
        />
      ) : null,
    [
      selectedPlanId,
      highlightFeature,
      userPlan && userPlan.amount,
      showUserPlanAtTheTop,
      plansToShow.length > 1,
    ],
  )

  const CancelOrReactivateSubscriptionButton = !!(
    userPlan && userPlan.amount
  ) && (
    <ButtonLink
      analyticsCategory="manage"
      analyticsAction="manage"
      analyticsLabel="manage"
      href={`${constants.DEVHUB_LINKS.ACCOUNT_PAGE}?appToken=${appToken}`}
      openOnNewTab
      type="neutral"
    >
      Manage subscription ↗
    </ButtonLink>
  )
  /*
    userPlan && userPlan.cancelAtPeriodEnd && userPlan.cancelAt ? (
      <Button
        analyticsCategory="abort_cancellation"
        analyticsAction="abort_cancellation"
        analyticsLabel="abort_cancellation"
        onPress={async () => {
          const userPlanBK = { ...userPlan }
          try {
            dispatch(
              actions.updateUserData({
                plan: {
                  ...userPlan!,
                  cancelAt: undefined,
                  cancelAtPeriodEnd: false,
                },
              }),
            )

            const response = await axios.post<{
              data: { abortSubscriptionCancellation?: boolean }
              errors?: any[]
            }>(
              constants.GRAPHQL_ENDPOINT,
              {
                query: `
                  mutation {
                    abortSubscriptionCancellation
                  }`,
              },
              { headers: getDefaultDevHubHeaders({ appToken }) },
            )

            const { data, errors } = await response.data

            if (errors && errors[0] && errors[0].message)
              throw new Error(errors[0].message)

            if (!(data && data.abortSubscriptionCancellation)) {
              throw new Error('Failed to abort subscription cancellation.')
            }
          } catch (error) {
            console.error(error)
            bugsnag.notify(error)

            dispatch(
              actions.updateUserData({
                plan: {
                  ...userPlanBK!,
                  cancelAt: userPlanBK && userPlanBK.cancelAt,
                  cancelAtPeriodEnd: userPlanBK && userPlanBK.cancelAtPeriodEnd,
                },
              }),
            )

            Alert.alert(
              `Failed to abort subscription cancellation. Please contact support. \nError: ${error.message}`,
            )
          }
        }}
        type="neutral"
      >
        Abort subscription cancellation
      </Button>
    ) : (
      <Button
        analyticsCategory="downgrade"
        analyticsAction="downgrade"
        analyticsLabel="downgrade"
        onPress={() => {
          if (Platform.OS !== 'web') {
            Browser.openURLOnNewTab(
              `${constants.DEVHUB_LINKS.ACCOUNT_PAGE}?appToken=${appToken}`,
            )
            return
          }

          dispatch(
            actions.pushModal({
              name: 'SUBSCRIBE',
              params: { planId: undefined },
            }),
          )
        }}
        type="neutral"
      >
        Cancel subscription
      </Button>
    )
    */

  return (
    <ModalColumn
      name="PRICING"
      showBackButton={showBackButton}
      title="Subscribe"
    >
      <>
        {!!(showUserPlanAtTheTop && userPlanInfo) && (
          <>
            <SubHeader title="CURRENT PLAN" />

            <View style={{ paddingHorizontal: (contentPadding * 3) / 4 }}>
              <PricingPlanBlock
                key="pricing-current-plan"
                banner={false}
                plan={userPlanInfo}
                showCurrentPlanDetails
                totalNumberOfVisiblePlans={1}
                width="100%"
              />
            </View>

            <Spacer height={contentPadding} />

            {!!(userPlan && userPlan.amount) &&
              !(freePlan && !freePlan.trialPeriodDays) && (
                <>
                  <View style={sharedStyles.marginHorizontal}>
                    {CancelOrReactivateSubscriptionButton}
                  </View>

                  <Spacer height={contentPadding / 2} />
                </>
              )}
          </>
        )}

        {showUserPlanAtTheTop && !allowChangePlansOnThisApp ? (
          <View
            style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
          >
            <ButtonLink
              analyticsCategory="switch"
              analyticsAction="switch"
              analyticsLabel="switch"
              href={`${constants.DEVHUB_LINKS.PRICING_PAGE}?appToken=${appToken}`}
              openOnNewTab
              type="neutral"
            >
              {userPlan &&
              userPlan.amount &&
              paidPlans.some((p) => p && p.interval)
                ? 'Switch plan ↗'
                : 'See available options ↗'}
            </ButtonLink>
          </View>
        ) : (
          <>
            <Spacer height={contentPadding / 2} />

            <SubHeader
              title={
                userPlanInfo && userPlanInfo.amount
                  ? 'CHANGE PLAN'
                  : 'SELECT A PLAN'
              }
            />

            <FlatList
              ref={flatListRef}
              contentContainerStyle={{
                paddingHorizontal: (contentPadding * 3) / 4,
              }}
              data={plansToShow}
              extraData={selectedPlanId}
              getItemLayout={getItemLayout}
              horizontal
              onLayout={onLayout}
              onScrollToIndexFailed={onScrollToIndexFailed}
              renderItem={renderItem}
              style={[sharedStyles.flexNoGrow, sharedStyles.fullWidth]}
            />

            {sizename <= '2-medium' ? (
              <Spacer flex={1} minHeight={contentPadding * 2} />
            ) : (
              <Spacer height={contentPadding * 2} />
            )}

            <View
              style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
            >
              <Button
                analyticsCategory="subscribe"
                analyticsAction="subscribe"
                analyticsLabel="subscribe"
                disabled={!selectedPlan}
                onPress={() => {
                  if (!(selectedPlan && selectedPlan.id)) return

                  if (Platform.OS !== 'web' || selectedPlan.type === 'team') {
                    Browser.openURLOnNewTab(
                      `${constants.DEVHUB_LINKS.SUBSCRIBE_PAGE}?plan=${selectedPlan.cannonicalId}&appToken=${appToken}`,
                    )
                    return
                  }

                  dispatch(
                    actions.pushModal({
                      name: 'SUBSCRIBE',
                      params: { planId: selectedPlan.id },
                    }),
                  )
                }}
                type="primary"
              >
                {`${
                  selectedPlan
                    ? selectedPlan.amount > 0
                      ? userPlan && userPlan.id === selectedPlan.id
                        ? userPlan.type === 'team'
                          ? 'Update plan'
                          : 'Change credit card'
                        : 'Continue'
                      : userPlan && userPlan.amount > 0
                      ? 'Downgrade to free plan'
                      : 'Select another plan'
                    : 'Continue'
                }${
                  Platform.OS !== 'web' ||
                  (selectedPlan && selectedPlan.type === 'team')
                    ? ' ↗'
                    : ''
                }`}
              </Button>

              <Spacer height={contentPadding} />

              {!(freePlan && !freePlan.trialPeriodDays) &&
                !showUserPlanAtTheTop &&
                !!(userPlan && userPlan.amount) && (
                  <>
                    {CancelOrReactivateSubscriptionButton}
                    <Spacer height={contentPadding} />
                  </>
                )}
            </View>
          </>
        )}
      </>
    </ModalColumn>
  )
}

const onScrollToIndexFailed: NonNullable<
  FlatListProps<string>['onScrollToIndexFailed']
> = (info) => {
  console.error(info)
  bugsnag.notify({
    name: 'ScrollToIndexFailed',
    message: 'Failed to scroll to index',
    ...info,
  })
}
