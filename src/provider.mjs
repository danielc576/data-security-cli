import {YamlReader} from './yaml-reader.mjs';

/**

 */
 export class Provider {

    constructor() {
        this.yaml = new YamlReader('conf/config.yml');
        this.name = this.yaml.get().provider.name;
        this.accounts = this.yaml.get().provider.accounts;
        this.fragmentMaxSize = this.yaml.get().fragment_max_size;
    }

    getName() {
        return this.name;
    }

    getAccounts() {
        return this.accounts;
    }

    getFragmentMaxSize() {
        return this.fragmentMaxSize;
    }

    getBucketName(accountName) {
        let bucket = undefined;
        this.yaml.get().provider.accounts.forEach(account => {
            if (account.name === accountName) {
                bucket = account.bucket;
                return;
            }
        });
        return bucket;
    }
}
