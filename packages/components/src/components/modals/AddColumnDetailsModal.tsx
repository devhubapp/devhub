import _ from 'lodash'
import React, { Fragment, RefObject, useCallback, useState } from 'react'
import { ScrollView, TextInputProps, View } from 'react-native'

import {
  ActivityColumn,
  ActivityColumnSubscription,
  AddColumnDetailsPayload,
  ColumnParamField,
  createSubscriptionObjectsWithId,
  guid,
  NotificationColumn,
} from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { H2 } from '../common/H2'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { TextInput } from '../common/TextInput'

interface AddColumnDetailsModalProps extends AddColumnDetailsPayload {
  showBackButton: boolean
}

interface FieldDetails {
  title: string
  field: ColumnParamField
  placeholder: string
  ref: RefObject<TextInput>
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
      subscription,
      showBackButton,
      paramList,
      name,
      icon,
      defaultParams,
    } = props

    const [params, setParams] = useState({
      all: true,
      org: '',
      owner: '',
      repo: '',
      username: '',
      ...defaultParams,
    })

    const username = useReduxState(selectors.currentUsernameSelector)

    const addColumnAndSubscriptions = useReduxAction(
      actions.addColumnAndSubscriptions,
    )
    const closeAllModals = useReduxAction(actions.closeAllModals)
    const theme = useAnimatedTheme()

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

      closeAllModals()

      const subscriptions = createSubscriptionObjectsWithId([
        {
          ...(subscription as any),
          id: '',
          params: _.pick(params, paramList) as any,
        },
      ])

      const column = {
        id: guid(),
        type: subscription.type,
        subscriptionIds: subscriptions.map(s => s.id),
        filters: undefined,
      } as typeof subscriptions extends ActivityColumnSubscription[]
        ? ActivityColumn
        : NotificationColumn

      addColumnAndSubscriptions({
        column,
        subscriptions,
      })
    }

    const createTextInputChangeHandler = useCallback(
      (fieldDetails: FieldDetails): TextInputProps['onChange'] => e => {
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
      (fieldDetails: FieldDetails): TextInputProps['onSubmitEditing'] => () => {
        const index = paramList.findIndex(fd => fd === fieldDetails.field)

        if (index < paramList.length - 1) {
          if (!validateField(fieldDetails.field)) return

          const nextField = paramList[index + 1]
          const nextFieldDetails = fields.find(fd => fd.field === nextField)

          const input = nextFieldDetails && nextFieldDetails.ref.current
          if (input) {
            if (input.focus) {
              input.focus()
            } else if (input.getNode && input.getNode().focus) {
              input.getNode().focus()
            }
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
        { autoFocus, ...textInputProps }: TextInputProps,
      ) => {
        // autofocus is breaking the react-spring animation
        // need to find a real fix (propably inside react-spring)
        // instead of this ugly workaround

        if (autoFocus) {
          setTimeout(() => {
            if (fieldDetails.ref.current)
              if (fieldDetails.ref.current.focus) {
                fieldDetails.ref.current.focus()
              } else if (
                fieldDetails.ref.current.getNode &&
                fieldDetails.ref.current.getNode().focus
              ) {
                fieldDetails.ref.current.getNode().focus()
              }
          }, 500)
        }

        return (
          <Fragment key={`add-column-details-text-input-${fieldDetails.field}`}>
            <H3 withMargin>{fieldDetails.title}</H3>

            <TextInput
              ref={fieldDetails.ref}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              blurOnSubmit={false}
              placeholder={`${fieldDetails.placeholder || ''}`.replace(
                'brunolemos',
                username!,
              )}
              placeholderTextColor={theme.foregroundColorMuted50}
              {...textInputProps}
              onChange={createTextInputChangeHandler(fieldDetails)}
              onSubmitEditing={createTextInputSubmitHandler(fieldDetails)}
              style={[{ color: theme.foregroundColor }, textInputProps.style]}
              value={params[fieldDetails.field]}
            />

            <Spacer height={contentPadding} />
          </Fragment>
        )
      },
      [params, createTextInputChangeHandler, createTextInputSubmitHandler],
    )

    const renderField = (field: string, index?: number) => {
      const fieldDetails = fields.find(f => f.field === field)

      if (fieldDetails) {
        return renderTextInput(fieldDetails, { autoFocus: index === 0 })
      }

      return null
    }

    return (
      <ModalColumn
        columnId="add-column-details-modal"
        iconName="plus"
        showBackButton={showBackButton}
        title="Add Column"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, padding: contentPadding }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
            }}
          >
            <ColumnHeaderItem
              analyticsLabel={undefined}
              iconName={icon}
              noPadding
            />
            <Spacer width={contentPadding / 2} />
            <H2>{name}</H2>
          </View>

          <Spacer height={contentPadding} />

          {paramList.map(renderField)}
          <Button analyticsLabel="add_column" onPress={handleCreateColumn}>
            Add Column
          </Button>

          <Spacer height={contentPadding} />
        </ScrollView>
      </ModalColumn>
    )
  },
)
