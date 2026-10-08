import uC, {__cmd, __arg} from '@phasn/phasn-utils';


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
// 			execute(){
// 				if(!this.btnShim) return console.error('ERROR: No Button SHIM detected');

// 				const states = this.btnShim.get_keys();
// 				if(!states) return console.error('ERROR: Button states could not be read');

// 				let str = `${this.btnShim.buttons[0].name}: ${states[0]}
// ${this.btnShim.buttons[1].name}: ${states[1]}
// ${this.btnShim.buttons[2].name}: ${states[2]}
// ${this.btnShim.buttons[3].name}: ${states[3]}
// ${this.btnShim.buttons[4].name}: ${states[4]}`;

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
			execute(){
				if(!this.btnShim) return console.error('ERROR: No Button SHIM detected');
				console.log('Starting Button SHIM process');
				this.btnShim.start();
			}
		},

	//	======================
	//	<<<<<<<< stop >>>>>>>>
	//	======================
		stop:{
			description: 'Stop watching button states',
			syntax:[`${__cmd('stop')}`],
			execute(){
				if(!this.btnShim) return console.error('ERROR: No Button SHIM detected');
				console.log('Stopping Button SHIM process');
				this.btnShim.stop();
			}
		},

	//	===============================
	//	<<<<<<<< setBrightness >>>>>>>>
	//	===============================
		setBrightness:{
			description: 'Changes the brightness of the Button Shim LED. Brightness value must be a number between 0.0 and 1.0',
			syntax:[`${__cmd('setBrightness')} ${__arg('BRIGHTNESS')}`],
			execute(brightness){
				if(!this.btnShim) return console.error('ERROR: No Button SHIM detected');

				brightness = parseFloat(brightness);
				if(isNaN(brightness) || typeof brightness !== 'number') return console.error('ERROR: Unable to parse input value');
				if(brightness > 1) brightness = 1;
				if(brightness < 0) brightness = 0;

				this.btnShim.setBrightness(brightness);
			}
		},

	//	===============================
	//	<<<<<<<< getBrightness >>>>>>>>
	//	===============================
		getBrightness:{
			description: 'Returns the current brightness of the LED',
			syntax:[`${__cmd('getBrightness')}`],
			execute(){
				if(!this.btnShim) return console.error('ERROR: No Button SHIM detected');
				console.log(this.btnShim.getBrightness());
			}
		},

	//	==========================
	//	<<<<<<<< setColor >>>>>>>>
	//	==========================
		setColor:{
			description: 'Changes the color of the Button Shim LED. Color can be a hex color string, an RGB array, or an object with R, G, and B keys',
			syntax:[
				`${__cmd('setColor')} ${__arg('HEX CODE')}`,
				`${__cmd('setColor')} ${__arg('RED')} ${__arg('BLUE')} ${__arg('GREEN')}`,
			],
			aliases:[
				'setColors',
				'setColorsAll',
				'setColorAll',
				'setAllColors',
				'setAllColor',
				'setAll',
				'fill',
			],
			execute(...args){
				if(!this.btnShim) return console.error('ERROR: No Button SHIM detected');

				let color = args[0];
				if(args.length===1 && !args[0].startsWith('#') && !args[0].startsWith('[') && !args[0].startsWith('{')){
					color = `#${args[0]}`;
				}
				if(args.length===3){
					for(let i=0; i<args.length; i++) args[i] = Number(args[i]);
					color = args;
				}

				this.btnShim.setColor(color);
			}
		},

	//	==========================
	//	<<<<<<<< getColor >>>>>>>>
	//	==========================
		getColor:{
			description: 'Returns the current color of the LED strip in the specified format',
			syntax:[`${__cmd('getColor')} ${__arg('FORMAT')}`],
			execute(format='hex'){
				if(!this.btnShim) return console.error('ERROR: No Button SHIM detected');
				this.btnShim.getColor(format);
			}
		},
	}
};


export default API;