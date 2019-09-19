import { activePlans, constants, Plan, PlanID } from '@devhub/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, FlatListProps, InteractionManager, View } from 'react-native'
import { useDispatch } from 'react-redux'

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
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import {
  defaultPricingBlockWidth,
  PricingPlanBlock,
} from './partials/PricingPlanBlock'

export interface PricingModalProps {
  highlightFeature?: keyof Plan['featureFlags']
  initialSelectedPlanId?: PlanID | undefined
  showBackButton: boolean
}

export function PricingModal(props: PricingModalProps) {
  const {
    highlightFeature: _highlightFeature,
    initialSelectedPlanId,
    showBackButton,
  } = props

  const flatListRef = useRef<FlatList<Plan>>(null)
  const { sizename } = useAppLayout()
  const isFirstPlanScrollRef = useRef(true)
  const dispatch = useDispatch()
  const appToken = useReduxState(selectors.appTokenSelector)
  const userPlan = useReduxState(selectors.currentUserPlanSelector)
  const columnCount = useReduxState(selectors.columnCountSelector)
  const columnWidth = useColumnWidth()

  const highlightFeature: PricingModalProps['highlightFeature'] =
    _highlightFeature ||
    (userPlan && columnCount >= userPlan.featureFlags.columnsLimit
      ? 'columnsLimit'
      : undefined)

  const [selectedPlanId, setSelectedPlanId] = useState<PlanID | undefined>(
    () =>
      (initialSelectedPlanId &&
      activePlans.find(p => p.id === initialSelectedPlanId)
        ? initialSelectedPlanId
        : undefined) ||
      (_highlightFeature &&
      activePlans.find(p => p.featureFlags[_highlightFeature] === true)
        ? activePlans.find(p => p.featureFlags[_highlightFeature] === true)!.id
        : undefined) ||
      (userPlan && userPlan.id) ||
      (activePlans.find(p => p.amount > 0) &&
        activePlans.find(p => p.amount > 0)!.id) ||
      undefined,
  )

  const selectedPlan =
    selectedPlanId && activePlans.find(p => p.id === selectedPlanId)

  const scrollToPlan = useCallback(
    (planId: PlanID | undefined) => {
      if (!flatListRef.current) return

      const index = activePlans.findIndex(p => p.id === planId)
      if (!(index >= 0 && index < activePlans.length)) return

      flatListRef.current.scrollToOffset({
        animated: !isFirstPlanScrollRef.current,
        offset: Math.max(
          0,
          index * defaultPricingBlockWidth -
            (columnWidth - defaultPricingBlockWidth) / 2,
        ),
      })
      isFirstPlanScrollRef.current = false
    },
    [activePlans],
  )

  useEffect(() => {
    scrollToPlan(selectedPlanId)

    InteractionManager.runAfterInteractions(() => {
      scrollToPlan(selectedPlanId)
    })
  }, [scrollToPlan, selectedPlanId])

  const getItemLayout = useCallback<
    NonNullable<FlatListProps<Plan>['getItemLayout']>
  >(
    (_data, index) => ({
      index,
      length: defaultPricingBlockWidth,
      offset: index * defaultPricingBlockWidth,
    }),
    [],
  )

  const renderItem = useCallback<
    NonNullable<FlatListProps<Plan>['renderItem']>
  >(
    ({ item: plan }) =>
      plan.amount > 0 ? (
        <PricingPlanBlock
          key={`pricing-plan-${plan.id}`}
          banner={plan.cannonicalId === 'pro' ? 'Recommended' : true}
          highlightFeature={highlightFeature}
          isSelected={selectedPlanId === plan.id}
          onSelect={() => {
            setSelectedPlanId(plan.id)
            scrollToPlan(plan.id)
          }}
          plan={plan}
          showFeatures
        />
      ) : (
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
          showFeatures
        />
      ),
    [selectedPlanId, highlightFeature],
  )

  return (
    <ModalColumn
      name="PRICING"
      showBackButton={showBackButton}
      title="Unlock features"
    >
      <FullHeightScrollView style={sharedStyles.flex}>
        <SubHeader title="SELECT A PLAN" />

        <Spacer height={contentPadding} />

        <FlatList
          ref={flatListRef}
          contentContainerStyle={sharedStyles.paddingHorizontalHalf}
          data={activePlans}
          extraData={selectedPlanId}
          getItemLayout={getItemLayout}
          horizontal
          onScrollToIndexFailed={onScrollToIndexFailed}
          renderItem={renderItem}
          style={[sharedStyles.flexNoGrow, sharedStyles.fullWidth]}
        />

        {sizename <= '2-medium' ? (
          <Spacer flex={1} minHeight={contentPadding * 2} />
        ) : (
          <Spacer height={contentPadding * 2} />
        )}

        <View style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}>
          <Button
            analyticsCategory="subscribe"
            analyticsAction="subscribe"
            analyticsLabel="subscribe"
            disabled={
              !selectedPlan || selectedPlan.id === (userPlan && userPlan.id)
            }
            onPress={() => {
              if (!(selectedPlan && selectedPlan.id)) return

              if (Platform.OS !== 'web') {
                Browser.openURLOnNewTab(
                  `${constants.DEVHUB_LINKS.SUBSCRIBE_PAGE}?plan=${
                    selectedPlan.cannonicalId
                  }&appToken=${appToken}`,
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
            {selectedPlan
              ? selectedPlan.amount > 0
                ? userPlan && userPlan.id === selectedPlan.id
                  ? 'You are on this plan'
                  : 'Continue'
                : userPlan && userPlan.amount > 0
                ? 'Downgrade to free plan'
                : 'Select another plan'
              : 'Select a plan'}
          </Button>
        </View>

        <Spacer height={contentPadding} />
      </FullHeightScrollView>
    </ModalColumn>
  )
}

const onScrollToIndexFailed: NonNullable<
  FlatListProps<string>['onScrollToIndexFailed']
> = info => {
  console.error(info)
  bugsnag.notify({
    name: 'ScrollToIndexFailed',
    message: 'Failed to scroll to index',
    ...info,
  })
}
