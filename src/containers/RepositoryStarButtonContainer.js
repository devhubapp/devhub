// @flow

import React from 'react'
import { connect } from 'react-redux'

import StarButton from '../components/buttons/StarButton'
import { makeIsRepoStarredSelector } from '../selectors'
import * as actions from '../actions'
import type { ActionCreators, State } from '../utils/types'

const makeMapStateToProps = () => {
  const isRepoStarredSelector = makeIsRepoStarredSelector()

  return (state: State, { repoId }: { repoId: string }) => ({
    starred: isRepoStarredSelector(state, { repoId: `${repoId}` }),
  })
}

const mapDispatchToProps = {
  starRepo: actions.starRepo,
  unstarRepo: actions.unstarRepo,
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  constructor(props) {
    super(props)

    this.bindActionsToRepoId(props)
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.repoId !== this.props.repoId ||
      newProps.starRepo !== this.props.starRepo ||
      newProps.unstarRepo !== this.props.unstarRepo
    ) {
      this.bindActionsToRepoId(newProps)
    }
  }

  bindActionsToRepoId({ repoId, starRepo, unstarRepo }) {
    this.starRepoFn = starRepo.bind(null, { repoId })
    this.unstarRepoFn = unstarRepo.bind(null, { repoId })
  }

  props: {
    actions?: ActionCreators,
    repoId: string,
    starred?: boolean,
    starRepo?: Function,
    unstarRepo?: Function,
  }

  starRepoFn = null
  unstarRepoFn = null

  render() {
    const { starred, ...props } = this.props
    delete props.actions
    delete props.starRepo
    delete props.unstarRepo

    return (
      <StarButton
        starred={starred}
        starRepoFn={this.starRepoFn}
        unstarRepoFn={this.unstarRepoFn}
        {...props}
      />
    )
  }
}
