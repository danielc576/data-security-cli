import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**

 */
export class YamlReader {

    constructor(path) {
        this.path = path;
        this.yml = yaml.load(fs.readFileSync(this.path, 'utf8'));
    }

    get() {
        return this.yml;
    }

    read(key) {
        try {
            if (this.yml.hasOwnProperty(key)) {
                return this.yml[key];
            }
        } catch (e) {
            console.log(e);
        }
    }
}
