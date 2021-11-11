import fs from 'fs';
import readline from 'readline';

const WORDS = {
	LIGHT: 'words_light',
	HEAVY: 'words_heavy'
};

const ENV_FLAGS = process?.argv;
const WORDS_DIR_PATH = __dirname.replace(/(dist)$/, WORDS.LIGHT);
const WORDS_FILES_NAME_LIST = fs.readdirSync(WORDS_DIR_PATH);

function getFileData(fileName) {
	const localFileName = `${WORDS_DIR_PATH}/${fileName}`;
	const options = {
		encoding: 'utf8',
		flag: 'r'
	};
	return fs.readFileSync(localFileName, options);
}

function getWordsListFromFile(fileName) {
	return getFileData(fileName)
		.toString()
		.replace(/\r\n/gm,'\n')
		.split('\n');
}

// function getUniqueWordsList() {
// 	const localWordsList = WORDS_FILES_NAME_LIST.map(file => {
// 		const wordsFromFile = getWordsListFromFile(file);
// 		return [...new Set(wordsFromFile)];
// 	}).flat(Infinity);
//
// 	return [...new Set(localWordsList)];
// }

function getUniqueWordsBenchList() {
	return WORDS_FILES_NAME_LIST.map(file => {
		const wordsFromFile = getWordsListFromFile(file);
		return [...new Set(wordsFromFile)];
	});
}

async function isFileIncludesWord(word, fileName) {
	const filePath = `${WORDS_DIR_PATH}/${fileName}`;
	const fileStream = fs.createReadStream(filePath);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let isIncludes = false;

	for await (const line of rl) {
		if (line.includes(word)) {
			isIncludes = true;
			break;
		}
	}

	return isIncludes;
}

function getDifferenceList(arr1 = [], arr2 = []) {
	return arr1.filter(item => arr2.indexOf(item) === -1);
}

function getComparedList(arr1 = [], arr2 = []) {
	return [...getDifferenceList(arr1, arr2), ...getDifferenceList(arr2, arr1)];
}

function countSteps(itemsCount, attempts = 0) {
	if (itemsCount === 1) return attempts;
	return countSteps(Math.ceil(itemsCount / 2), attempts + 1);
}

async function uniqueValues() {
	console.time('uniqueValues');

	// const uniqueWordsList = getUniqueWordsList();
	let uniqueBenchList = getUniqueWordsBenchList();
	const steps = countSteps(uniqueBenchList.length);

	for (let i = 1; i <= steps; i++) {
		const isLastStep = i === steps;
		const isOdd = uniqueBenchList.length % 2 !== 0;

		if (isLastStep) {
			uniqueBenchList = [getComparedList(uniqueBenchList[0], uniqueBenchList[1])];
		} else {
			uniqueBenchList = uniqueBenchList.map((item, index) => {
				if (isOdd && index === uniqueBenchList.length - 1) return item;
				if (index % 2 === 0) return false;
				return getComparedList(uniqueBenchList[index - 1], uniqueBenchList[index]);
			}).filter(Boolean);
		}
	}

	console.log('uniqueBenchList: ', uniqueBenchList);
	console.log('uniqueValues: ', uniqueBenchList[0].length);
	console.timeEnd('uniqueValues');
}

// function uniqueValues() {
// 	console.log('uniqueValues');
// }

function existInAllFiles() {
	console.log('existInAllFiles');
}

function atleastTen() {
	console.log('atleastTen');
}

function runScript() {
	if (ENV_FLAGS.includes('--uniqueValues')) {
		uniqueValues();
	} else if (ENV_FLAGS.includes('--existInAllFiles')) {
		existInAllFiles();
	} else if (ENV_FLAGS.includes('--atleastTen')) {
		atleastTen();
	} else {
		console.log('u should check README.md file !');
	}
}

runScript()