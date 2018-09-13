//@flow

export const requestHeaders = (jwtToken: ?string) =>   {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json' );
	headers.append('Accept', 'application/json' );


	if( jwtToken ){
		headers.append( 'Authorization', `Bearer ${jwtToken}`);

	}

	return headers;
}