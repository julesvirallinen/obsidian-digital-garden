import { Base64 } from "js-base64";
import slugify from "@sindresorhus/slugify";
import sha1 from "crypto-js/sha1";
import { PathRewriteRules } from "./DigitalGardenSiteManager";

const REWRITE_RULE_DELIMITER = ":"

function arrayBufferToBase64(buffer: ArrayBuffer) {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return Base64.btoa(binary);
}

function extractBaseUrl(url: string) {
	return url && url.replace("https://", "").replace("http://", "").replace(/\/$/, '')
}

function generateUrlPath(filePath: string, slugifyPath = true): string {
	if(!filePath){
		return filePath;
	}
	const extensionLessPath = filePath.substring(0, filePath.lastIndexOf("."));

	if(!slugifyPath){
		return extensionLessPath  + "/";
	}

	return extensionLessPath.split("/").map(x => slugify(x)).join("/") + "/";
}

function generateBlobHash(content: string){
	const byteLength = (new TextEncoder().encode(content)).byteLength;
	const header = `blob ${byteLength}\0`;
	const gitBlob = header + content;

	return sha1(gitBlob).toString();
}

function kebabize(str: string){ 
	return str.split('').map((letter, idx) => {
	  return letter.toUpperCase() === letter
	   ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
	   : letter;
	}).join('');
 }

 const wrapAround = (value: number, size: number): number => {
	return ((value % size) + size) % size;
 };
  
function getRewriteRules(pathRewriteRules: string): PathRewriteRules {
	return pathRewriteRules
		.split("\n")
		.filter((line: string) => line.includes(REWRITE_RULE_DELIMITER))
		.map((line: string) => {
			const [searchPath, newPath] = line.split(REWRITE_RULE_DELIMITER);

			return { from: searchPath, to: newPath }
		})
}

function getGardenPathForNote(vaultPath: string, rules: PathRewriteRules): string {
	for (const { from, to } of rules) {
		if (vaultPath.startsWith(from)) {
			return vaultPath.replace(from, to)
		}
	}
	return vaultPath;
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}




export { arrayBufferToBase64, extractBaseUrl, generateUrlPath, generateBlobHash, kebabize, wrapAround, getRewriteRules, getGardenPathForNote, escapeRegExp};
