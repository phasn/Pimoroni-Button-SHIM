import {BtnSHIM}				from './index.js';
import uC						from 'util.console';
import {API as mainAPI}			from './api.js';
import {initRL, includeAPIs}	from 'util.cli';

const API = {};
includeAPIs([mainAPI], API);

let testColors = {
	A:{
		r: 0x94,
		g: 0x00,
		b: 0xd3
	},
	B:{
		r: 0x00,
		g: 0x00,
		b: 0xff
	},
	C:{
		r: 0x00,
		g: 0xff,
		b: 0x00
	},
	D:{
		r: 0xff,
		g: 0xff,
		b: 0x00
	},
	E:{
		r: 0xff,
		g: 0x00,
		b: 0x00
	}
};

API.btnShim = new BtnSHIM();

// API.btnShim.btnEmitter.on('btnPress', (btnName) => {
// 	let c = testColors[btnName];
// 	API.btnShim.setPixel(c.r, c.g, c.b);

// 	console.log(`${uC.red}btnEmitter caught the press of ${uC.b}button ${btnName}${uC.r}`);
// });

API.btnShim.btnEmitter.on('btnPress', (btnName) => {
	console.log(`${uC.red}btnEmitter caught the press of ${uC.b}button ${btnName}${uC.r}`);
	API.btnShim.setPixel(testColors[btnName].r, testColors[btnName].g, testColors[btnName].b);
});
API.btnShim.btnEmitter.on('btnHold', (btnName) => {
	console.log(`${uC.grn}btnEmitter caught the holding of ${uC.b}button ${btnName}${uC.r}`);
});
API.btnShim.btnEmitter.on('btnRelease', (btnName) => {
	console.log(`${uC.blu}btnEmitter caught the release of ${uC.b}button ${btnName}${uC.r}\n`);
});
API.btnShim.btnEmitter.on('btnNonHeldRelease', (btnName) => {
	console.log(`${uC.cyn}btnEmitter caught the non-held release of ${uC.b}button ${btnName}${uC.r}`);
});
API.btnShim.btnEmitter.on('btnHeldRelease', (btnName) => {
	console.log(`${uC.mgt}btnEmitter caught the held release of ${uC.b}button ${btnName}${uC.r}`);
	API.btnShim.setPixel(0x00, 0x00, 0x00);
});


initRL(API);