import {File} from './file.mjs';
import {Provider} from './provider.mjs';
import {DistributedHashTable} from './dht.mjs';
import {fromIni} from '@aws-sdk/credential-providers';
import {S3Client,PutObjectCommand,GetObjectCommand} from '@aws-sdk/client-s3';
import {loadSharedConfigFiles} from '@aws-sdk/shared-ini-file-loader';
import { Response } from 'node-fetch';

/**

 */
export class FileManager {

    constructor(fileName, dest) {
        this.provider = new Provider();
        this.file = new File();
        this.dht = new DistributedHashTable();
        this.fileName = fileName;
        this.dest = dest;
    }

    async upload() {
        const fragmentsDestDir = `${this.dest}/${this.fileName}.fragments`;
        const filePath = `${this.dest}/${this.fileName}`;
        File.mkdir(fragmentsDestDir);
        await File.fragmentation(filePath, fragmentsDestDir, this.provider.getFragmentMaxSize());
        const fragments = await this.file.getFilesInDir(fragmentsDestDir);
        let accountIdx = 0, accountName;
        fragments.forEach(async (fragmentFileName) => {
            const fragmentFilePath = `${fragmentsDestDir}/${fragmentFileName}`;
                accountName = this.provider.accounts[accountIdx].name;
                this.s3Upload(accountName, fragmentFileName, fragmentFilePath).catch(err => {
                        throw err;
                });
                accountName = this.provider.accounts[
                    accountIdx === (this.provider.accounts.length - 1) ? 0 : accountIdx + 1].name
                this.s3Upload(accountName, fragmentFileName, fragmentFilePath).catch(err => {
                        throw err;
                });
            accountIdx = ++accountIdx === this.provider.accounts.length ? 0 : accountIdx;
        });
    }

    async download(key) {
        const fragmentsDestDir = `${this.dest}/${this.fileName}.fragments`;
        File.mkdir(fragmentsDestDir);
        let fragments = [];
        for (let i = 0; i < this.provider.accounts.length; i++) {
            const accountName = this.provider.accounts[i].name;
            const bucket = this.provider.getBucketName(accountName);
            const dht = await this.dht.get(accountName, bucket, key);
            fragments = fragments.concat(dht);
        }
        // distinct rows by the key due to replication
        fragments = fragments.distinct('key: ');
        for (let i = 0; i < fragments.length; i++) {
            try {
                const obj = this.dht.getObject(fragments[i]);
                const getObjectCmd = new GetObjectCommand({Bucket: obj.bucket, Key: obj.key});
                const client = await this.loadCredentials(obj.account_name);
                const s3Response = await client.send(getObjectCmd);
                const response = new Response(s3Response.Body);
                const buffer = Buffer.from(await response.arrayBuffer());
                this.file.write(obj.key.replace(this.fileName, `${this.fileName}.fragments`), buffer);
            } catch(err)
            {
                throw err;
            } 
        }
    }

    async loadCredentials(accountName) {
        const s3Client = new S3Client({
            credentials: fromIni({profile: accountName}),
            region: (await loadSharedConfigFiles()).configFile?.[accountName]?.region,
        });
        return s3Client;
    }

    getS3Params(bucket, key, body) {
        return {
            Bucket: bucket, 
            Key: key,
            Body: body 
        };
    }

    async s3Upload(accountName, fragmentFileName, fragmentFilePath) {
        const client = await this.loadCredentials(accountName);
        const bucket = this.provider.getBucketName(accountName);
        const key = `${this.fileName}/${fragmentFileName}`;
        const body = await this.file.read(`./${fragmentFilePath}`);
        const s3Params = this.getS3Params(bucket, key, body);
        const putObjectCmd = new PutObjectCommand(s3Params);
        client.send(putObjectCmd).then(() => {
            console.log(`fragment ${fragmentFileName} uploaded successfully`);
            this.dht.put(accountName, bucket, key);
        }).catch(err=> {
            console.log(`failed to upload fragment ${fragmentFileName}: `, err);
            throw err;
        });
    }
}