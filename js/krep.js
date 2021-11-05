// koffee 1.14.0

/*
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000
 */
var LI, NEWLINE, args, colorize, dump, fs, hasExt, highlightRanges, ignoreDir, ignoreFile, karg, klor, kolor, kstr, noon, output, pipeType, ref, regexp, search, slash, sliceRanges, tty;

fs = require('fs');

slash = require('kslash');

karg = require('karg');

klor = require('klor');

kstr = require('kstr');

tty = require('tty');

kolor = klor.kolor;

args = karg("krep\n    strings   . ? text to search for                . **\n    header    . ? print file headers                . = true  . - H\n    recurse   . ? recurse into subdirs              . = true  . - R\n    depth     . ? recursion depth                   . = ∞     . - D    \n    path      . ? file or folder to search in       . = |.|\n    ext       . ? search only files with extension  . = ||\n    coffee    . ? search only coffeescript files    . = false\n    js        . ? search only javascript files      . = false\n    noon      . ? search only noon files            . = false\n    styl      . ? search only styl files            . = false . - S\n    pug       . ? search only pug files             . = false . - P\n    md        . ? search only md files              . = false\n    cpp       . ? search only cpp files             . = false . - C\n    json      . ? search only json files            . = false . - J\n    numbers   . ? prefix with line numbers          . = false . - N\n    regexp    . ? strings are regexp patterns       . = false\n    dot       . ? search dot files                  . = false\n    stdin     . ? read from stdin                   . = false . - i\n    kolor     . ? colorize output                   . = true\n    replace   . ? replace found strings             . = 🔥💥👎💥🔥 . - Y\n    debug                                           . = false . - X\n\nversion       " + (require(__dirname + "/../package.json").version));

kolor.globalize(args.kolor);

if (args.replace !== '🔥💥👎💥🔥') {
    if (typeof args.replace !== 'string') {
        console.error(R4(y5(" no replace string provided! won't replace anything! use \"\" to replace with empty string. ")));
        args.replace = '🔥💥👎💥🔥';
    }
}

if (args.path === '.' && args.strings.length) {
    if (slash.exists(args.strings[0])) {
        if (args.strings.length > 1 || slash.isFile(args.strings[0])) {
            args.path = args.strings.shift();
        }
    } else if (slash.exists(args.strings.slice(-1)[0])) {
        args.path = args.strings.pop();
    }
}

if (args.depth === '∞') {
    args.depth = 2e308;
} else {
    args.depth = Math.max(0, parseInt(args.depth));
}

if (Number.isNaN(args.depth)) {
    args.depth = 0;
}

args.path = slash.resolve(args.path);

if ((ref = args.__ignored) != null ? ref.length : void 0) {
    args.strings = args.strings.concat(args.__ignored);
}

hasExt = ['coffee', 'noon', 'json', 'js', 'md', 'cpp', 'pug', 'styl'].map(function(t) {
    return args[t];
}).filter(function(b) {
    return b;
}).length > 0;

if (!hasExt) {
    args.any = true;
}

ignoreFile = function(p) {
    var base, ext;
    base = slash.basename(p);
    ext = slash.ext(p);
    if (slash.win()) {
        if (base[0] === '$') {
            return true;
        }
        if (base === 'desktop.ini') {
            return true;
        }
        if (base.toLowerCase().startsWith('ntuser')) {
            return true;
        }
    }
    if (p === args.path) {
        return false;
    }
    if (args.ext) {
        return ext !== args.ext;
    }
    if (base[0] === '.' && !args.dot) {
        return true;
    }
    if (args.any) {
        return false;
    }
    if (args.js && ext === 'js') {
        return false;
    }
    if (args.json && ext === 'json') {
        return false;
    }
    if (args.noon && ext === 'noon') {
        return false;
    }
    if (args.md && ext === 'md') {
        return false;
    }
    if (args.pug && ext === 'pug') {
        return false;
    }
    if (args.styl && ext === 'styl') {
        return false;
    }
    if (args.cpp && (ext === 'cpp' || ext === 'hpp' || ext === 'h')) {
        return false;
    }
    if (args.coffee && (ext === 'koffee' || ext === 'coffee')) {
        return false;
    }
    return true;
};

ignoreDir = function(p) {
    var base, ext;
    if (p === args.path) {
        return false;
    }
    base = slash.basename(p);
    ext = slash.ext(p);
    if (base[0] === '.') {
        return true;
    }
    if (base === 'node_modules') {
        return true;
    }
    if (ext === 'app') {
        return true;
    }
    return false;
};

NEWLINE = /\r?\n/;

if (args.strings.length) {
    if (args.regexp) {
        regexp = new RegExp("(" + args.strings.join('|') + ")", 'g');
    } else {
        regexp = new RegExp("(" + args.strings.map(function(s) {
            return kstr.escapeRegexp(s);
        }).join('|') + ")", 'g');
    }
} else {
    dump = true;
}

search = function(paths, depth) {
    if (depth == null) {
        depth = 0;
    }
    return paths.forEach(function(path) {
        var dir, file, header, highlights, index, j, k, line, lines, printHeader, ref1, ref2, rngs, sliced, text;
        if (slash.isDir(path)) {
            dir = slash.resolve(path);
            if (((args.recurse && depth < args.depth) || depth === 0) && !ignoreDir(dir)) {
                return search(fs.readdirSync(dir).map(function(p) {
                    return slash.join(dir, p);
                }), depth + 1);
            }
        } else if (slash.isText(path)) {
            file = slash.resolve(path);
            if (!ignoreFile(file)) {
                header = false;
                printHeader = function() {
                    var rel;
                    header = true;
                    if (args.header) {
                        rel = slash.relative(file, process.cwd());
                        console.log('');
                        console.log(W1(y5(' ▸ ' + g2(slash.dirname(rel) + '/' + y5(slash.base(rel) + y1('.' + slash.ext(rel) + ' '))))));
                        return console.log('');
                    }
                };
                text = slash.readText(file);
                lines = text.split(NEWLINE);
                rngs = klor.dissect(lines, slash.ext(file));
                for (index = j = 0, ref1 = lines.length; 0 <= ref1 ? j < ref1 : j > ref1; index = 0 <= ref1 ? ++j : --j) {
                    line = lines[index];
                    if (line.startsWith('//# sourceMappingURL')) {
                        continue;
                    }
                    if (dump) {
                        if (!header) {
                            printHeader();
                        }
                        output(rngs[index], index + 1, []);
                    } else {
                        if (line.search(regexp) >= 0) {
                            if (!header) {
                                printHeader();
                            }
                            highlights = highlightRanges(line, regexp);
                            if (!(highlights.length)) {
                                klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m173[39m', '[1m[97massertion failure![39m[22m');

                                process.exit(666);
                            };
                            sliced = sliceRanges(rngs[index], highlights);
                            output(sliced, index + 1, highlights);
                        }
                    }
                }
                if (regexp && !dump && args.replace !== '🔥💥👎💥🔥') {
                    for (index = k = 0, ref2 = lines.length; 0 <= ref2 ? k < ref2 : k > ref2; index = 0 <= ref2 ? ++k : --k) {
                        line = lines[index];
                        if (line.startsWith('//# sourceMappingURL')) {
                            continue;
                        }
                        lines[index] = line.replace(regexp, args.replace);
                    }
                    return slash.writeText(file, lines.join('\n'));
                }
            }
        }
    });
};

highlightRanges = function(line, regexp) {
    var m, ranges;
    ranges = [];
    while (m = regexp.exec(line)) {
        ranges.push({
            start: m.index,
            end: m.index + m[0].length - 1
        });
    }
    return ranges;
};

sliceRanges = function(ranges, highlights) {
    var after, before, h, i, range, ref1, ref2, split;
    h = 0;
    i = 0;
    while (i < ranges.length) {
        range = ranges[i];
        while (h < highlights.length && range.start > highlights[h].end) {
            h++;
        }
        if (h >= highlights.length) {
            return ranges;
        }
        split = 0;
        if ((range.start < (ref1 = highlights[h].start) && ref1 <= range.start + range.length)) {
            split = highlights[h].start - range.start;
        } else if ((range.start <= (ref2 = highlights[h].end) && ref2 < range.start + range.length)) {
            split = highlights[h].end - range.start + 1;
        }
        if (split) {
            before = Object.assign({}, range);
            after = Object.assign({}, range);
            before.match = range.match.slice(0, split);
            before.length = before.match.length;
            after.match = range.match.slice(split);
            after.length = after.match.length;
            after.start = range.start + before.length;
            ranges.splice(i, 1, before, after);
        }
        i++;
    }
    return ranges;
};

output = function(rngs, number, highlights) {
    var c, clrzd, h, highlight, i, j, numstr, ref1;
    clrzd = '';
    if (args.numbers) {
        numstr = String(number);
        clrzd += w2(numstr) + kstr.rpad('', 4 - numstr.length);
    }
    c = 0;
    h = 0;
    highlight = function(s) {
        if (h < highlights.length) {
            if (c >= highlights[h].start && c <= highlights[h].end) {
                return inverse(s);
            }
            while (h < highlights.length && c > highlights[h].end) {
                h++;
            }
        }
        return s;
    };
    for (i = j = 0, ref1 = rngs.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
        while (c < rngs[i].start) {
            clrzd += highlight(' ');
            c++;
        }
        clrzd += highlight(colorize(rngs[i]));
        c += rngs[i].match.length;
    }
    return console.log(clrzd);
};

LI = /(\sli\d\s|\sh\d\s)/;

colorize = function(chunk) {
    var c, cn, j, len, v;
    if (cn = kolor.map[chunk.clss]) {
        if (cn instanceof Array) {
            v = chunk.match;
            for (j = 0, len = cn.length; j < len; j++) {
                c = cn[j];
                v = global[c](v);
            }
            return v;
        } else {
            return global[cn](chunk.match);
        }
    }
    if (chunk.clss.endsWith('file')) {
        return w8(chunk.match);
    } else if (chunk.clss.endsWith('ext')) {
        return w3(chunk.match);
    } else if (chunk.clss.startsWith('punct')) {
        if (LI.test(chunk.clss)) {
            return colorize({
                match: chunk.match,
                clss: chunk.clss.replace(LI, ' ')
            });
        } else {
            return w2(chunk.match);
        }
    } else {
        if (LI.test(chunk.clss)) {
            return colorize({
                match: chunk.match,
                clss: chunk.clss.replace(LI, ' ')
            });
        } else {
            return chunk.match;
        }
    }
};

if (args.debug) {
    noon = require('noon');
    console.log(noon.stringify(args, {
        colors: true
    }));
}

if (!args.stdin) {
    search([args.path]);
    console.log('');
    process.exit(0);
}

pipeType = null;

process.stdin.on('readable', function() {
    var highlights, index, j, line, lines, ref1, ref2, results, rngs, sliced, text;
    if (!pipeType) {
        if (args.coffee) {
            pipeType = 'coffee';
        } else if (args.noon) {
            pipeType = 'noon';
        } else if (args.json) {
            pipeType = 'json';
        } else if (args.cpp) {
            pipeType = 'cpp';
        } else if (args.js) {
            pipeType = 'js';
        } else {
            pipeType = 'txt';
        }
    }
    if (text = (ref1 = process.stdin.read()) != null ? ref1.toString('utf8') : void 0) {
        lines = text.split(NEWLINE);
        rngs = klor.dissect(lines, pipeType);
        results = [];
        for (index = j = 0, ref2 = lines.length; 0 <= ref2 ? j < ref2 : j > ref2; index = 0 <= ref2 ? ++j : --j) {
            line = lines[index];
            if (line.startsWith('//# sourceMappingURL')) {
                continue;
            }
            if (dump) {
                results.push(output(rngs[index], index + 1, []));
            } else {
                if (line.search(regexp) >= 0) {
                    highlights = highlightRanges(line, regexp);
                    if (!(highlights.length)) {
                        klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m332[39m', '[1m[97massertion failure![39m[22m');

                        process.exit(666);
                    };
                    sliced = sliceRanges(rngs[index], highlights);
                    results.push(output(sliced, index + 1, highlights));
                } else {
                    results.push(void 0);
                }
            }
        }
        return results;
    }
});

process.stdin.on('end', function() {});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3JlcC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImtyZXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLEVBQUEsR0FBUSxPQUFBLENBQVEsSUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBQ1IsR0FBQSxHQUFRLE9BQUEsQ0FBUSxLQUFSOztBQUVSLEtBQUEsR0FBUSxJQUFJLENBQUM7O0FBRWIsSUFBQSxHQUFPLElBQUEsQ0FBSyxtNENBQUEsR0F3QkcsQ0FBQyxPQUFBLENBQVcsU0FBRCxHQUFXLGtCQUFyQixDQUF1QyxDQUFDLE9BQXpDLENBeEJSOztBQTJCUCxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFJLENBQUMsS0FBckI7O0FBRUEsSUFBRyxJQUFJLENBQUMsT0FBTCxLQUFnQixZQUFuQjtJQUVJLElBQUcsT0FBTyxJQUFJLENBQUMsT0FBWixLQUF1QixRQUExQjtRQUNHLE9BQUEsQ0FBQyxLQUFELENBQU8sRUFBQSxDQUFHLEVBQUEsQ0FBRyw4RkFBSCxDQUFILENBQVA7UUFDQyxJQUFJLENBQUMsT0FBTCxHQUFlLGFBRm5CO0tBRko7OztBQU1BLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxHQUFiLElBQXFCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBckM7SUFDSSxJQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQTFCLENBQUg7UUFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixHQUFzQixDQUF0QixJQUEyQixLQUFLLENBQUMsTUFBTixDQUFhLElBQUksQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUExQixDQUE5QjtZ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K0NBQTJCLENBQUUsUUFBdEIsQ0FBK0IsTUFBL0IsVUFBVjtRQUNJLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVg7UUFDUixJQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLFFBQXBCO0FBRVI7YUFBYSxrR0FBYjtZQUNJLElBQUEsR0FBTyxLQUFNLENBQUEsS0FBQTtZQUNiLElBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0Isc0JBQWhCLENBQUg7QUFDSSx5QkFESjs7WUFHQSxJQUFHLElBQUg7NkJBQ0ksTUFBQSxDQUFPLElBQUssQ0FBQSxLQUFBLENBQVosRUFBb0IsS0FBQSxHQUFNLENBQTFCLEVBQTZCLEVBQTdCLEdBREo7YUFBQSxNQUFBO2dCQUdJLElBQUcsSUFBSSxDQUFDLE1BQUwsQ0FBWSxNQUFaLENBQUEsSUFBdUIsQ0FBMUI7b0JBQ0ksVUFBQSxHQUFhLGVBQUEsQ0FBZ0IsSUFBaEIsRUFBc0IsTUFBdEI7b0JBQTRCLElBQUEsb0JBQUE7QUFBQTtBQUFBOzBDQUFBOztvQkFFekMsTUFBQSxHQUFTLFdBQUEsQ0FBWSxJQUFLLENBQUEsS0FBQSxDQUFqQixFQUF5QixVQUF6QjtpQ0FDVCxNQUFBLENBQU8sTUFBUCxFQUFlLEtBQUEsR0FBTSxDQUFyQixFQUF3QixVQUF4QixHQUpKO2lCQUFBLE1BQUE7eUNBQUE7aUJBSEo7O0FBTEo7dUJBSko7O0FBVHdCLENBQTVCOztBQTJCQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQWQsQ0FBaUIsS0FBakIsRUFBdUIsU0FBQSxHQUFBLENBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4wMDAgIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICBcbiMjI1xuXG5mcyAgICA9IHJlcXVpcmUgJ2ZzJ1xuc2xhc2ggPSByZXF1aXJlICdrc2xhc2gnXG5rYXJnICA9IHJlcXVpcmUgJ2thcmcnXG5rbG9yICA9IHJlcXVpcmUgJ2tsb3InXG5rc3RyICA9IHJlcXVpcmUgJ2tzdHInXG50dHkgICA9IHJlcXVpcmUgJ3R0eSdcblxua29sb3IgPSBrbG9yLmtvbG9yXG5cbmFyZ3MgPSBrYXJnIFwiXCJcIlxua3JlcFxuICAgIHN0cmluZ3MgICAuID8gdGV4dCB0byBzZWFyY2ggZm9yICAgICAgICAgICAgICAgIC4gKipcbiAgICBoZWFkZXIgICAgLiA/IHByaW50IGZpbGUgaGVhZGVycyAgICAgICAgICAgICAgICAuID0gdHJ1ZSAgLiAtIEhcbiAgICByZWN1cnNlICAgLiA/IHJlY3Vyc2UgaW50byBzdWJkaXJzICAgICAgICAgICAgICAuID0gdHJ1ZSAgLiAtIFJcbiAgICBkZXB0aCAgICAgLiA/IHJlY3Vyc2lvbiBkZXB0aCAgICAgICAgICAgICAgICAgICAuID0g4oieICAgICAuIC0gRCAgICBcbiAgICBwYXRoICAgICAgLiA/IGZpbGUgb3IgZm9sZGVyIHRvIHNlYXJjaCBpbiAgICAgICAuID0gfC58XG4gICAgZXh0ICAgICAgIC4gPyBzZWFyY2ggb25seSBmaWxlcyB3aXRoIGV4dGVuc2lvbiAgLiA9IHx8XG4gICAgY29mZmVlICAgIC4gPyBzZWFyY2ggb25seSBjb2ZmZWVzY3JpcHQgZmlsZXMgICAgLiA9IGZhbHNlXG4gICAganMgICAgICAgIC4gPyBzZWFyY2ggb25seSBqYXZhc2NyaXB0IGZpbGVzICAgICAgLiA9IGZhbHNlXG4gICAgbm9vbiAgICAgIC4gPyBzZWFyY2ggb25seSBub29uIGZpbGVzICAgICAgICAgICAgLiA9IGZhbHNlXG4gICAgc3R5bCAgICAgIC4gPyBzZWFyY2ggb25seSBzdHlsIGZpbGVzICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBTXG4gICAgcHVnICAgICAgIC4gPyBzZWFyY2ggb25seSBwdWcgZmlsZXMgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBQXG4gICAgbWQgICAgICAgIC4gPyBzZWFyY2ggb25seSBtZCBmaWxlcyAgICAgICAgICAgICAgLiA9IGZhbHNlXG4gICAgY3BwICAgICAgIC4gPyBzZWFyY2ggb25seSBjcHAgZmlsZXMgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBDXG4gICAganNvbiAgICAgIC4gPyBzZWFyY2ggb25seSBqc29uIGZpbGVzICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBKXG4gICAgbnVtYmVycyAgIC4gPyBwcmVmaXggd2l0aCBsaW5lIG51bWJlcnMgICAgICAgICAgLiA9IGZhbHNlIC4gLSBOXG4gICAgcmVnZXhwICAgIC4gPyBzdHJpbmdzIGFyZSByZWdleHAgcGF0dGVybnMgICAgICAgLiA9IGZhbHNlXG4gICAgZG90ICAgICAgIC4gPyBzZWFyY2ggZG90IGZpbGVzICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlXG4gICAgc3RkaW4gICAgIC4gPyByZWFkIGZyb20gc3RkaW4gICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBpXG4gICAga29sb3IgICAgIC4gPyBjb2xvcml6ZSBvdXRwdXQgICAgICAgICAgICAgICAgICAgLiA9IHRydWVcbiAgICByZXBsYWNlICAgLiA/IHJlcGxhY2UgZm91bmQgc3RyaW5ncyAgICAgICAgICAgICAuID0g8J+UpfCfkqXwn5GO8J+SpfCflKUgLiAtIFlcbiAgICBkZWJ1ZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuID0gZmFsc2UgLiAtIFhcblxudmVyc2lvbiAgICAgICAje3JlcXVpcmUoXCIje19fZGlybmFtZX0vLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259XG5cIlwiXCJcblxua29sb3IuZ2xvYmFsaXplIGFyZ3Mua29sb3JcblxuaWYgYXJncy5yZXBsYWNlICE9ICfwn5Sl8J+SpfCfkY7wn5Kl8J+UpSdcbiAgICBcbiAgICBpZiB0eXBlb2YgYXJncy5yZXBsYWNlICE9ICdzdHJpbmcnXG4gICAgICAgIGVycm9yIFI0IHk1IFwiIG5vIHJlcGxhY2Ugc3RyaW5nIHByb3ZpZGVkISB3b24ndCByZXBsYWNlIGFueXRoaW5nISB1c2UgXFxcIlxcXCIgdG8gcmVwbGFjZSB3aXRoIGVtcHR5IHN0cmluZy4gXCJcbiAgICAgICAgYXJncy5yZXBsYWNlID0gJ/CflKXwn5Kl8J+RjvCfkqXwn5SlJ1xuXG5pZiBhcmdzLnBhdGggPT0gJy4nIGFuZCBhcmdzLnN0cmluZ3MubGVuZ3RoXG4gICAgaWYgc2xhc2guZXhpc3RzIGFyZ3Muc3RyaW5nc1swXVxuICAgICAgICBpZiBhcmdzLnN0cmluZ3MubGVuZ3RoID4gMSBvciBzbGFzaC5pc0ZpbGUgYXJncy5zdHJpbmdzWzBdXG4gICAgICAgICAgICBhcmdzLnBhdGggPSBhcmdzLnN0cmluZ3Muc2hpZnQoKVxuICAgIGVsc2UgaWYgc2xhc2guZXhpc3RzIGFyZ3Muc3RyaW5nc1stMV1cbiAgICAgICAgYXJncy5wYXRoID0gYXJncy5zdHJpbmdzLnBvcCgpXG5cbmlmIGFyZ3MuZGVwdGggPT0gJ+KInicgdGhlbiBhcmdzLmRlcHRoID0gSW5maW5pdHlcbmVsc2UgYXJncy5kZXB0aCA9IE1hdGgubWF4IDAsIHBhcnNlSW50IGFyZ3MuZGVwdGhcbmlmIE51bWJlci5pc05hTiBhcmdzLmRlcHRoIHRoZW4gYXJncy5kZXB0aCA9IDBcbiAgICAgICAgXG5hcmdzLnBhdGggPSBzbGFzaC5yZXNvbHZlIGFyZ3MucGF0aFxuXG5pZiBhcmdzLl9faWdub3JlZD8ubGVuZ3RoXG4gICAgYXJncy5zdHJpbmdzID0gYXJncy5zdHJpbmdzLmNvbmNhdCBhcmdzLl9faWdub3JlZFxuICAgIFxuaGFzRXh0ID0gWydjb2ZmZWUnJ25vb24nJ2pzb24nJ2pzJydtZCcnY3BwJydwdWcnJ3N0eWwnXVxuICAgIC5tYXAgKHQpIC0+IGFyZ3NbdF1cbiAgICAuZmlsdGVyIChiKSAtPiBiXG4gICAgLmxlbmd0aCA+IDBcbiAgICBcbmlmIG5vdCBoYXNFeHQgdGhlbiBhcmdzLmFueSA9IHRydWVcblxuIyAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIFxuIyAwMDAgIDAwMCAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAgIDAwMCAgMDAwMCAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIFxuXG5pZ25vcmVGaWxlID0gKHApIC0+XG4gICAgXG4gICAgYmFzZSA9IHNsYXNoLmJhc2VuYW1lIHBcbiAgICBleHQgID0gc2xhc2guZXh0IHBcbiAgICBcbiAgICBpZiBzbGFzaC53aW4oKVxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlWzBdID09ICckJ1xuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlID09ICdkZXNrdG9wLmluaSdcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgYmFzZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGggJ250dXNlcidcbiAgICBcbiAgICByZXR1cm4gZmFsc2UgaWYgcCA9PSBhcmdzLnBhdGhcbiAgICBpZiBhcmdzLmV4dCB0aGVuIHJldHVybiBleHQgIT0gYXJncy5leHRcbiAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlWzBdID09ICcuJyBhbmQgbm90IGFyZ3MuZG90XG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuYW55XG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuanMgICAgIGFuZCBleHQgPT0gJ2pzJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmpzb24gICBhbmQgZXh0ID09ICdqc29uJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLm5vb24gICBhbmQgZXh0ID09ICdub29uJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLm1kICAgICBhbmQgZXh0ID09ICdtZCdcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5wdWcgICAgYW5kIGV4dCA9PSAncHVnJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLnN0eWwgICBhbmQgZXh0ID09ICdzdHlsJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmNwcCAgICBhbmQgZXh0IGluIFsnY3BwJywgJ2hwcCcsICdoJ11cbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5jb2ZmZWUgYW5kIGV4dCBpbiBbJ2tvZmZlZScnY29mZmVlJ11cbiAgICByZXR1cm4gdHJ1ZVxuXG5pZ25vcmVEaXIgPSAocCkgLT5cbiAgICBcbiAgICByZXR1cm4gZmFsc2UgaWYgcCA9PSBhcmdzLnBhdGhcbiAgICBiYXNlID0gc2xhc2guYmFzZW5hbWUgcFxuICAgIGV4dCAgPSBzbGFzaC5leHQgcFxuICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJy4nXG4gICAgcmV0dXJuIHRydWUgaWYgYmFzZSA9PSAnbm9kZV9tb2R1bGVzJ1xuICAgIHJldHVybiB0cnVlIGlmIGV4dCAgPT0gJ2FwcCdcbiAgICBmYWxzZVxuICAgICAgICAgICAgICAgIFxuIyAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICBcbiMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwICAgIDAwMCAgICAgICAwMDAwMDAwMDAgIFxuIyAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICBcbiMgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG5cbk5FV0xJTkUgPSAvXFxyP1xcbi9cblxuaWYgYXJncy5zdHJpbmdzLmxlbmd0aFxuICAgIGlmIGFyZ3MucmVnZXhwXG4gICAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAgXCIoXCIgKyBhcmdzLnN0cmluZ3Muam9pbignfCcpICsgXCIpXCIsICdnJ1xuICAgIGVsc2VcbiAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cCBcIihcIiArIGFyZ3Muc3RyaW5ncy5tYXAoKHMpIC0+IGtzdHIuZXNjYXBlUmVnZXhwKHMpKS5qb2luKCd8JykgKyBcIilcIiwgJ2cnXG5lbHNlXG4gICAgZHVtcCA9IHRydWVcblxuc2VhcmNoID0gKHBhdGhzLCBkZXB0aD0wKSAtPlxuICAgICAgICAgICAgXG4gICAgcGF0aHMuZm9yRWFjaCAocGF0aCkgLT5cbiAgICAgICAgXG4gICAgICAgIGlmIHNsYXNoLmlzRGlyIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGlyID0gc2xhc2gucmVzb2x2ZSBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgoYXJncy5yZWN1cnNlIGFuZCBkZXB0aCA8IGFyZ3MuZGVwdGgpIG9yIGRlcHRoID09IDApIGFuZCBub3QgaWdub3JlRGlyIGRpclxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNlYXJjaCBmcy5yZWFkZGlyU3luYyhkaXIpLm1hcCgocCkgLT4gc2xhc2guam9pbiBkaXIsIHApLCBkZXB0aCsxXG4gICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBzbGFzaC5pc1RleHQgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmaWxlID0gc2xhc2gucmVzb2x2ZSBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG5vdCBpZ25vcmVGaWxlIGZpbGVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHByaW50SGVhZGVyID0gLT5cbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmdzLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsID0gc2xhc2gucmVsYXRpdmUgZmlsZSwgcHJvY2Vzcy5jd2QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nICcnXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgVzEgeTUgJyDilrggJyArIGcyIHNsYXNoLmRpcm5hbWUocmVsKSArICcvJyArIHk1IHNsYXNoLmJhc2UocmVsKSArIHkxICcuJyArIHNsYXNoLmV4dChyZWwpICsgJyAnXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgJydcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0ZXh0ICA9IHNsYXNoLnJlYWRUZXh0IGZpbGVcbiAgICAgICAgICAgICAgICBsaW5lcyA9IHRleHQuc3BsaXQgTkVXTElORVxuICAgICAgICAgICAgICAgIHJuZ3MgID0ga2xvci5kaXNzZWN0IGxpbmVzLCBzbGFzaC5leHQgZmlsZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciBpbmRleCBpbiBbMC4uLmxpbmVzLmxlbmd0aF1cbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmVzW2luZGV4XVxuICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJyB0aGVuIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgIGlmIGR1bXBcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50SGVhZGVyKCkgaWYgbm90IGhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0IHJuZ3NbaW5kZXhdLCBpbmRleCsxLCBbXVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnNlYXJjaChyZWdleHApID49IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludEhlYWRlcigpIGlmIG5vdCBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRzID0gaGlnaGxpZ2h0UmFuZ2VzIGxpbmUsIHJlZ2V4cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKWuGFzc2VydCBoaWdobGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlZCA9IHNsaWNlUmFuZ2VzIHJuZ3NbaW5kZXhdLCBoaWdobGlnaHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0IHNsaWNlZCwgaW5kZXgrMSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIHJlZ2V4cCBhbmQgbm90IGR1bXAgYW5kIGFyZ3MucmVwbGFjZSAhPSAn8J+UpfCfkqXwn5GO8J+SpfCflKUnXG4gICAgICAgICAgICAgICAgICAgIGZvciBpbmRleCBpbiBbMC4uLmxpbmVzLmxlbmd0aF1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpbmRleF1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGxpbmUuc3RhcnRzV2l0aCAnLy8jIHNvdXJjZU1hcHBpbmdVUkwnIHRoZW4gY29udGludWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2luZGV4XSA9IGxpbmUucmVwbGFjZSByZWdleHAsIGFyZ3MucmVwbGFjZVxuICAgICAgICAgICAgICAgICAgICBzbGFzaC53cml0ZVRleHQgZmlsZSwgbGluZXMuam9pbiAnXFxuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwMDAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG5oaWdobGlnaHRSYW5nZXMgPSAobGluZSwgcmVnZXhwKSAtPlxuICAgIFxuICAgIHJhbmdlcyA9IFtdXG4gICAgd2hpbGUgbSA9IHJlZ2V4cC5leGVjIGxpbmVcbiAgICAgICAgcmFuZ2VzLnB1c2ggc3RhcnQ6bS5pbmRleCwgZW5kOm0uaW5kZXgrbVswXS5sZW5ndGgtMVxuICAgIHJhbmdlc1xuICAgIFxuc2xpY2VSYW5nZXMgPSAocmFuZ2VzLCBoaWdobGlnaHRzKSAtPlxuXG4gICAgaCA9IDBcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCByYW5nZXMubGVuZ3RoXG4gICAgICAgIHJhbmdlID0gcmFuZ2VzW2ldXG4gICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgcmFuZ2Uuc3RhcnQgPiBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgaCsrXG4gICAgICAgIFxuICAgICAgICBpZiBoID49IGhpZ2hsaWdodHMubGVuZ3RoIHRoZW4gcmV0dXJuIHJhbmdlc1xuXG4gICAgICAgIHNwbGl0ID0gMFxuICAgICAgICBpZiByYW5nZS5zdGFydCA8IGhpZ2hsaWdodHNbaF0uc3RhcnQgPD0gcmFuZ2Uuc3RhcnQrcmFuZ2UubGVuZ3RoXG4gICAgICAgICAgICBzcGxpdCAgPSBoaWdobGlnaHRzW2hdLnN0YXJ0IC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgZWxzZSBpZiByYW5nZS5zdGFydCA8PSBoaWdobGlnaHRzW2hdLmVuZCA8IHJhbmdlLnN0YXJ0K3JhbmdlLmxlbmd0aFxuICAgICAgICAgICAgc3BsaXQgPSBoaWdobGlnaHRzW2hdLmVuZCAtIHJhbmdlLnN0YXJ0ICsgMVxuXG4gICAgICAgIGlmIHNwbGl0XG4gICAgICAgICAgICBiZWZvcmUgPSBPYmplY3QuYXNzaWduIHt9LCByYW5nZVxuICAgICAgICAgICAgYWZ0ZXIgID0gT2JqZWN0LmFzc2lnbiB7fSwgcmFuZ2VcbiAgICAgICAgICAgIGJlZm9yZS5tYXRjaCAgPSByYW5nZS5tYXRjaFsuLi5zcGxpdF1cbiAgICAgICAgICAgIGJlZm9yZS5sZW5ndGggPSBiZWZvcmUubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5tYXRjaCAgID0gcmFuZ2UubWF0Y2hbc3BsaXQuLi5dXG4gICAgICAgICAgICBhZnRlci5sZW5ndGggID0gYWZ0ZXIubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5zdGFydCAgID0gcmFuZ2Uuc3RhcnQgKyBiZWZvcmUubGVuZ3RoXG4gICAgICAgICAgICByYW5nZXMuc3BsaWNlIGksIDEsIGJlZm9yZSwgYWZ0ZXJcbiAgICAgICAgaSsrXG4gICAgcmFuZ2VzXG4gICAgICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgICAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIFxuXG5vdXRwdXQgPSAocm5ncywgbnVtYmVyLCBoaWdobGlnaHRzKSAtPlxuICAgIFxuICAgIGNscnpkID0gJydcbiAgICBcbiAgICBpZiBhcmdzLm51bWJlcnNcbiAgICAgICAgbnVtc3RyID0gU3RyaW5nIG51bWJlclxuICAgICAgICBjbHJ6ZCArPSB3MihudW1zdHIpICsga3N0ci5ycGFkICcnLCA0LW51bXN0ci5sZW5ndGhcbiAgICAgICAgXG4gICAgYyA9IDBcbiAgICBoID0gMFxuICAgIGhpZ2hsaWdodCA9IChzKSAtPlxuICAgICAgICBpZiBoIDwgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGlmIGMgPj0gaGlnaGxpZ2h0c1toXS5zdGFydCBhbmQgYyA8PSBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnNlIHNcbiAgICAgICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgYyA+IGhpZ2hsaWdodHNbaF0uZW5kXG4gICAgICAgICAgICAgICAgaCsrXG4gICAgICAgIHNcbiAgICBcbiAgICBmb3IgaSBpbiBbMC4uLnJuZ3MubGVuZ3RoXVxuICAgICAgICB3aGlsZSBjIDwgcm5nc1tpXS5zdGFydCBcbiAgICAgICAgICAgIGNscnpkICs9IGhpZ2hsaWdodCAnICdcbiAgICAgICAgICAgIGMrK1xuICAgICAgICBjbHJ6ZCArPSBoaWdobGlnaHQgY29sb3JpemUgcm5nc1tpXVxuICAgICAgICBjICs9IHJuZ3NbaV0ubWF0Y2gubGVuZ3RoXG4gICAgICAgIFxuICAgIGxvZyBjbHJ6ZFxuXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuXG5MSSA9IC8oXFxzbGlcXGRcXHN8XFxzaFxcZFxccykvXG5cbmNvbG9yaXplID0gKGNodW5rKSAtPiBcbiAgICBcbiAgICBpZiBjbiA9IGtvbG9yLm1hcFtjaHVuay5jbHNzXVxuICAgICAgICBpZiBjbiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgICB2ID0gY2h1bmsubWF0Y2hcbiAgICAgICAgICAgIGZvciBjIGluIGNuXG4gICAgICAgICAgICAgICAgdiA9IGdsb2JhbFtjXSB2XG4gICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsW2NuXSBjaHVuay5tYXRjaFxuICAgIFxuICAgIGlmIGNodW5rLmNsc3MuZW5kc1dpdGggJ2ZpbGUnXG4gICAgICAgIHc4IGNodW5rLm1hdGNoXG4gICAgZWxzZSBpZiBjaHVuay5jbHNzLmVuZHNXaXRoICdleHQnXG4gICAgICAgIHczIGNodW5rLm1hdGNoXG4gICAgZWxzZSBpZiBjaHVuay5jbHNzLnN0YXJ0c1dpdGggJ3B1bmN0J1xuICAgICAgICBpZiBMSS50ZXN0IGNodW5rLmNsc3NcbiAgICAgICAgICAgIGNvbG9yaXplIG1hdGNoOmNodW5rLm1hdGNoLCBjbHNzOmNodW5rLmNsc3MucmVwbGFjZSBMSSwgJyAnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHcyIGNodW5rLm1hdGNoXG4gICAgZWxzZVxuICAgICAgICBpZiBMSS50ZXN0IGNodW5rLmNsc3NcbiAgICAgICAgICAgIGNvbG9yaXplIG1hdGNoOmNodW5rLm1hdGNoLCBjbHNzOmNodW5rLmNsc3MucmVwbGFjZSBMSSwgJyAnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNodW5rLm1hdGNoXG4gICAgXG5pZiBhcmdzLmRlYnVnXG4gICAgbm9vbiA9IHJlcXVpcmUgJ25vb24nXG4gICAgbG9nIG5vb24uc3RyaW5naWZ5IGFyZ3MsIGNvbG9yczp0cnVlXG5cbmlmIG5vdCBhcmdzLnN0ZGluXG4gICAgc2VhcmNoIFthcmdzLnBhdGhdXG4gICAgbG9nICcnXG4gICAgcHJvY2Vzcy5leGl0IDBcbiAgICBcbiMgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICBcbiMgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgIFxuIyAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwMCAgXG5cbnBpcGVUeXBlID0gbnVsbFxucHJvY2Vzcy5zdGRpbi5vbiAncmVhZGFibGUnIC0+XG4gICAgaWYgbm90IHBpcGVUeXBlXG4gICAgICAgIGlmICAgICAgYXJncy5jb2ZmZWUgdGhlbiBwaXBlVHlwZSA9ICdjb2ZmZWUnXG4gICAgICAgIGVsc2UgaWYgYXJncy5ub29uICAgdGhlbiBwaXBlVHlwZSA9ICdub29uJ1xuICAgICAgICBlbHNlIGlmIGFyZ3MuanNvbiAgIHRoZW4gcGlwZVR5cGUgPSAnanNvbidcbiAgICAgICAgZWxzZSBpZiBhcmdzLmNwcCAgICB0aGVuIHBpcGVUeXBlID0gJ2NwcCdcbiAgICAgICAgZWxzZSBpZiBhcmdzLmpzICAgICB0aGVuIHBpcGVUeXBlID0gJ2pzJ1xuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgcGlwZVR5cGUgPSAndHh0J1xuICAgICAgICBcbiAgICBpZiB0ZXh0ID0gcHJvY2Vzcy5zdGRpbi5yZWFkKCk/LnRvU3RyaW5nICd1dGY4J1xuICAgICAgICBsaW5lcyA9IHRleHQuc3BsaXQgTkVXTElORVxuICAgICAgICBybmdzICA9IGtsb3IuZGlzc2VjdCBsaW5lcywgcGlwZVR5cGVcbiAgICAgICAgXG4gICAgICAgIGZvciBpbmRleCBpbiBbMC4uLmxpbmVzLmxlbmd0aF1cbiAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpbmRleF1cbiAgICAgICAgICAgIGlmIGxpbmUuc3RhcnRzV2l0aCAnLy8jIHNvdXJjZU1hcHBpbmdVUkwnXG4gICAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgaWYgZHVtcFxuICAgICAgICAgICAgICAgIG91dHB1dCBybmdzW2luZGV4XSwgaW5kZXgrMSwgW11cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBsaW5lLnNlYXJjaChyZWdleHApID49IDBcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IGhpZ2hsaWdodFJhbmdlcyBsaW5lLCByZWdleHBcbiAgICAgICAgICAgICAgICAgICAg4pa4YXNzZXJ0IGhpZ2hsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHNsaWNlZCA9IHNsaWNlUmFuZ2VzIHJuZ3NbaW5kZXhdLCBoaWdobGlnaHRzXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCBzbGljZWQsIGluZGV4KzEsIGhpZ2hsaWdodHNcbiAgICAgICAgXG5wcm9jZXNzLnN0ZGluLm9uICdlbmQnIC0+IFxuICAgICJdfQ==
//# sourceURL=../coffee/krep.coffee