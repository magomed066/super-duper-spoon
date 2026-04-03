import compose from 'compose-function'
import { withUI } from './with-ui'
import { withRouter } from './with-router'
import { withReactQuery } from './with-query'

const withProviders = compose(withUI, withReactQuery, withRouter)

export default withProviders
