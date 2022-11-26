import {CommandLineInterface, action_accepted_values} from './cli.mjs';
import {FileManager} from './file-manager.mjs';
import {File} from './file.mjs';

/**

 */
const cli = new CommandLineInterface();
const args = cli.parseCommands();
if (args.action === action_accepted_values.cp) {
    const fileName = args.path.substr(args.path.lastIndexOf('/') + 1); // sample.jpg; dump.sql;
    const dest = args.path.substr(0, args.path.indexOf('/')); // resource
    const fileManager = new FileManager(fileName, dest);
    (await fileManager.upload());
} else if (args.action === action_accepted_values.get) {
    const fileName = args.path.substr(args.path.lastIndexOf('/') + 1); // sample.jpg; dump.sql;
    const dest = 'downloads';
    const fileManager = new FileManager(fileName, dest);
    const file = new File();
    (await fileManager.download(args.path));
    const fragments = await file.getFilesInDir(`${dest}/${fileName}.fragments`);
    for (let i = 0; i < fragments.length; i++) {
        fragments[i] = `${dest}/${fileName}.fragments/${fragments[i]}`;
    }
    (await File.assembleFragments(fragments, `${dest}/${fileName}`));
    File.rmSync(`${dest}/${fileName}.fragments`);
    console.log(`file ${fileName} downloaded successfully`);
}


