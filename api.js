import uC, {__cmd, __arg} from 'util.console';


export const API = {
	commands:{
// 	//	======================
// 	//	<<<<<<<< read >>>>>>>>
// 	//	======================
// 		read:{
// 			description: 'Returns the current states of the buttons',
// 			syntax:[`${__cmd('read')}`],
// 			aliases:[
// 				'readButtons',
// 				'query',
// 				'queryButtons',
// 			],
// 			execute:() => {
// 				if(!API.btnShim) return console.error('ERROR: No Button SHIM detected');

// 				const states = API.btnShim.get_keys();
// 				if(!states) return console.error('ERROR: Button states could not be read');

// 				let str = `${API.btnShim.buttons[0].name}: ${states[0]}
// ${API.btnShim.buttons[1].name}: ${states[1]}
// ${API.btnShim.buttons[2].name}: ${states[2]}
// ${API.btnShim.buttons[3].name}: ${states[3]}
// ${API.btnShim.buttons[4].name}: ${states[4]}`;

// 				console.clear();
// 				console.log(str);
// 			}
// 		},

	//	=======================
	//	<<<<<<<< start >>>>>>>>
	//	=======================
		start:{
			description: 'Start watching button states',
			syntax:[`${__cmd('start')}`],
			aliases:[
				'run',
			],
			execute:() => {
				if(!API.btnShim) return console.error('ERROR: No Button SHIM detected');
				console.log('Starting Button SHIM process');
				API.btnShim.start();
			}
		},

	//	======================
	//	<<<<<<<< stop >>>>>>>>
	//	======================
		stop:{
			description: 'Stop watching button states',
			syntax:[`${__cmd('stop')}`],
			execute:() => {
				if(!API.btnShim) return console.error('ERROR: No Button SHIM detected');
				console.log('Stopping Button SHIM process');
				API.btnShim.stop();
			}
		},

	// //	==========================
	// //	<<<<<<<< setColor >>>>>>>>
	// //	==========================
	// 	setColor:{
	// 		description: 'Set the color of a specific LED on the NeoKey board',
	// 		syntax:[`${__cmd('setColor')} ${__arg('LED#')} ${__arg('COLOR')}`],
	// 		execute:(led, color) => {
	// 			if(!API.btnShim) return console.error('ERROR: No Button SHIM detected');
	// 			API.btnShim[led].setColor(color);
	// 		}
	// 	},

	// //	==========================
	// //	<<<<<<<< fill >>>>>>>>
	// //	==========================
	// 	fill:{
	// 		description: 'Set the color of a specific LED on the NeoKey board',
	// 		syntax:[`${__cmd('fill')} ${__arg('COLOR')}`],
	// 		execute:(color) => {
	// 			if(!API.btnShim) return console.error('ERROR: No Button SHIM detected');
	// 			for(let i=0; i<3; i++) API.btnShim[i].setColor(color);
	// 		}
	// 	},
	}
};


export default API;