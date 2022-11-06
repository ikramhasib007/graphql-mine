import PropTypes from 'prop-types';
import { classNames } from '../../utils';

function Spinner({ className, color, small }) {

  return (
    <span className={classNames(
      className ? className : '',
      small ? "h-3 w-3" : "h-4 w-4",
      "animate-spin rounded-full border-t-2 border-b-2",
      `border-${color}`
    )}></span>
  )
}

Spinner.defaultProps = {
  color: "gray-900",
  small: false
}

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  small: PropTypes.bool
}

export default Spinner