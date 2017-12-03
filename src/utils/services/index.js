/* eslint-disable import/prefer-default-export */

import setupServices from './setup'

const services = setupServices()

export default services

export const { bugsnagClient, firebaseApp } = services
