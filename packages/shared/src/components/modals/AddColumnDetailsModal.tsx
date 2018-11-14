import hoistNonReactStatics from 'hoist-non-react-statics'
import _ from 'lodash'
import React, { PureComponent, RefObject } from 'react'
import { TextInputProps, View } from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import {
  AddColumnDetailsPayload,
  ColumnParamField,
  ExtractPropsFromConnector,
} from '../../types'
import { ModalColumn } from '../columns/ModalColumn'

import { contentPadding } from '../../styles/variables'
import { createSubscriptionObjectWithId } from '../../utils/helpers/github/shared'
import { guid } from '../../utils/helpers/shared'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Button } from '../common/Button'
import { H2 } from '../common/H2'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { TextInput } from '../common/TextInput'
import { ThemeConsumer } from '../context/ThemeContext'

interface AddColumnDetailsModalProps extends AddColumnDetailsPayload {}

interface AddColumnDetailsModalState {
  params: Record<ColumnParamField, any>
}

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    addColumn: actions.addColumn,
    closeAllModals: actions.closeAllModals,
  },
)

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

type Props = AddColumnDetailsModalProps &
  ExtractPropsFromConnector<typeof connectToStore>
class AddColumnDetailsModalComponent extends PureComponent<
  Props,
  AddColumnDetailsModalState
> {
  constructor(props: Props) {
    super(props)

    this.state = {
      params: {
        all: true,
        org: '',
        owner: '',
        repo: '',
        username: '',
        ...props.defaultParams,
      },
    }
  }

  validateField = (field: ColumnParamField) => {
    const value = this.state.params[field]
    return !(typeof value === 'undefined' || value === '')
  }

  handleCreateColumn = () => {
    const { params } = this.state
    const { paramList } = this.props

    for (const field of paramList) {
      if (!this.validateField(field)) {
        const fieldDetails = fields.find(f => f.field === field)
        alert(`${fieldDetails ? fieldDetails.title : field} cannot be empty.`)
        return
      }
    }

    this.props.closeAllModals()

    const subscriptions = [
      createSubscriptionObjectWithId({
        ...this.props.subscription,
        params: _.pick(params, paramList),
      }),
    ]

    this.props.addColumn({
      column: {
        id: guid(),
        type: this.props.subscription.type,
        subscriptionIds: subscriptions.map(s => s.id),
      },
      subscriptions,
    })
  }

  _createTextInputChangeHandler: (
    fieldDetails: FieldDetails,
  ) => TextInputProps['onChange'] = (fieldDetails: FieldDetails) => e => {
    if (!(e && e.nativeEvent)) return
    const text = e.nativeEvent.text

    this.setState(state => ({
      params: {
        ...state.params,
        [fieldDetails.field]: text,
      },
    }))
  }

  // tslint:disable-next-line
  createTextInputChangeHandler = _.memoize(this._createTextInputChangeHandler)

  _createTextInputSubmitHandler: (
    fieldDetails: FieldDetails,
  ) => TextInputProps['onSubmitEditing'] = (
    fieldDetails: FieldDetails,
  ) => () => {
    const { paramList } = this.props

    const index = paramList.findIndex(fd => fd === fieldDetails.field)

    if (index < paramList.length - 1) {
      if (!this.validateField(fieldDetails.field)) return

      const nextField = paramList[index + 1]
      const nextFieldDetails = fields.find(fd => fd.field === nextField)
      if (nextFieldDetails && nextFieldDetails.ref.current) {
        nextFieldDetails.ref.current.focus()
      }

      return
    }

    this.handleCreateColumn()
  }

  // tslint:disable-next-line
  createTextInputSubmitHandler = _.memoize(this._createTextInputSubmitHandler)

  renderTextInput = (fieldDetails: FieldDetails, props: TextInputProps) => (
    <ThemeConsumer key={`add-column-details-text-input-${fieldDetails.field}`}>
      {({ theme }) => (
        <>
          <H3 withMargin>{fieldDetails.title}</H3>

          <TextInput
            ref={fieldDetails.ref}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            placeholder={fieldDetails.placeholder}
            placeholderTextColor={theme.foregroundColorMuted50}
            {...props}
            onChange={this.createTextInputChangeHandler(fieldDetails)}
            onSubmitEditing={this.createTextInputSubmitHandler(fieldDetails)}
            style={[{ color: theme.foregroundColor }, props.style]}
            value={this.state.params[fieldDetails.field]}
          />

          <Spacer height={contentPadding} />
        </>
      )}
    </ThemeConsumer>
  )

  renderField = (field: string, index?: number) => {
    const fieldDetails = fields.find(f => f.field === field)

    if (fieldDetails) {
      return this.renderTextInput(fieldDetails, { autoFocus: index === 0 })
    }

    return null
  }

  render() {
    const { icon, name, paramList } = this.props

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
            <ColumnHeaderItem iconName={icon} style={{ padding: 0 }} />
            <Spacer width={contentPadding / 2} />
            <H2>{name}</H2>
          </View>

          <Spacer height={contentPadding} />

          {paramList.map(this.renderField)}
          <Button onPress={this.handleCreateColumn}>Add Column</Button>
        </View>
      </ModalColumn>
    )
  }
}

export const AddColumnDetailsModal = connectToStore(
  AddColumnDetailsModalComponent,
)

hoistNonReactStatics(
  AddColumnDetailsModal,
  AddColumnDetailsModalComponent as any,
)
