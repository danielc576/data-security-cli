import path from 'path';
import { URL } from 'url';

// Replace __dirname from non-module node. May not work well if there are
// spaces in the path (will show up as %20).
//const __dirname = new URL('.', import.meta.url).pathname;

const exports = {
    mode: "production",
    entry: "./src/index.mjs",
    target: "node",
    output: {
        //filename: dst.js,
        path: path.resolve(".", "dist"),
        chunkFormat: "commonjs",
    },
    resolve: {
        extensions: ['.js', '.mjs'],
    }
};

export default exports;
