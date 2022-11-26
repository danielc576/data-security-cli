import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const splitFile = require('split-file');

/**

 */
export class File {

    constructor() {
        this.dirPath = 'downloads';
        File.mkdir(this.dirPath);
    }

    static fragmentation(filePath, dest, fragmentMaxBytes) {
        return splitFile.splitFileBySize(filePath, fragmentMaxBytes, dest);
    }

    static assembleFragments(fragments, outputPath) {
        return splitFile.mergeFiles(fragments, outputPath);
    }

    static mkdir(dir) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive: true});
        }
    }

    static rmSync(dir) {
        fs.rmSync(dir, { recursive: true, force: true });
    }

    read(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    write(filePath, buffer) {
        fs.writeFile(`${this.dirPath}/${filePath}`, buffer, (err) => {
            console.log(`file ${filePath} saved successfully`);
            if (err) {
                throw err;
            }
        });
    }

    append(filePath, data) {
        fs.appendFile(filePath, data, (err) => {
            console.log(`data saved successfully to ${filePath}`);
            if (err) {
                throw err;
            }
        });
    }

    getFilesInDir(dirPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
        });
    }
}