import {CalderaPay} from "./components/CalderaPay";
describe( 'Root export', () => {
	it( 'Exports as the right type', () => {
		expect(typeof CalderaPay ).toBe('function');
	});

});