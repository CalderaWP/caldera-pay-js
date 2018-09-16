// @flow
import React from 'react';
import ReactDOM from 'react-dom';
type Props = {
	element: Node,
	children : any
}

/**
 * Render in the Left Top area, which is outside of the app root
 *
 * @param props
 * @return {{$$typeof, key, children, containerInfo, implementation}}
 * @constructor
 */
export  const LeftTop = (props: Props ) => {
	return ReactDOM.createPortal(
		props.children,
		props.element,
	);

};