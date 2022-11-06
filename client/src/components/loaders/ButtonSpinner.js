import PropTypes from 'prop-types'
import { classNames } from 'src/utils'
import Spinner from './spinner'

function ButtonSpinner({ loading, buttonText }) {
  return (
    <>
      <span className={classNames(loading ? "opacity-30" : "")}>{buttonText}</span>
      {loading && <span className="bg-transparent absolute inset-0 flex items-center justify-center">
        <Spinner color="text-white" />
      </span>}
    </>
  )
}

ButtonSpinner.propTypes = {
  loading: PropTypes.bool.isRequired,
  buttonText: PropTypes.string.isRequired,
}

export default ButtonSpinner
