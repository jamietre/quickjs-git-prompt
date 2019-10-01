/* must be compiled with quickjs */

import * as std from 'std'
import * as os from 'os'

import { utf8ArrayToStr } from './utils.js'

function getstdin() {
    const result = [];
    let length = 0;
    let chunk;
    while ((std.in.eof() != true)) {
        chunk = std.in.getByte()
        if (chunk > 0) {
            result.push(chunk);
            length += chunk.length;
        }
    }
    return utf8ArrayToStr(result);
}

const status = getstdin()
console.log(`${shortPath()}|${parseStatus(status)}`)

// last 2 segments of path
function shortPath() {
    const cwd = os.getcwd()[0]
    var parts = cwd.replace(/\\/g, '/').split('/');
    return parts.slice(-2).join('/');
}

function parseStatus(text) {
    var lines = text.replace(/\r\n/g, '\n')
        .replace(/\n\n/g,'\n')
        .replace(/^\s+|\s+$/, '') // final newline
        .split('\n');

   // format ## master...origin/master [ahead 2]
   // format ## master...origin/master [behind 2]

    var branch = "";
    var offset = "";
    var changed = "";

    if (lines.length)
    {
        if (lines[0].startsWith("fatal")) {
            return ""
        }
        if (lines.length > 1)
        {
            changed = "*";
        }

        var text = lines[0];
        var pos = text.indexOf("...");
        
        if (pos >= 0) {
            branch = text.substring(3, pos);
        } else {
            branch = text.substring(3);
        }

        pos = text.indexOf("[", Math.max(pos, 0));
        if (pos >= 0) {
            offset = text.substring(pos).trim().replace("ahead ", "+").replace("behind ", "-");
        }

        if (branch)
        {
            branch = " " + changed + branch + offset;
        }
    }
    return branch;
}

