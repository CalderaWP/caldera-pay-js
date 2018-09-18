// @flow
import React from 'react';
import ReactDOM from 'react-dom';
type Props = {
	element: HTMLElement,
	children : any
}

/**
 * Render in the TopBar area, which is outside of the app root
 *
 * @param props
 * @return {{$$typeof, key, children, containerInfo, implementation}}
 * @constructor
 */
export const TopBar = (props: Props ) => {
	console.log(props.element);
	return ReactDOM.createPortal(
		props.children,
		props.element,
	);

};