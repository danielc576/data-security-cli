import _yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const yargs = _yargs(hideBin(process.argv));
export const action_accepted_values = {cp: 'cp', get: 'get', delete: 'delete'};

export class CommandLineInterface {

    constructor() {
        this.cli = {
            action: {
                alias: 'a',
                description: 'upload-file(s), download-file(s), delete-file(s)',
                type: 'string',
                demandOption: true,
            },
            path: {
                alias: 'p',
                description: 'path to the file or folder',
                type: 'string',
                demandOption: true,
            }
        };

        this.argv = yargs
            .usage('\nData Security Tool (dst)')
            .option('action', this.cli.action)
            .option('path', this.cli.path)
            .help()
            .alias('help', 'h')
            .example('$0 -a cp -p resource/sample.jpg').argv;
    }

    parseCommands() {
        if (!(this.argv.action in action_accepted_values)) {
            console.log(`action '${this.argv.action}' is not supported`);
            process.exit(1);
        }
        return {action: this.argv.action, path: this.argv.path, fragment_byte: this.argv.fragment_byte};
    }
}
