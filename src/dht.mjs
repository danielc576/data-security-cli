import {File} from './file.mjs';

/**

 */
export class DistributedHashTable {

    constructor() {
        this.filePath = './db/dht.db';
        this.file = new File();
    }

    async put(accountName, bucket, key) {
        const fragments = await this.get(accountName, bucket, key);
        if (fragments.length === 0) {
            const data = `{account_name: ${accountName}, bucket: ${bucket}, key: ${key}}`;
            this.file.append(this.filePath, data + '\n');
        }
    }

    async get(accountName, bucket, key) {
        let fragments = [];
        const dht = await this.file.read(this.filePath);
        const data = dht.toString().split('\n');
        for (let i = 0; i < data.length; i++) {
            if (data[i].includes(`account_name: ${accountName}`) && 
                data[i].includes(`bucket: ${bucket}`) && 
                data[i].includes(`key: ${key}`)) {
                    fragments.push(data[i]);
                }
        }
        return fragments;
    }

    getObject(row) {
        const split = row.split(', '), 
              charAt = ': ';
        return {
            account_name: split[0].substr(split[0].indexOf(charAt) + 1).trim(),
            bucket: split[1].substr(split[1].indexOf(charAt) + 1).trim(),
            key: split[2].substr(split[2].indexOf(charAt) + 1).slice(0, -1).trim()
        }
    }
}

Array.prototype.distinct = function(col) {
    let arr = this.concat();
    for(let i = 0; i < arr.length; ++i) {
        for(let j = i+1; j < arr.length; ++j) {
            if(arr[i].substr(arr[i].indexOf(col)) === arr[j].substr(arr[j].indexOf(col)))
                arr.splice(j--, 1);
        }
    }
    return arr;
};
