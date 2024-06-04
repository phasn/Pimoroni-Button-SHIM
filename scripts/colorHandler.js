//	==================================
//	{{{{{{{{ Input Validation }}}}}}}}
//	================================================================================================================================

const hexPattern = /^#([0-9A-F]{3}){1,2}$/i;// Detects either 3 or 6 character hex codes (the {1,2} means 3 characters matching '0-9' or 'A-Z' appears 1-2 times (i.e. 3 or 6 characters total))
const hexAlphaPattern = /^#[0-9A-F]{8}$/i;

const validateHex = input => {
	if(hexPattern.test(input))			console.log(`${input} interpreted as 3 or 6-character hex code`);
	if(hexAlphaPattern.test(input))		console.log(`${input} interpreted as 8-character transparency hex code`);
	return 'hex';
};

const validateArr = input => {
	if(		input.length === 3
		&&	typeof input[0] === 'number'	&& !isNaN(input[0])
		&&	typeof input[1] === 'number'	&& !isNaN(input[1])
		&&	typeof input[2] === 'number'	&& !isNaN(input[2])
		&&	0 <= input[0]
		&&	0 <= input[1]
		&&	0 <= input[2]
		&&	input[0] <= 255
		&&	input[1] <= 255
		&&	input[2] <= 255
	){
		console.log(`${input} interpreted as RGB array`);
		return 'arr';
	}

	if(		input.length === 4
		&&	typeof input[0] === 'number'	&& !isNaN(input[0])
		&&	typeof input[1] === 'number'	&& !isNaN(input[1])
		&&	typeof input[2] === 'number'	&& !isNaN(input[2])
		&&	typeof input[3] === 'number'	&& !isNaN(input[3])
		&&	0 <= input[0]
		&&	0 <= input[1]
		&&	0 <= input[2]
		&&	0 <= input[3]
		&&	input[0] <= 255
		&&	input[1] <= 255
		&&	input[2] <= 255
		&&	input[3] <= 255
	){
		console.log(`${input} interpreted as RGBA/RGBW array`);
		return 'arr';
	}

	return console.error('ERROR: Invalid color array');
};

const validateObj = input => {
	if(typeof input.red==='number' && !isNaN(input.red) && typeof input.r==='number' && !isNaN(input.r))		return console.error('ERROR: Input color object specified more than one value for red/r');
	if(typeof input.green==='number' && !isNaN(input.green) && typeof input.g==='number' && !isNaN(input.g))	return console.error('ERROR: Input color object specified more than one value for green/g');
	if(typeof input.blue==='number' && !isNaN(input.blue) && typeof input.b==='number' && !isNaN(input.b))		return console.error('ERROR: Input color object specified more than one value for blue/b');

	if(typeof input.red==='number' && !isNaN(input.red) && (typeof input.r!=='number' || isNaN(input.r)))		input.r = input.red;
	if(typeof input.green==='number' && !isNaN(input.green) && (typeof input.g!=='number' || isNaN(input.g)))	input.g = input.green;
	if(typeof input.blue==='number' && !isNaN(input.blue) && (typeof input.b!=='number' || isNaN(input.b)))		input.b = input.blue;


	if(		((typeof input.alpha==='number' && !isNaN(input.alpha)) || (typeof input.a==='number' && !isNaN(input.a)))
		&&	((typeof input.white==='number' && !isNaN(input.white)) || (typeof input.w==='number' && !isNaN(input.w)))
	)																													return console.error('ERROR: Color objects cannot contain both an alpha and a white value');

	if((typeof input.alpha==='number' && !isNaN(input.alpha)) || (typeof input.a==='number' && !isNaN(input.a))){
		if((typeof input.alpha==='number' && !isNaN(input.alpha)) && (typeof input.a==='number' && !isNaN(input.a)))	return console.error('ERROR: Input color object specified more than one value for alpha/a');
		if((typeof input.alpha==='number' && !isNaN(input.alpha)) && (typeof input.a!=='number' || isNaN(input.a)))		input.a = input.alpha;
	}
	if((typeof input.white==='number' && !isNaN(input.white)) || (typeof input.w==='number' && !isNaN(input.w))){
		if((typeof input.white==='number' && !isNaN(input.white)) && (typeof input.w==='number' && !isNaN(input.w)))	return console.error('ERROR: Input color object specified more than one value for white/w');
		if((typeof input.white==='number' && !isNaN(input.white)) && (typeof input.w!=='number' || isNaN(input.w)))		input.w = input.white;
	}

	if(		0 <= input.r
		&&	0 <= input.g
		&&	0 <= input.b
		&&	input.r <= 255
		&&	input.g <= 255
		&&	input.b <= 255
	){
		if(0 <= input.w && input.w <= 255)		console.log(`${input} interpreted as RGBW object`);
		else if(0 <= input.a && input.a <= 255)	console.log(`${input} interpreted as RGBA object`);
		else									console.log(`${input} interpreted as RGB object`);

	// If this block of code is being used to parse/correct the input rather than just identify its format,
	// change the white value to alpha since white technically isn't a valid channel
	// Otherwise comment out this if statement
		// if(typeof input.w==='number'){
		// 	input.a = input.w;
		// 	input.w = null;
		// }

		return 'obj';
	}

	return console.error('ERROR: color object is incomplete or invalid');
};

export const interpretColor = (input) => {
	if(!input) return console.error('No input specified');

	/* Hex Codes */
	if( hexPattern.test(input) || hexAlphaPattern.test(input) )	return validateHex(input);

	/* Color Arrays */
	if(Array.isArray(input)) return validateArr(input);

	/* Color Objects */
	if(		typeof input === 'object'
		&&	!Array.isArray(input)
		&&	input != null
		&&	((typeof input.red==='number' && !isNaN(input.red)) || (typeof input.r==='number' && !isNaN(input.r)))
		&&	((typeof input.green==='number' && !isNaN(input.green)) || (typeof input.g==='number' && !isNaN(input.g)))
		&&	((typeof input.blue==='number' && !isNaN(input.blue)) || (typeof input.b==='number' && !isNaN(input.b)))
	) return validateObj(input);

	return console.error('ERROR: Invalid color format');
};





//	===============================
//	{{{{{{{{ Input Parsing }}}}}}}}
//	================================================================================================================================

export const decToHex = dec => {
	dec = Math.max(0, Math.min(255, dec));// Clamp between 0 and 255
	let hex = dec.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
};

export const rgbToHex = (r, g, b, a) => '#' + decToHex(r) + decToHex(g) + decToHex(b) + ((typeof a==='number' && !isNaN(a)) ? decToHex(a) : '');

export const hexToRGB = hex => {
	const hex3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	const hex6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
	const hex8 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

	let c = hex3.exec(hex);
	hex = c ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}` : hex;

	let result	= hex8.test(hex) ? hex8.exec(hex)
				: hex6.exec(hex);

	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
		a: parseInt(result[4], 16) ?? null
	} : null;
};

export const convertColor = (input, returnFormat='arr') => {
	if(!input) return console.error('No input specified');
	if(!['hex', 'arr', 'obj'].includes(returnFormat)) return console.error(`'${returnFormat}' is not a valid format. Valid formats include 'hex', 'arr', and 'obj'`);

	let formatted;
	let inputFormat = interpretColor(input);
	if(inputFormat===returnFormat) return input;


	if(inputFormat==='hex'){
		let i = hexToRGB(input);// returns an obj

		// hex -> arr
		if(returnFormat==='arr'){
			formatted = [i.r, i.g, i.b];
			if(typeof i.a==='number' && !isNaN(i.a)) formatted.push(i.a);
		}

		// hex -> obj
		if(returnFormat==='obj'){
			formatted = {r: i.r, g: i.g, b: i.b};
			if(typeof i.a==='number' && !isNaN(i.a)) formatted.a = i.a;
		}
	}else


	if(returnFormat==='arr'){
		let i = input;

		// arr -> hex
		if(returnFormat==='hex') formatted = rgbToHex(...i);

		// arr -> obj
		if(returnFormat==='obj'){
			formatted = {r: i[0], g: i[1], b: i[2]};
			if(i.length===4) formatted.a = i[3];
		}
	}else


	if(returnFormat==='obj'){
		let i = input;
		if(typeof i.w==='number' && !isNaN(i.w) && typeof i.a==='undefined'){
			i.a = i.w;
			delete i.w;
		}

		// obj -> hex
		if(returnFormat==='hex') formatted = rgbToHex(i.r, i.g, i.b, i.a);

		// obj -> arr
		if(returnFormat==='arr'){
			formatted = [i.r, i.g, i.b];
			if(typeof i.a==='number' && !isNaN(i.a)) formatted.push(i.a);
		}
	}

	return formatted;
};

export default {
	decToHex,
	rgbToHex,
	hexToRGB,
	interpretColor,
	convertColor,
};