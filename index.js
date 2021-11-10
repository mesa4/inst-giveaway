import fs from 'fs';
import readline from 'readline';

const WORDS = {
	LIGHT: 'words_light',
	HEAVY: 'words_heavy'
};

const ENV_FLAGS = process?.argv;
const WORDS_DIR_PATH = __dirname.replace(/(dist)$/, WORDS.LIGHT);
const WORDS_FILES_NAME_LIST = fs.readdirSync(WORDS_DIR_PATH);

function getIntersectionList(arr1, arr2) {
	return [...new Set(arr1.filter(item => arr2.indexOf(item) !== -1))];
}

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

function getUniqueWordsList() {
	const localWordsList = WORDS_FILES_NAME_LIST.map(file => {
		const wordsFromFile = getWordsListFromFile(file);
		return [...new Set(wordsFromFile)];
	}).flat(Infinity);

	return [...new Set(localWordsList)];
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

async function uniqueValues() {
	console.time('uniqueValues');
	let uniqueWordsCount = 0;

	const uniqueWordsList = getUniqueWordsList();

	for (const word of uniqueWordsList) {
		let findTimes = 0;

		for (const fileName of WORDS_FILES_NAME_LIST) {
			if (findTimes > 1) {
				uniqueWordsCount++;
				break;
			}
			const isInclude = await isFileIncludesWord(word, fileName);
			if (isInclude) {
				findTimes++;
			}
		}
	}

	console.log('uniqueWordsCount: ', uniqueWordsCount);
	console.timeEnd('uniqueValues');
	return uniqueWordsCount;
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