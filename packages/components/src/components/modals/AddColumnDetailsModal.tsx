import { FormikErrors, useFormik } from 'formik'
import _ from 'lodash'
import React, { Fragment, useEffect } from 'react'
import { Keyboard, ScrollView, View } from 'react-native'
import * as Yup from 'yup'

import {
  ActivityColumnSubscription,
  ActivityColumnSubscriptionCreation,
  AddColumnDetailsPayload,
  ColumnAndSubscriptions,
  ColumnCreation,
  ColumnFilters,
  ColumnSubscriptionCreation,
  createSubscriptionObjectWithId,
  getOwnerAndRepo,
  GITHUB_REPO_FULL_NAME_FORMAT_REGEX,
  GITHUB_REPO_FULL_NAME_REGEX,
  GITHUB_USERNAME_REGEX,
  guid,
  IssueOrPullRequestColumnSubscription,
  IssueOrPullRequestColumnSubscriptionCreation,
  NotificationColumnFilters,
  NotificationColumnSubscription,
  NotificationColumnSubscriptionCreation,
} from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  smallerTextSize,
  smallTextSize,
} from '../../styles/variables'
import { ColumnOptionsInboxContent } from '../columns/ColumnOptionsInbox'
import { ModalColumn } from '../columns/ModalColumn'
import { sharedColumnOptionsStyles } from '../columns/options/shared'
import { Button } from '../common/Button'
import { Checkbox } from '../common/Checkbox'
import { H3 } from '../common/H3'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import {
  ThemedTextInput,
  ThemedTextInputProps,
} from '../themed/ThemedTextInput'

export type FormItem = 'inbox' | 'org' | 'repo' | 'repo_option' | 'user'

export const formItemsMetadata = {
  inbox: {
    initialValue: 'all' as 'all' | 'participating',
    validationSchema: Yup.mixed()
      .required('Required')
      .oneOf(['all', 'participating'], 'Invalid'),
  },
  org: {
    initialValue: '',
    validationSchema: Yup.string()
      .matches(GITHUB_USERNAME_REGEX, {
        message: 'Invalid',
        excludeEmptyString: true,
      })
      .required('Required'),
  },
  repo: {
    initialValue: '',
    validationSchema: Yup.string()
      .matches(GITHUB_REPO_FULL_NAME_FORMAT_REGEX, {
        message: 'Format: owner/repo',
        excludeEmptyString: true,
      })
      .matches(GITHUB_REPO_FULL_NAME_REGEX, {
        message: 'Invalid',
        excludeEmptyString: true,
      })
      .required('Required'),
  },
  repo_option: {
    initialValue: false,
    validationSchema: Yup.boolean(),
  },
  user: {
    initialValue: '',
    validationSchema: Yup.string()
      .matches(GITHUB_USERNAME_REGEX, {
        message: 'Invalid',
        excludeEmptyString: true,
      })
      .required('Required'),
  },
}

export const formInitialValues = _.mapValues(
  formItemsMetadata,
  v => v.initialValue,
) as { [key in FormItem]: (typeof formItemsMetadata)[key]['initialValue'] }

export const formValidationSchema = _.mapValues(
  formItemsMetadata,
  v => v.validationSchema,
) as { [key in FormItem]: (typeof formItemsMetadata)[key]['validationSchema'] }

export interface AddColumnDetailsModalProps extends AddColumnDetailsPayload {
  showBackButton: boolean
}

const CIRCLE_CHARACTER = '●'

export const AddColumnDetailsModal = React.memo(
  (props: AddColumnDetailsModalProps) => {
    const {
      defaultFilters,
      defaultParams,
      icon,
      isPrivateSupported,
      showBackButton,
      subscription,
      title,
    } = props

    const formItems = getFormItems(subscription)

    const loggedUsername = useReduxState(
      selectors.currentGitHubUsernameSelector,
    )!

    const addColumnAndSubscriptions = useReduxAction(
      actions.addColumnAndSubscriptions,
    )
    const closeAllModals = useReduxAction(actions.closeAllModals)

    const formikProps = useFormik({
      initialValues: formInitialValues,
      onSubmit(formValues, formikActions) {
        formikActions.setSubmitting(false)

        Keyboard.dismiss()
        closeAllModals()

        // TODO: Wait for modal close animation to finish

        const newColumnAndSubscriptions = getNewColumnAndSubscriptions(
          formItems,
          formValues,
          {
            defaultFilters,
            defaultParams,
            loggedUsername,
            subscription,
          },
        )

        if (!newColumnAndSubscriptions) {
          formikActions.setSubmitting(false)

          const errorMessage = 'Something went wrong. Failed to create column.'
          bugsnag.notify(new Error(errorMessage), {
            formValues,
            defaultFilters,
            loggedUsername,
            subscription,
          })
          alert(errorMessage)

          return
        }

        addColumnAndSubscriptions(newColumnAndSubscriptions)

        formikActions.setSubmitting(false)
      },
      validateOnBlur: true,
      validateOnChange: true,
      validate(values) {
        const errors: FormikErrors<typeof formInitialValues> = {}

        function validateField(formItem: FormItem) {
          try {
            formValidationSchema[formItem].validateSync(values[formItem])
          } catch (error) {
            errors[formItem] = (error as Yup.ValidationError).message
          }
        }

        if (formItems.includes('inbox')) {
          validateField('inbox')
        }

        if (formItems.includes('org')) {
          validateField('org')
        }

        if (
          formItems.includes('repo') ||
          (formItems.includes('repo_option') && values.repo_option)
        ) {
          validateField('repo')
        }

        if (formItems.includes('user')) {
          validateField('user')
        }

        return errors
      },
    })

    useEffect(() => {
      formikProps.validateForm()
    }, [])

    function ErrorMessage({ name }: { name: FormItem }) {
      if (!name) return null
      if (
        !(
          formikProps.touched[name] ||
          (name.endsWith('_option') &&
            Object.keys(formikProps.touched).some(item =>
              item.endsWith('_option'),
            )) ||
          formikProps.submitCount > 0
        )
      )
        return null

      const error = formikProps.errors[name]
      if (!error) return null

      if (error === CIRCLE_CHARACTER) {
        return (
          <ThemedText color="yellow" style={{ fontSize: smallerTextSize }}>
            {error}
          </ThemedText>
        )
      }

      return (
        <ThemedText
          color="red"
          style={{ fontSize: smallTextSize, fontStyle: 'italic' }}
        >
          {error}
        </ThemedText>
      )
    }

    function renderHeader() {
      return (
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

                  <ThemedIcon
                    color="foregroundColorMuted60"
                    name={isPrivateSupported ? 'lock' : 'globe'}
                    onPress={() => {
                      alert(text)
                    }}
                    size={18}
                    style={[
                      Platform.select({
                        web: {
                          cursor: 'help',
                        },
                      }),
                    ]}
                    {...Platform.select({
                      web: {
                        title: text,
                      },
                    })}
                  />
                </View>
              )
            })()}
        </SubHeader>
      )
    }

    function renderFormItem(formItem: FormItem) {
      switch (formItem) {
        case 'inbox':
          return (
            <View key={`add-column-details-form-item-${formItem}`}>
              <View style={sharedStyles.horizontal}>
                <H3 withMargin>Inbox</H3>
                <Spacer flex={1} />
                <ErrorMessage name={formItem} />
              </View>

              <ColumnOptionsInboxContent
                inbox={formikProps.values.inbox}
                onChange={value => {
                  formikProps.setFieldTouched(formItem)
                  formikProps.setFieldValue(formItem, value)
                }}
              />
            </View>
          )

        case 'org':
          return (
            <View key={`add-column-details-form-item-${formItem}`}>
              <View style={sharedStyles.horizontal}>
                <H3 withMargin>Organization</H3>
                <Spacer flex={1} />
                <ErrorMessage name={formItem} />
              </View>

              {renderOrgForm()}
            </View>
          )

        case 'repo':
          return (
            <View key={`add-column-details-form-item-${formItem}`}>
              <View style={sharedStyles.horizontal}>
                <H3 withMargin>Repository</H3>
                <Spacer flex={1} />
                <ErrorMessage name={formItem} />
              </View>

              {renderRepoForm(
                subscription.type === 'activity' &&
                  subscription.subtype === 'REPO_EVENTS'
                  ? {
                      placeholder: 'E.g.: devhubapp/devhub',
                    }
                  : {},
              )}
            </View>
          )

        case 'repo_option':
          return (
            <View key={`add-column-details-form-item-${formItem}`}>
              <Checkbox
                analyticsLabel={`add_column_details_${formItem}`}
                checked={formikProps.values.repo_option}
                containerStyle={
                  sharedColumnOptionsStyles.fullWidthCheckboxContainer
                }
                defaultValue={false}
                label="From repository..."
                onChange={value => {
                  formikProps.setFieldTouched(formItem)
                  formikProps.setFieldValue(formItem, value)
                }}
                right={<ErrorMessage name={formItem} />}
                squareContainerStyle={
                  sharedColumnOptionsStyles.checkboxSquareContainer
                }
              />

              {formikProps.values.repo_option && (
                <View
                  style={{
                    marginLeft:
                      columnHeaderItemContentSize + contentPadding / 2,
                  }}
                >
                  <Spacer height={contentPadding} />

                  {renderFormItem('repo')}
                </View>
              )}
            </View>
          )

        case 'user':
          return (
            <View key={`add-column-details-form-item-${formItem}`}>
              <View style={sharedStyles.horizontal}>
                <H3 withMargin>Username</H3>
                <Spacer flex={1} />
                <ErrorMessage name={formItem} />
              </View>

              {renderUserForm({
                placeholder: `E.g.: ${loggedUsername}`,
              })}
            </View>
          )

        default:
          return null
      }
    }

    function renderContent() {
      return (
        <View style={{ paddingHorizontal: contentPadding }}>
          {formItems.map((formItem, formItemIndex) => {
            const content = renderFormItem(formItem)

            if (!content) {
              if (__DEV__) {
                // tslint:disable-next-line no-console
                console.warn(
                  `[AddColumnDetailsModal] No form defined for "${formItem}"`,
                )
              }
              return null
            }

            return (
              <Fragment
                key={`add-column-details-modal-formik-item-${formItem}-${formItemIndex}`}
              >
                {content}
                <Spacer height={contentPadding} />
                <Separator horizontal />
                <Spacer height={contentPadding} />
              </Fragment>
            )
          })}

          {/* {!!__DEV__ && (
            <ThemedText color="foregroundColorMuted60">
              {JSON.stringify(formikProps, null, 2)}
            </ThemedText>
          )} */}
        </View>
      )
    }

    const defaultTextInputProps: Partial<ThemedTextInputProps> = {
      autoCapitalize: 'none',
      autoCorrect: false,
      autoFocus: false,
      blurOnSubmit: false,
      color: 'foregroundColor',
      placeholder: '',
      onSubmitEditing: () => {
        formikProps.submitForm()
      },
    }

    function renderGenericFormTextInput<F extends FormItem>(
      formItem: F,
      textInputProps: Partial<ThemedTextInputProps> = {},
    ) {
      return (
        <ThemedTextInput
          {...defaultTextInputProps}
          onBlur={() => {
            formikProps.setFieldTouched(formItem)
          }}
          onChangeText={value => {
            formikProps.setFieldValue(formItem, value)
          }}
          value={`${formikProps.values[formItem] || ''}`}
          {...textInputProps}
        />
      )
    }

    function renderOrgForm(textInputProps: Partial<ThemedTextInputProps> = {}) {
      return renderGenericFormTextInput('org', {
        placeholder: 'E.g.: facebook',
        ...textInputProps,
      })
    }

    function renderRepoForm(
      textInputProps: Partial<ThemedTextInputProps> = {},
    ) {
      return renderGenericFormTextInput('repo', {
        placeholder: 'E.g.: facebook/react',
        ...textInputProps,
      })
    }

    function renderUserForm(
      textInputProps: Partial<ThemedTextInputProps> = {},
    ) {
      return renderGenericFormTextInput('user', {
        placeholder: `E.g.: ${loggedUsername}`,
        ...textInputProps,
      })
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
          {renderHeader()}
          <Separator horizontal />
          <Spacer height={contentPadding} />

          <View style={sharedStyles.flex}>{renderContent()}</View>

          <View style={{ paddingHorizontal: contentPadding }}>
            <Button
              analyticsLabel="add_column"
              disabled={!formikProps.isValid || formikProps.isSubmitting}
              onPress={formikProps.submitForm}
            >
              Add Column
            </Button>
          </View>

          <Spacer height={contentPadding} />
        </ScrollView>
      </ModalColumn>
    )
  },
)

function getFormItems({
  type: _type,
  subtype: _subtype,
}: AddColumnDetailsPayload['subscription']): FormItem[] {
  switch (_type) {
    case 'notifications': {
      const subtype = _subtype as NotificationColumnSubscription['subtype']

      switch (subtype) {
        case 'REPO_NOTIFICATIONS':
          return ['inbox', 'repo']

        default:
          return ['inbox', 'repo_option']
      }
    }

    case 'issue_or_pr': {
      const subtype = _subtype as IssueOrPullRequestColumnSubscription['subtype']

      switch (subtype) {
        case 'ISSUES':
        case 'PULLS':
        default:
          return ['repo']
      }
    }

    case 'activity': {
      const subtype = _subtype as ActivityColumnSubscription['subtype']

      switch (subtype) {
        case 'ORG_PUBLIC_EVENTS':
          return ['org']

        case 'PUBLIC_EVENTS':
          return []

        case 'REPO_EVENTS':
          return ['repo']

        case 'REPO_NETWORK_EVENTS':
          return ['repo']

        case 'USER_EVENTS':
          return ['user']

        case 'USER_ORG_EVENTS':
          return ['org']

        case 'USER_PUBLIC_EVENTS':
          return ['user']

        case 'USER_RECEIVED_EVENTS':
          return ['user']

        case 'USER_RECEIVED_PUBLIC_EVENTS':
          return ['user']

        default:
          return []
      }
    }

    default:
      return []
  }
}

function getNewColumnAndSubscriptions(
  formItems: FormItem[],
  _formValues: typeof formInitialValues,
  {
    defaultFilters,
    defaultParams,
    loggedUsername,
    subscription: { type: _type, subtype: _subtype },
  }: {
    defaultFilters: AddColumnDetailsPayload['defaultFilters']
    defaultParams: AddColumnDetailsPayload['defaultParams']
    loggedUsername: string
    subscription: AddColumnDetailsPayload['subscription']
  },
): ColumnAndSubscriptions | null {
  const formValues = { ..._formValues }

  if (formItems.includes('repo_option') && !formValues.repo_option) {
    delete formValues.repo
  }

  const { owner, repo } = formValues.repo
    ? getOwnerAndRepo(formValues.repo)
    : { owner: formValues.org || formValues.user, repo: undefined }

  const repoFullName = owner && repo ? `${owner}/${repo}` : undefined

  const newColumnFilters: ColumnFilters | undefined = defaultFilters || {}
  let newSubscription: ColumnSubscriptionCreation & { id: string }
  switch (_type) {
    case 'notifications': {
      const type = _type as NotificationColumnSubscription['type']
      const subtype = _subtype as NotificationColumnSubscription['subtype']

      switch (subtype) {
        case 'REPO_NOTIFICATIONS':
        default: {
          newSubscription = createSubscriptionObjectWithId<
            NotificationColumnSubscriptionCreation
          >({
            params: {
              ...(defaultParams as any),
              all: true,
              participating: formValues.inbox === 'participating',
              ...(!!(owner && repo) && {
                owner,
                repo,
              }),
            },
            type,
            subtype: owner && repo ? 'REPO_NOTIFICATIONS' : undefined,
          })
          ;(newColumnFilters as NotificationColumnFilters).notifications =
            (newColumnFilters as NotificationColumnFilters).notifications || {}
          ;(newColumnFilters as NotificationColumnFilters).notifications!.participating =
            newSubscription.params.participating

          break
        }
      }

      break
    }

    case 'issue_or_pr': {
      const type = _type as IssueOrPullRequestColumnSubscription['type']
      const subtype = _subtype as IssueOrPullRequestColumnSubscription['subtype']

      switch (subtype) {
        case 'ISSUES':
        case 'PULLS':
        default: {
          newSubscription = createSubscriptionObjectWithId<
            IssueOrPullRequestColumnSubscriptionCreation
          >({
            params: {
              ...(defaultParams as any),
              repoFullName,
              subjectType:
                subtype === 'ISSUES'
                  ? 'Issue'
                  : subtype === 'PULLS'
                  ? 'PullRequest'
                  : undefined,
            },
            type,
            subtype,
          })

          newColumnFilters.subjectTypes = newSubscription.params.subjectType
            ? { [newSubscription.params.subjectType]: true }
            : {}

          break
        }
      }

      break
    }

    case 'activity': {
      const type = _type as ActivityColumnSubscription['type']
      const subtype = _subtype as ActivityColumnSubscription['subtype']

      switch (subtype) {
        case 'ORG_PUBLIC_EVENTS':
        case 'USER_ORG_EVENTS': {
          newSubscription = createSubscriptionObjectWithId<
            ActivityColumnSubscriptionCreation
          >({
            params: {
              ...(defaultParams as any),
              org: owner,
              username: subtype === 'USER_ORG_EVENTS' ? loggedUsername : '',
            },
            type,
            subtype,
          })

          break
        }

        case 'PUBLIC_EVENTS': {
          newSubscription = createSubscriptionObjectWithId<
            ActivityColumnSubscriptionCreation
          >({
            params: {
              ...(defaultParams as any),
            },
            type,
            subtype,
          })

          break
        }

        case 'REPO_EVENTS':
        case 'REPO_NETWORK_EVENTS': {
          if (!(owner && repo)) return null

          newSubscription = createSubscriptionObjectWithId<
            ActivityColumnSubscriptionCreation
          >({
            params: {
              ...(defaultParams as any),
              owner,
              repo,
            },
            type,
            subtype,
          })

          break
        }

        case 'USER_EVENTS':
        case 'USER_PUBLIC_EVENTS':
        case 'USER_RECEIVED_EVENTS':
        case 'USER_RECEIVED_PUBLIC_EVENTS': {
          if (!formValues.user) return null

          newSubscription = createSubscriptionObjectWithId<
            ActivityColumnSubscriptionCreation
          >({
            params: {
              ...(defaultParams as any),
              username: formValues.user,
            },
            type,
            subtype,
          })

          if (subtype === 'USER_RECEIVED_EVENTS') {
            newColumnFilters.subjectTypes = newColumnFilters.subjectTypes || {
              Release: true,
              Repository: true,
              Tag: true,
              User: true,
            }
          }

          break
        }

        default: {
          return null
        }
      }

      break
    }

    default: {
      return null
    }
  }

  const newColumn: ColumnCreation = {
    id: guid(),
    type: _type as any,
    subscriptionIds: [newSubscription.id],
    filters: newColumnFilters,
  }

  return {
    column: newColumn,
    subscriptions: [newSubscription],
  }
}
