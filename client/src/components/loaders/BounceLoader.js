import PropTypes from 'prop-types'
import { classNames } from "src/utils";

function BounceLoader({
  className = ''
}) {
  const containerClassName = className ? `flex ${className}` : 'flex'
  let circleCommonClasses = 'h-3 w-3 bg-neutral-400 rounded-full';
    
  return (
    <div className={classNames(containerClassName)}>
          <div className={`${circleCommonClasses} mr-1.5 animate-bounce`}></div>
          <div className={`${circleCommonClasses} mr-1.5 animate-bounce200`}></div>
          <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  );
}

BounceLoader.propTypes = {
  className: PropTypes.string
}

export default BounceLoader
