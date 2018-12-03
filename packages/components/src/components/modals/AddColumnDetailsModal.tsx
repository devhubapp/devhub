import _ from 'lodash'
import React, { Fragment, RefObject, useCallback, useState } from 'react'
import { TextInputProps, View } from 'react-native'

import {
  ActivityColumn,
  ActivitySubscription,
  AddColumnDetailsPayload,
  ColumnParamField,
  NotificationColumn,
} from '@devhub/core/dist/types'
import * as actions from '../../redux/actions'
import { ModalColumn } from '../columns/ModalColumn'

import { createSubscriptionObjectWithId } from '@devhub/core/dist/utils/helpers/github/shared'
import { guid } from '@devhub/core/dist/utils/helpers/shared'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { contentPadding } from '../../styles/variables'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Button } from '../common/Button'
import { H2 } from '../common/H2'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { TextInput } from '../common/TextInput'
import { useTheme } from '../context/ThemeContext'

interface AddColumnDetailsModalProps extends AddColumnDetailsPayload {}

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

export function AddColumnDetailsModal(props: AddColumnDetailsModalProps) {
  const { defaultParams, icon, name, paramList, subscription } = props

  const [params, setParams] = useState({
    all: true,
    org: '',
    owner: '',
    repo: '',
    username: '',
    ...defaultParams,
  })
  const addColumn = useReduxAction(actions.addColumn)
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const theme = useTheme()

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

    const subscriptions = [
      createSubscriptionObjectWithId({
        ...subscription,
        params: _.pick(params, paramList),
      }),
    ]

    const column = {
      id: guid(),
      type: subscription.type,
      subscriptionIds: subscriptions.map(s => s.id),
      filters: undefined,
    } as typeof subscriptions extends ActivitySubscription[]
      ? ActivityColumn
      : NotificationColumn

    addColumn({
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
        if (nextFieldDetails && nextFieldDetails.ref.current) {
          nextFieldDetails.ref.current.focus()
        }

        return
      }

      handleCreateColumn()
    },
    [params, paramList],
  )

  const renderTextInput = useCallback(
    (fieldDetails: FieldDetails, textInputProps: TextInputProps) => (
      <Fragment key={`add-column-details-text-input-${fieldDetails.field}`}>
        <H3 withMargin>{fieldDetails.title}</H3>

        <TextInput
          ref={fieldDetails.ref}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          placeholder={fieldDetails.placeholder}
          placeholderTextColor={theme.foregroundColorMuted50}
          {...textInputProps}
          onChange={createTextInputChangeHandler(fieldDetails)}
          onSubmitEditing={createTextInputSubmitHandler(fieldDetails)}
          style={[{ color: theme.foregroundColor }, textInputProps.style]}
          value={params[fieldDetails.field]}
        />

        <Spacer height={contentPadding} />
      </Fragment>
    ),
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
      title="Add Column"
    >
      <View style={{ flex: 1, padding: contentPadding }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <ColumnHeaderItem iconName={icon} noPadding />
          <Spacer width={contentPadding / 2} />
          <H2>{name}</H2>
        </View>

        <Spacer height={contentPadding} />

        {paramList.map(renderField)}
        <Button onPress={handleCreateColumn}>Add Column</Button>
      </View>
    </ModalColumn>
  )
}
