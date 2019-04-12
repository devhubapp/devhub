import _ from 'lodash'
import React, {
  Fragment,
  RefObject,
  useCallback,
  useRef,
  useState,
} from 'react'
import { Keyboard, ScrollView, View } from 'react-native'

import {
  ActivityColumn,
  ActivityColumnSubscription,
  AddColumnDetailsPayload,
  ColumnFilters,
  ColumnParamField,
  ColumnSubscription,
  createSubscriptionObjectsWithId,
  guid,
  IssueOrPullRequestColumn,
  IssueOrPullRequestColumnSubscription,
  NotificationColumn,
  NotificationColumnSubscription,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { findNode } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import {
  SpringAnimatedTextInput,
  SpringAnimatedTextInputProps,
} from '../common/TextInput'

interface AddColumnDetailsModalProps extends AddColumnDetailsPayload {
  showBackButton: boolean
}

interface FieldDetails {
  title: string
  field: ColumnParamField
  placeholder: string
  ref: RefObject<SpringAnimatedTextInput>
}

const fields: FieldDetails[] = [
  {
    title: 'Organization',
    field: 'org',
    placeholder: 'E.g: facebook',
    ref: React.createRef(),
  },
  {
    title: 'Owner',
    field: 'owner',
    placeholder: 'E.g: facebook',
    ref: React.createRef(),
  },

  {
    title: 'Repository',
    field: 'repo',
    placeholder: 'E.g: react',
    ref: React.createRef(),
  },
  {
    title: 'Username',
    field: 'username',
    placeholder: 'E.g: brunolemos',
    ref: React.createRef(),
  },
]

export const AddColumnDetailsModal = React.memo(
  (props: AddColumnDetailsModalProps) => {
    const {
      defaultFilters,
      defaultParams,
      icon,
      isPrivateSupported,
      paramList,
      showBackButton,
      subscription,
      title,
    } = props

    const didAutoFocusRef = useRef(false)

    const [params, setParams] = useState({
      all: true,
      org: '',
      owner: '',
      repo: '',
      username: '',
      ...defaultParams,
    })

    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const username = useReduxState(selectors.currentGitHubUsernameSelector)

    const addColumnAndSubscriptions = useReduxAction(
      actions.addColumnAndSubscriptions,
    )
    const closeAllModals = useReduxAction(actions.closeAllModals)

    const validateField = (field: ColumnParamField) => {
      const value = params[field]
      return !(typeof value === 'undefined' || value === '')
    }

    const handleCreateColumn = () => {
      for (const field of paramList) {
        if (!validateField(field)) {
          const fieldDetails = fields.find(f => f.field === field)
          alert(`${fieldDetails ? fieldDetails.title : field} cannot be empty.`)
          return
        }
      }

      Keyboard.dismiss()

      closeAllModals()

      setTimeout(() => {
        _handleCreateColumn()
      }, 500)
    }

    const _handleCreateColumn = () => {
      let _params: ColumnSubscription['params']
      let _filters: ColumnFilters | undefined = defaultFilters

      if (subscription.type === 'issue_or_pr') {
        const _p = _.pick(params, paramList)

        _params = {
          repoFullName:
            _p.owner && _p.repo ? `${_p.owner}/${_p.repo}` : undefined,
          subjectType:
            subscription.subtype === 'ISSUES'
              ? 'Issue'
              : subscription.subtype === 'PULLS'
              ? 'PullRequest'
              : undefined,
        } as IssueOrPullRequestColumnSubscription['params']

        _filters = _filters || {}
        _filters.subjectTypes =
          _params.subjectType === 'Issue'
            ? { Issue: true }
            : _params.subjectType === 'PullRequest'
            ? { PullRequest: true }
            : undefined
      } else {
        _params = _.pick(params, paramList)
      }

      const subscriptions = createSubscriptionObjectsWithId([
        {
          ...(subscription as any),
          id: '',
          params: _params,
        },
      ])

      const column = {
        id: guid(),
        type: subscription.type,
        subscriptionIds: subscriptions.map(s => s.id),
        filters: _filters,
      } as typeof subscriptions extends ActivityColumnSubscription[]
        ? ActivityColumn
        : typeof subscriptions extends IssueOrPullRequestColumnSubscription[]
        ? IssueOrPullRequestColumn
        : typeof subscriptions extends NotificationColumnSubscription[]
        ? NotificationColumn
        : never

      addColumnAndSubscriptions({
        column,
        subscriptions,
      })
    }

    const createTextInputChangeHandler = useCallback(
      (
        fieldDetails: FieldDetails,
      ): SpringAnimatedTextInputProps['onChange'] => e => {
        if (!(e && e.nativeEvent)) return
        const text = e.nativeEvent.text

        setParams(prevParams => ({
          ...prevParams,
          [fieldDetails.field]: text,
        }))
      },
      [],
    )

    const createTextInputSubmitHandler = useCallback(
      (
        fieldDetails: FieldDetails,
      ): SpringAnimatedTextInputProps['onSubmitEditing'] => () => {
        const index = paramList.findIndex(fd => fd === fieldDetails.field)

        if (index < paramList.length - 1) {
          if (!validateField(fieldDetails.field)) return

          const nextField = paramList[index + 1]
          const nextFieldDetails = fields.find(fd => fd.field === nextField)

          const input =
            nextFieldDetails &&
            nextFieldDetails.ref.current &&
            (findNode(nextFieldDetails.ref.current as any) as any)

          if (input && input.focus) {
            input.focus()
          }

          return
        }

        handleCreateColumn()
      },
      [params, paramList],
    )

    const renderTextInput = useCallback(
      (
        fieldDetails: FieldDetails,
        { autoFocus, ...textInputProps }: SpringAnimatedTextInputProps,
      ) => {
        // autofocus is breaking the react-spring animation
        // need to find a real fix (propably inside react-spring)
        // instead of this ugly workaround

        if (autoFocus && !didAutoFocusRef.current) {
          didAutoFocusRef.current = true
          setTimeout(() => {
            const input =
              fieldDetails &&
              fieldDetails.ref.current &&
              (findNode(fieldDetails.ref.current as any) as any)

            if (input && input.focus) {
              input.focus()
            }
          }, 500)
        }

        return (
          <Fragment key={`add-column-details-text-input-${fieldDetails.field}`}>
            <H3 withMargin>{fieldDetails.title}</H3>

            <SpringAnimatedTextInput
              ref={fieldDetails.ref}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              blurOnSubmit={false}
              placeholder={`${fieldDetails.placeholder || ''}`.replace(
                'brunolemos',
                username!,
              )}
              {...textInputProps}
              onChange={createTextInputChangeHandler(fieldDetails)}
              onSubmitEditing={createTextInputSubmitHandler(fieldDetails)}
              style={[
                { color: springAnimatedTheme.foregroundColor },
                textInputProps.style,
              ]}
              value={params[fieldDetails.field]}
            />

            <Spacer height={contentPadding} />
          </Fragment>
        )
      },
      [params, createTextInputChangeHandler, createTextInputSubmitHandler],
    )

    const renderField = (fieldDetails: FieldDetails, index?: number) => {
      if (!fieldDetails) return null

      return renderTextInput(fieldDetails, { autoFocus: index === 0 })
    }

    return (
      <ModalColumn
        iconName="plus"
        name="ADD_COLUMN_DETAILS"
        showBackButton={showBackButton}
        title="Add Column"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={sharedStyles.flex}
        >
          <SubHeader iconName={icon} title={title}>
            {typeof isPrivateSupported === 'boolean' &&
              (() => {
                const contentLabel =
                  subscription.type === 'notifications'
                    ? 'notifications'
                    : subscription.type === 'activity'
                    ? 'events'
                    : 'content'

                const text = isPrivateSupported
                  ? `This column type supports private ${contentLabel}.`
                  : `This column type only supports public ${contentLabel}.`

                return (
                  <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
                    <Spacer flex={1} />

                    <SpringAnimatedIcon
                      name={isPrivateSupported ? 'lock' : 'globe'}
                      onPress={() => {
                        alert(text)
                      }}
                      size={18}
                      style={[
                        { color: springAnimatedTheme.foregroundColorMuted50 },
                        Platform.select({
                          web: {
                            cursor: 'help',
                          } as any,
                        }),
                      ]}
                      {...Platform.select({
                        web: {
                          title: text,
                        } as any,
                      })}
                    />
                  </View>
                )
              })()}
          </SubHeader>

          <View style={[sharedStyles.flex, { padding: contentPadding }]}>
            {(paramList
              .map(p => fields.find(f => f.field === p))
              .filter(Boolean) as FieldDetails[]).map(renderField)}
            <Button analyticsLabel="add_column" onPress={handleCreateColumn}>
              Add Column
            </Button>
          </View>

          <Spacer height={contentPadding} />
        </ScrollView>
      </ModalColumn>
    )
  },
)
