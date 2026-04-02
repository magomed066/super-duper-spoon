import compose from 'compose-function'
import { withUI } from './with-ui'
import { withRouter } from './with-router'

const withProviders = compose(withUI, withRouter)

export default withProviders
