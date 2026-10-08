import {Buffer}					from 'node:buffer';
import {EventEmitter}			from 'node:events';
import i2c						from 'i2c-bus';
import uC, {addExitScript}		from '@phasn/phasn-utils';
import {rgbToHex, convertColor}	from './scripts/colorHandler.js';

const range = (start, stop, step=1) => {
	if(typeof stop === 'undefined'){
		stop = start;
		start = 0;
	}
	if((step>0 && start>=stop) || (step<0 && start<=stop)) return [];
	let result = [];
	for(let i=start; step>0 ? i<stop : i>stop; i+=step) result.push(i);

	return result;
};


// Defaults List
const BTN_SHIM_ADDR =	0x3f;
const REG_INPUT =		0x00;
const REG_OUTPUT =		0x01;
const REG_POLARITY =	0x02;
const REG_CONFIG =		0x03;
const LED_DATA =		7;
const LED_CLOCK =		6;

const HOLD_TIME =		1000;//			In *MILLI*seconds
const ERROR_LIMIT =		10;
const FPS =				60;
const LED_GAMMA = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
	2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
	6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 11, 11,
	11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18,
	19, 19, 20, 21, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 27, 28,
	29, 29, 30, 31, 31, 32, 33, 34, 34, 35, 36, 37, 37, 38, 39, 40,
	40, 41, 42, 43, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 54,
	55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
	71, 72, 73, 74, 76, 77, 78, 79, 80, 81, 83, 84, 85, 86, 88, 89,
	90, 91, 93, 94, 95, 96, 98, 99, 100, 102, 103, 104, 106, 107, 109, 110,
	111, 113, 114, 116, 117, 119, 120, 121, 123, 124, 126, 128, 129, 131, 132, 134,
	135, 137, 138, 140, 142, 143, 145, 146, 148, 150, 151, 153, 155, 157, 158, 160,
	162, 163, 165, 167, 169, 170, 172, 174, 176, 178, 179, 181, 183, 185, 187, 189,
	191, 193, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220,
	222, 224, 227, 229, 231, 233, 235, 237, 239, 241, 244, 246, 248, 250, 252, 255
];



export class BtnSHIM{
	constructor(config={}){
		this.busNumber		= config.busNumber		?? 1;
		this.bus			= config.bus			|| i2c.openSync(this.busNumber);
		this.address		= config.address		|| BTN_SHIM_ADDR;
		this.pollInterval	= config.pollInterval	|| (1000 / FPS);// 		In *MILLI*seconds
		this.holdTime		= config.holdTime		|| HOLD_TIME;
		this.errorLimit		= config.errorLimit		|| ERROR_LIMIT;
		this.errors			= 0;
		this.brightness		= 0.5;
		this.reg_queue		= [];
		this.led_queue		= [];
		this.color			= [0,0,0];
		this.btnEmitter		= new EventEmitter();
		this.runID			= undefined;
		this.running		= false;

		this.buttons = [
			{
				name: 'A',
				state: 0,
				holding: false,
				holdTimeout: undefined
			},
			{
				name: 'B',
				state: 0,
				holding: false,
				holdTimeout: undefined
			},
			{
				name: 'C',
				state: 0,
				holding: false,
				holdTimeout: undefined
			},
			{
				name: 'D',
				state: 0,
				holding: false,
				holdTimeout: undefined
			},
			{
				name: 'E',
				state: 0,
				holding: false,
				holdTimeout: undefined
			},
		];

		this.init();
	};

	init(){
		this.bus.writeByteSync(this.address, REG_CONFIG, 0b00011111);
		this.bus.writeByteSync(this.address, REG_POLARITY, 0x00);
		this.bus.writeByteSync(this.address, REG_OUTPUT, 0b00000000);

		addExitScript(this.terminate, this);

		this.start();
	};

	start(){
		if(this.running) return console.error('Button Shim is already running');

		this.running = true;
		this.runID = setInterval(()=>{this.run();}, this.pollInterval);
		this.setPixel(0, 0, 0);
	};

	stop(){
		if(!this.running) return console.error('Button Shim is not running');

		this.setPixel(0, 0, 0);

		clearInterval(this.runID);
		this.running = false;
		this.runID = undefined;
	};

	terminate(_this=this){
		if(_this.running){
			_this.setPixel(0, 0, 0);
			_this.updateLED();

			_this.stop();
		}
		_this.running = false;
	};

	run(){
		this.queryBtns();
		this.updateLED();
	};


//	~~~~~~~~ Button Methods ~~~~~~~~
	queryBtns(){
		let newStates = this.bus.readByteSync(this.address, REG_INPUT);

		for(let i=0; i<this.buttons.length; i++){
			let btn = this.buttons[i];
			let currState = (~newStates >> i) & 1;

			if(btn.state < currState)		this.onPress(btn);
			else if(btn.state > currState)	this.onRelease(btn);
		}
	};

	onPress(btn){
		btn.state = 1;
		btn.holdTimeout = setTimeout((btn)=>{this.onHold(btn);}, this.holdTime, btn);

		this.btnEmitter.emit('btnPress', btn.name);
	};

	onHold(btn){
		btn.holding = true;
		btn.holdTimeout = undefined;

		this.btnEmitter.emit('btnHold', btn.name);
	};

	onRelease(btn){
		btn.state = 0;
		if(btn.holdTimeout)	this.onNonHeldRelease(btn);
		else				this.onHeldRelease(btn);

		this.btnEmitter.emit('btnRelease', btn.name);
	};

	onNonHeldRelease(btn){
		clearTimeout(btn.holdTimeout);
		btn.holdTimeout = undefined;

		this.btnEmitter.emit('btnNonHeldRelease', btn.name);
	};

	onHeldRelease(btn){
		btn.holding = false;

		this.btnEmitter.emit('btnHeldRelease', btn.name);
	};


//	~~~~~~~~ LED Methods ~~~~~~~~
	updateLED(){
		let led_data = null;
		if(this.led_queue.length) led_data = this.led_queue.shift();

		try{
			if(led_data){
				for(let chunk of this._chunk(led_data, 32)){
					this.bus.writeI2cBlockSync(this.address, REG_OUTPUT, chunk.length, chunk);
				}
			}
		}catch(IOError){
			console.error(IOError);
			if(this.errorLimit >= 0)	this.errorThreshold();// Set error limit to -1 to prevent exits from errors
		}
	};

	errorThreshold(){
		this.errors += 1;

		if(this.error > this.errorLimit){
			this.running = false;
			throw new Error(`IOError: More than ${this.errorLimit} IO errors have occurred!`);
		}
	};

	_set_bit(pin, value){
		if(value)	this.reg_queue[-1] |= (1 << pin);
		else		this.reg_queue[-1] &= ~(1 << pin);
	};

	_next(){
		if(this.reg_queue.length===0)	this.reg_queue = [0b00000000];
		else							this.reg_queue.push(this.reg_queue[-1]);
	};

	_enqueue(){
		this.led_queue.push(this.reg_queue);
		this.reg_queue = [];
	};

	_chunk =  function* (l, n){
		for(let i of range(0, l.length+1, n)){
			let buf = Buffer.from(l.slice(i, i+n));
			yield buf;
		}
	};

	_write_byte(byte){
		for(let i=0; i<8; i++){
			this._next();
			this._set_bit(LED_CLOCK, 0);
			this._set_bit(LED_DATA, byte & 0b10000000);
			this._next();
			this._set_bit(LED_CLOCK, 1);
			byte <<= 1;
		}
	};

	setBrightness(brightness){
		if(typeof brightness !== 'number' || isNaN(brightness) || brightness<0 || brightness>1)	throw new Error('ValueError: Brightness should be an int or float between 0.0 and 1.0');

		let r = (this.brightness > 0) ? (this.color[0] / this.brightness) : 0;
		let g = (this.brightness > 0) ? (this.color[1] / this.brightness) : 0;
		let b = (this.brightness > 0) ? (this.color[2] / this.brightness) : 0;

		this.brightness = brightness;

		this.setPixel(r,g,b);
	};

	getBrightness(){
		return this.brightness;
	};

	setPixel(r,g,b){
		if(!Number.isInteger(r) || r<0 || r>255)	throw new Error('ValueError: Argument r should be an int from 0 to 255');
		if(!Number.isInteger(g) || g<0 || g>255)	throw new Error('ValueError: Argument g should be an int from 0 to 255');
		if(!Number.isInteger(b) || b<0 || b>255)	throw new Error('ValueError: Argument b should be an int from 0 to 255');

		r = parseInt(r * this.brightness);
		g = parseInt(g * this.brightness);
		b = parseInt(b * this.brightness);

		this.color = [r,g,b];

		this._write_byte(0);
		this._write_byte(0);
		this._write_byte(0b11101111);
		this._write_byte(LED_GAMMA[b & 0xff]);
		this._write_byte(LED_GAMMA[g & 0xff]);
		this._write_byte(LED_GAMMA[r & 0xff]);
		this._write_byte(0);
		this._write_byte(0);
		this._enqueue();
	};

	setColor(color){
		if(!color) return console.error('No color specified');

		let colorArr = convertColor(color, 'arr');
		if(!Array.isArray(colorArr)) return console.error('Could not set new color');

		this.setPixel(colorArr[0], colorArr[1], colorArr[2]);

		return console.log(`Set color to ${colorArr}`);
	};

	getColor(format='arr'){
		let r = this.color[0];
		let g = this.color[1];
		let b = this.color[2];

	// We don't need to use the validator from colorHandler.js
	// because the strip's values are already valid and formatted

		let hex = rgbToHex(r,g,b);

		console.log(`\tHex: ${hex}`);
		console.log(`\tR:   ${r}`);
		console.log(`\tG:   ${g}`);
		console.log(`\tB:   ${b}`);
		console.log(`\tBrightness: ${this.brightness}`);

		if(format==='hex') return hex;
		if(format==='arr') return [r,g,b];
		if(format==='obj') return {r,g,b};
	};
};

export default BtnSHIM;