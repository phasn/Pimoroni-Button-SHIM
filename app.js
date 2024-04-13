import {BtnSHIM}	from './index.js';
import API			from './api.js';
import uC			from 'util.console';
import initRL		from 'util.cli';

API.btnShim = new BtnSHIM();

// API.btnShim.btnEmitter.on('btnPress', (btnName) => {
// 	let c = testColors[btnName];
// 	API.btnShim.set_pixel(c.r, c.g, c.b);

// 	console.log(`${uC.red}btnEmitter caught the press of ${uC.b}button ${btnName}${uC.r}`);
// });

API.btnShim.btnEmitter.on('btnPress', (btnName) => {
	console.log(`${uC.red}btnEmitter caught the press of ${uC.b}button ${btnName}${uC.r}`);
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
});


initRL(API);