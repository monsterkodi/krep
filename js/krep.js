// koffee 1.14.0

/*
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000
 */
var LI, NEWLINE, args, colorize, dump, fs, hasExt, highlightRanges, ignoreDir, ignoreFile, karg, klor, kolor, kstr, noon, output, pipeMode, pipeType, ref, regexp, search, slash, sliceRanges, startSearch;

fs = require('fs');

slash = require('kslash');

karg = require('karg');

klor = require('klor');

kstr = require('kstr');

kolor = klor.kolor;

args = karg("krep\n    strings   . ? text to search for                . **\n    header    . ? print file headers                . = true  . - H\n    recurse   . ? recurse into subdirs              . = true  . - R\n    depth     . ? recursion depth                   . = ∞     . - D    \n    path      . ? file or folder to search in       . = |.|\n    ext       . ? search only files with extension  . = ||\n    coffee    . ? search only coffeescript files    . = false\n    js        . ? search only javascript files      . = false\n    noon      . ? search only noon files            . = false\n    styl      . ? search only styl files            . = false . - S\n    pug       . ? search only pug files             . = false . - P\n    md        . ? search only md files              . = false\n    cpp       . ? search only cpp files             . = false . - C\n    json      . ? search only json files            . = false . - J\n    numbers   . ? prefix with line numbers          . = false . - N\n    regexp    . ? strings are regexp patterns       . = false\n    dot       . ? search dot files                  . = false\n    stdin     . ? read from stdin                   . = false . - i\n    kolor     . ? colorize output                   . = true\n    debug                                           . = false . - X\n\nversion       " + (require(__dirname + "/../package.json").version));

kolor.globalize(args.kolor);

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
        var dir, file, header, highlights, index, j, line, lines, printHeader, ref1, results, rngs, sliced, text;
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
                results = [];
                for (index = j = 0, ref1 = lines.length; 0 <= ref1 ? j < ref1 : j > ref1; index = 0 <= ref1 ? ++j : --j) {
                    line = lines[index];
                    if (line.startsWith('//# sourceMappingURL')) {
                        continue;
                    }
                    if (dump) {
                        if (!header) {
                            printHeader();
                        }
                        results.push(output(rngs[index], index + 1, []));
                    } else {
                        if (line.search(regexp) >= 0) {
                            if (!header) {
                                printHeader();
                            }
                            highlights = highlightRanges(line, regexp);
                            if (!(highlights.length)) {
                                klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m166[39m', '[1m[97massertion failure![39m[22m');

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

pipeMode = false;

pipeType = null;

process.stdin.on('readable', function() {
    var highlights, index, j, line, lines, ref1, ref2, results, rngs, sliced, text;
    pipeMode = true;
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
                        klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m317[39m', '[1m[97massertion failure![39m[22m');

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

startSearch = function() {
    if (!pipeMode && !args.stdin) {
        search([args.path]);
        console.log('');
        return process.exit(0);
    }
};

setTimeout(startSearch, 10);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3JlcC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImtyZXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLEVBQUEsR0FBUSxPQUFBLENBQVEsSUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBRVIsS0FBQSxHQUFRLElBQUksQ0FBQzs7QUFFYixJQUFBLEdBQU8sSUFBQSxDQUFLLHl6Q0FBQSxHQXVCRyxDQUFDLE9BQUEsQ0FBVyxTQUFELEdBQVcsa0JBQXJCLENBQXVDLENBQUMsT0FBekMsQ0F2QlI7O0FBMEJQLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQUksQ0FBQyxLQUFyQjs7QUFFQSxJQUFHLElBQUksQ0FBQyxJQUFMLEtBQWEsR0FBYixJQUFxQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQXJDO0lBQ0ksSUFBRyxLQUFLLENBQUMsTUFBTixDQUFhLElBQUksQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUExQixDQUFIO1FBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsR0FBc0IsQ0FBdEIsSUFBMkIsS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFJLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBMUIsQ0FBOUI7WUFDSSxJQUFJLENBQUMsSUFBTCxHQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBYixDQUFBLEVBRGhCO1NBREo7S0FBQSxNQUdLLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFJLENBQUMsT0FBUSxVQUFFLENBQUEsQ0FBQSxDQUE1QixDQUFIO1FBQ0QsSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQWIsQ0FBQSxFQURYO0tBSlQ7OztB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QSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQWQsQ0FBaUIsS0FBakIsRUFBdUIsU0FBQSxHQUFBLENBQXZCOztBQUVBLFdBQUEsR0FBYyxTQUFBO0lBQ1YsSUFBRyxDQUFJLFFBQUosSUFBaUIsQ0FBSSxJQUFJLENBQUMsS0FBN0I7UUFDSSxNQUFBLENBQU8sQ0FBQyxJQUFJLENBQUMsSUFBTixDQUFQO1FBQWtCLE9BQUEsQ0FDbEIsR0FEa0IsQ0FDZCxFQURjO2VBRWxCLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYixFQUhKOztBQURVOztBQU1kLFVBQUEsQ0FBVyxXQUFYLEVBQXdCLEVBQXhCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4wMDAgIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICBcbiMjI1xuXG5mcyAgICA9IHJlcXVpcmUgJ2ZzJ1xuc2xhc2ggPSByZXF1aXJlICdrc2xhc2gnXG5rYXJnICA9IHJlcXVpcmUgJ2thcmcnXG5rbG9yICA9IHJlcXVpcmUgJ2tsb3InXG5rc3RyICA9IHJlcXVpcmUgJ2tzdHInXG5cbmtvbG9yID0ga2xvci5rb2xvclxuXG5hcmdzID0ga2FyZyBcIlwiXCJcbmtyZXBcbiAgICBzdHJpbmdzICAgLiA/IHRleHQgdG8gc2VhcmNoIGZvciAgICAgICAgICAgICAgICAuICoqXG4gICAgaGVhZGVyICAgIC4gPyBwcmludCBmaWxlIGhlYWRlcnMgICAgICAgICAgICAgICAgLiA9IHRydWUgIC4gLSBIXG4gICAgcmVjdXJzZSAgIC4gPyByZWN1cnNlIGludG8gc3ViZGlycyAgICAgICAgICAgICAgLiA9IHRydWUgIC4gLSBSXG4gICAgZGVwdGggICAgIC4gPyByZWN1cnNpb24gZGVwdGggICAgICAgICAgICAgICAgICAgLiA9IOKIniAgICAgLiAtIEQgICAgXG4gICAgcGF0aCAgICAgIC4gPyBmaWxlIG9yIGZvbGRlciB0byBzZWFyY2ggaW4gICAgICAgLiA9IHwufFxuICAgIGV4dCAgICAgICAuID8gc2VhcmNoIG9ubHkgZmlsZXMgd2l0aCBleHRlbnNpb24gIC4gPSB8fFxuICAgIGNvZmZlZSAgICAuID8gc2VhcmNoIG9ubHkgY29mZmVlc2NyaXB0IGZpbGVzICAgIC4gPSBmYWxzZVxuICAgIGpzICAgICAgICAuID8gc2VhcmNoIG9ubHkgamF2YXNjcmlwdCBmaWxlcyAgICAgIC4gPSBmYWxzZVxuICAgIG5vb24gICAgICAuID8gc2VhcmNoIG9ubHkgbm9vbiBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIHN0eWwgICAgICAuID8gc2VhcmNoIG9ubHkgc3R5bCBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gU1xuICAgIHB1ZyAgICAgICAuID8gc2VhcmNoIG9ubHkgcHVnIGZpbGVzICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gUFxuICAgIG1kICAgICAgICAuID8gc2VhcmNoIG9ubHkgbWQgZmlsZXMgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGNwcCAgICAgICAuID8gc2VhcmNoIG9ubHkgY3BwIGZpbGVzICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gQ1xuICAgIGpzb24gICAgICAuID8gc2VhcmNoIG9ubHkganNvbiBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gSlxuICAgIG51bWJlcnMgICAuID8gcHJlZml4IHdpdGggbGluZSBudW1iZXJzICAgICAgICAgIC4gPSBmYWxzZSAuIC0gTlxuICAgIHJlZ2V4cCAgICAuID8gc3RyaW5ncyBhcmUgcmVnZXhwIHBhdHRlcm5zICAgICAgIC4gPSBmYWxzZVxuICAgIGRvdCAgICAgICAuID8gc2VhcmNoIGRvdCBmaWxlcyAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIHN0ZGluICAgICAuID8gcmVhZCBmcm9tIHN0ZGluICAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gaVxuICAgIGtvbG9yICAgICAuID8gY29sb3JpemUgb3V0cHV0ICAgICAgICAgICAgICAgICAgIC4gPSB0cnVlXG4gICAgZGVidWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBYXG5cbnZlcnNpb24gICAgICAgI3tyZXF1aXJlKFwiI3tfX2Rpcm5hbWV9Ly4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufVxuXCJcIlwiXG5cbmtvbG9yLmdsb2JhbGl6ZSBhcmdzLmtvbG9yXG5cbmlmIGFyZ3MucGF0aCA9PSAnLicgYW5kIGFyZ3Muc3RyaW5ncy5sZW5ndGhcbiAgICBpZiBzbGFzaC5leGlzdHMgYXJncy5zdHJpbmdzWzBdXG4gICAgICAgIGlmIGFyZ3Muc3RyaW5ncy5sZW5ndGggPiAxIG9yIHNsYXNoLmlzRmlsZSBhcmdzLnN0cmluZ3NbMF1cbiAgICAgICAgICAgIGFyZ3MucGF0aCA9IGFyZ3Muc3RyaW5ncy5zaGlmdCgpXG4gICAgZWxzZSBpZiBzbGFzaC5leGlzdHMgYXJncy5zdHJpbmdzWy0xXVxuICAgICAgICBhcmdzLnBhdGggPSBhcmdzLnN0cmluZ3MucG9wKClcblxuaWYgYXJncy5kZXB0aCA9PSAn4oieJyB0aGVuIGFyZ3MuZGVwdGggPSBJbmZpbml0eVxuZWxzZSBhcmdzLmRlcHRoID0gTWF0aC5tYXggMCwgcGFyc2VJbnQgYXJncy5kZXB0aFxuaWYgTnVtYmVyLmlzTmFOIGFyZ3MuZGVwdGggdGhlbiBhcmdzLmRlcHRoID0gMFxuICAgICAgICBcbmFyZ3MucGF0aCA9IHNsYXNoLnJlc29sdmUgYXJncy5wYXRoXG5cbmlmIGFyZ3MuX19pZ25vcmVkPy5sZW5ndGhcbiAgICBhcmdzLnN0cmluZ3MgPSBhcmdzLnN0cmluZ3MuY29uY2F0IGFyZ3MuX19pZ25vcmVkXG4gICAgXG5oYXNFeHQgPSBbJ2NvZmZlZScnbm9vbicnanNvbicnanMnJ21kJydjcHAnJ3B1Zycnc3R5bCddXG4gICAgLm1hcCAodCkgLT4gYXJnc1t0XVxuICAgIC5maWx0ZXIgKGIpIC0+IGJcbiAgICAubGVuZ3RoID4gMFxuICAgIFxuaWYgbm90IGhhc0V4dCB0aGVuIGFyZ3MuYW55ID0gdHJ1ZVxuXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMCAgXG4jIDAwMCAgMDAwICAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMCAgMDAwICAwMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgXG5cbmlnbm9yZUZpbGUgPSAocCkgLT5cbiAgICBcbiAgICBiYXNlID0gc2xhc2guYmFzZW5hbWUgcFxuICAgIGV4dCAgPSBzbGFzaC5leHQgcFxuICAgIFxuICAgIGlmIHNsYXNoLndpbigpXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJyQnXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2UgPT0gJ2Rlc2t0b3AuaW5pJ1xuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCAnbnR1c2VyJ1xuICAgIFxuICAgIHJldHVybiBmYWxzZSBpZiBwID09IGFyZ3MucGF0aFxuICAgIGlmIGFyZ3MuZXh0IHRoZW4gcmV0dXJuIGV4dCAhPSBhcmdzLmV4dFxuICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJy4nIGFuZCBub3QgYXJncy5kb3RcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5hbnlcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5qcyAgICAgYW5kIGV4dCA9PSAnanMnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuanNvbiAgIGFuZCBleHQgPT0gJ2pzb24nXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3Mubm9vbiAgIGFuZCBleHQgPT0gJ25vb24nXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MubWQgICAgIGFuZCBleHQgPT0gJ21kJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLnB1ZyAgICBhbmQgZXh0ID09ICdwdWcnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3Muc3R5bCAgIGFuZCBleHQgPT0gJ3N0eWwnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuY3BwICAgIGFuZCBleHQgaW4gWydjcHAnLCAnaHBwJywgJ2gnXVxuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmNvZmZlZSBhbmQgZXh0IGluIFsna29mZmVlJydjb2ZmZWUnXVxuICAgIHJldHVybiB0cnVlXG5cbmlnbm9yZURpciA9IChwKSAtPlxuICAgIFxuICAgIHJldHVybiBmYWxzZSBpZiBwID09IGFyZ3MucGF0aFxuICAgIGJhc2UgPSBzbGFzaC5iYXNlbmFtZSBwXG4gICAgZXh0ICA9IHNsYXNoLmV4dCBwXG4gICAgcmV0dXJuIHRydWUgaWYgYmFzZVswXSA9PSAnLidcbiAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlID09ICdub2RlX21vZHVsZXMnXG4gICAgcmV0dXJuIHRydWUgaWYgZXh0ICA9PSAnYXBwJ1xuICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICBcbiMgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgIDAwMDAwMDAwMCAgXG4jICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICBcblxuTkVXTElORSA9IC9cXHI/XFxuL1xuXG5pZiBhcmdzLnN0cmluZ3MubGVuZ3RoXG4gICAgaWYgYXJncy5yZWdleHBcbiAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cCBcIihcIiArIGFyZ3Muc3RyaW5ncy5qb2luKCd8JykgKyBcIilcIiwgJ2cnXG4gICAgZWxzZVxuICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwIFwiKFwiICsgYXJncy5zdHJpbmdzLm1hcCgocykgLT4ga3N0ci5lc2NhcGVSZWdleHAocykpLmpvaW4oJ3wnKSArIFwiKVwiLCAnZydcbmVsc2VcbiAgICBkdW1wID0gdHJ1ZVxuXG5zZWFyY2ggPSAocGF0aHMsIGRlcHRoPTApIC0+XG4gICAgICAgICAgICBcbiAgICBwYXRocy5mb3JFYWNoIChwYXRoKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgc2xhc2guaXNEaXIgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkaXIgPSBzbGFzaC5yZXNvbHZlIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKChhcmdzLnJlY3Vyc2UgYW5kIGRlcHRoIDwgYXJncy5kZXB0aCkgb3IgZGVwdGggPT0gMCkgYW5kIG5vdCBpZ25vcmVEaXIgZGlyXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VhcmNoIGZzLnJlYWRkaXJTeW5jKGRpcikubWFwKChwKSAtPiBzbGFzaC5qb2luIGRpciwgcCksIGRlcHRoKzFcbiAgICAgICAgICAgIFxuICAgICAgICBlbHNlIGlmIHNsYXNoLmlzVGV4dCBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbGUgPSBzbGFzaC5yZXNvbHZlIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IGlnbm9yZUZpbGUgZmlsZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGhlYWRlciA9IGZhbHNlXG4gICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIgPSAtPlxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MuaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWwgPSBzbGFzaC5yZWxhdGl2ZSBmaWxlLCBwcm9jZXNzLmN3ZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgJydcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBXMSB5NSAnIOKWuCAnICsgZzIgc2xhc2guZGlybmFtZShyZWwpICsgJy8nICsgeTUgc2xhc2guYmFzZShyZWwpICsgeTEgJy4nICsgc2xhc2guZXh0KHJlbCkgKyAnICdcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyAnJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRleHQgID0gc2xhc2gucmVhZFRleHQgZmlsZVxuICAgICAgICAgICAgICAgIGxpbmVzID0gdGV4dC5zcGxpdCBORVdMSU5FXG4gICAgICAgICAgICAgICAgcm5ncyAgPSBrbG9yLmRpc3NlY3QgbGluZXMsIHNsYXNoLmV4dCBmaWxlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIGluZGV4IGluIFswLi4ubGluZXMubGVuZ3RoXVxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICAgICAgICAgICAgICAgIGlmIGxpbmUuc3RhcnRzV2l0aCAnLy8jIHNvdXJjZU1hcHBpbmdVUkwnXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgICAgICBpZiBkdW1wXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludEhlYWRlcigpIGlmIG5vdCBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBybmdzW2luZGV4XSwgaW5kZXgrMSwgW11cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbGluZS5zZWFyY2gocmVnZXhwKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIoKSBpZiBub3QgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IGhpZ2hsaWdodFJhbmdlcyBsaW5lLCByZWdleHBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICDilrhhc3NlcnQgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQgPSBzbGljZVJhbmdlcyBybmdzW2luZGV4XSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBzbGljZWQsIGluZGV4KzEsIGhpZ2hsaWdodHNcblxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwMDAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG5oaWdobGlnaHRSYW5nZXMgPSAobGluZSwgcmVnZXhwKSAtPlxuICAgIFxuICAgIHJhbmdlcyA9IFtdXG4gICAgd2hpbGUgbSA9IHJlZ2V4cC5leGVjIGxpbmVcbiAgICAgICAgcmFuZ2VzLnB1c2ggc3RhcnQ6bS5pbmRleCwgZW5kOm0uaW5kZXgrbVswXS5sZW5ndGgtMVxuICAgIHJhbmdlc1xuICAgIFxuc2xpY2VSYW5nZXMgPSAocmFuZ2VzLCBoaWdobGlnaHRzKSAtPlxuXG4gICAgaCA9IDBcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCByYW5nZXMubGVuZ3RoXG4gICAgICAgIHJhbmdlID0gcmFuZ2VzW2ldXG4gICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgcmFuZ2Uuc3RhcnQgPiBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgaCsrXG4gICAgICAgIFxuICAgICAgICBpZiBoID49IGhpZ2hsaWdodHMubGVuZ3RoIHRoZW4gcmV0dXJuIHJhbmdlc1xuXG4gICAgICAgIHNwbGl0ID0gMFxuICAgICAgICBpZiByYW5nZS5zdGFydCA8IGhpZ2hsaWdodHNbaF0uc3RhcnQgPD0gcmFuZ2Uuc3RhcnQrcmFuZ2UubGVuZ3RoXG4gICAgICAgICAgICBzcGxpdCAgPSBoaWdobGlnaHRzW2hdLnN0YXJ0IC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgZWxzZSBpZiByYW5nZS5zdGFydCA8PSBoaWdobGlnaHRzW2hdLmVuZCA8IHJhbmdlLnN0YXJ0K3JhbmdlLmxlbmd0aFxuICAgICAgICAgICAgc3BsaXQgPSBoaWdobGlnaHRzW2hdLmVuZCAtIHJhbmdlLnN0YXJ0ICsgMVxuXG4gICAgICAgIGlmIHNwbGl0XG4gICAgICAgICAgICBiZWZvcmUgPSBPYmplY3QuYXNzaWduIHt9LCByYW5nZVxuICAgICAgICAgICAgYWZ0ZXIgID0gT2JqZWN0LmFzc2lnbiB7fSwgcmFuZ2VcbiAgICAgICAgICAgIGJlZm9yZS5tYXRjaCAgPSByYW5nZS5tYXRjaFsuLi5zcGxpdF1cbiAgICAgICAgICAgIGJlZm9yZS5sZW5ndGggPSBiZWZvcmUubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5tYXRjaCAgID0gcmFuZ2UubWF0Y2hbc3BsaXQuLi5dXG4gICAgICAgICAgICBhZnRlci5sZW5ndGggID0gYWZ0ZXIubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5zdGFydCAgID0gcmFuZ2Uuc3RhcnQgKyBiZWZvcmUubGVuZ3RoXG4gICAgICAgICAgICByYW5nZXMuc3BsaWNlIGksIDEsIGJlZm9yZSwgYWZ0ZXJcbiAgICAgICAgaSsrXG4gICAgcmFuZ2VzXG4gICAgICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgICAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIFxuXG5vdXRwdXQgPSAocm5ncywgbnVtYmVyLCBoaWdobGlnaHRzKSAtPlxuICAgIFxuICAgIGNscnpkID0gJydcbiAgICBcbiAgICBpZiBhcmdzLm51bWJlcnNcbiAgICAgICAgbnVtc3RyID0gU3RyaW5nIG51bWJlclxuICAgICAgICBjbHJ6ZCArPSB3MihudW1zdHIpICsga3N0ci5ycGFkICcnLCA0LW51bXN0ci5sZW5ndGhcbiAgICAgICAgXG4gICAgYyA9IDBcbiAgICBoID0gMFxuICAgIGhpZ2hsaWdodCA9IChzKSAtPlxuICAgICAgICBpZiBoIDwgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGlmIGMgPj0gaGlnaGxpZ2h0c1toXS5zdGFydCBhbmQgYyA8PSBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnNlIHNcbiAgICAgICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgYyA+IGhpZ2hsaWdodHNbaF0uZW5kXG4gICAgICAgICAgICAgICAgaCsrXG4gICAgICAgIHNcbiAgICBcbiAgICBmb3IgaSBpbiBbMC4uLnJuZ3MubGVuZ3RoXVxuICAgICAgICB3aGlsZSBjIDwgcm5nc1tpXS5zdGFydCBcbiAgICAgICAgICAgIGNscnpkICs9IGhpZ2hsaWdodCAnICdcbiAgICAgICAgICAgIGMrK1xuICAgICAgICBjbHJ6ZCArPSBoaWdobGlnaHQgY29sb3JpemUgcm5nc1tpXVxuICAgICAgICBjICs9IHJuZ3NbaV0ubWF0Y2gubGVuZ3RoXG4gICAgICAgIFxuICAgIGxvZyBjbHJ6ZFxuXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuXG5MSSA9IC8oXFxzbGlcXGRcXHN8XFxzaFxcZFxccykvXG5cbmNvbG9yaXplID0gKGNodW5rKSAtPiBcbiAgICBcbiAgICBpZiBjbiA9IGtvbG9yLm1hcFtjaHVuay5jbHNzXVxuICAgICAgICBpZiBjbiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgICB2ID0gY2h1bmsubWF0Y2hcbiAgICAgICAgICAgIGZvciBjIGluIGNuXG4gICAgICAgICAgICAgICAgIyB2ID0ga29sb3JbY10gdlxuICAgICAgICAgICAgICAgIHYgPSBnbG9iYWxbY10gdlxuICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyByZXR1cm4ga29sb3JbY25dIGNodW5rLm1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsW2NuXSBjaHVuay5tYXRjaFxuICAgIFxuICAgIGlmIGNodW5rLmNsc3MuZW5kc1dpdGggJ2ZpbGUnXG4gICAgICAgIHc4IGNodW5rLm1hdGNoXG4gICAgZWxzZSBpZiBjaHVuay5jbHNzLmVuZHNXaXRoICdleHQnXG4gICAgICAgIHczIGNodW5rLm1hdGNoXG4gICAgZWxzZSBpZiBjaHVuay5jbHNzLnN0YXJ0c1dpdGggJ3B1bmN0J1xuICAgICAgICBpZiBMSS50ZXN0IGNodW5rLmNsc3NcbiAgICAgICAgICAgIGNvbG9yaXplIG1hdGNoOmNodW5rLm1hdGNoLCBjbHNzOmNodW5rLmNsc3MucmVwbGFjZSBMSSwgJyAnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHcyIGNodW5rLm1hdGNoXG4gICAgZWxzZVxuICAgICAgICBpZiBMSS50ZXN0IGNodW5rLmNsc3NcbiAgICAgICAgICAgIGNvbG9yaXplIG1hdGNoOmNodW5rLm1hdGNoLCBjbHNzOmNodW5rLmNsc3MucmVwbGFjZSBMSSwgJyAnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNodW5rLm1hdGNoXG4gICAgXG5pZiBhcmdzLmRlYnVnXG4gICAgbm9vbiA9IHJlcXVpcmUgJ25vb24nXG4gICAgbG9nIG5vb24uc3RyaW5naWZ5IGFyZ3MsIGNvbG9yczp0cnVlXG5cbiMgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICBcbiMgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgIFxuIyAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwMCAgXG5cbnBpcGVNb2RlID0gZmFsc2VcbnBpcGVUeXBlID0gbnVsbFxucHJvY2Vzcy5zdGRpbi5vbiAncmVhZGFibGUnIC0+XG4gICAgcGlwZU1vZGUgPSB0cnVlIFxuICAgIGlmIG5vdCBwaXBlVHlwZVxuICAgICAgICBpZiAgICAgIGFyZ3MuY29mZmVlIHRoZW4gcGlwZVR5cGUgPSAnY29mZmVlJ1xuICAgICAgICBlbHNlIGlmIGFyZ3Mubm9vbiAgIHRoZW4gcGlwZVR5cGUgPSAnbm9vbidcbiAgICAgICAgZWxzZSBpZiBhcmdzLmpzb24gICB0aGVuIHBpcGVUeXBlID0gJ2pzb24nXG4gICAgICAgIGVsc2UgaWYgYXJncy5jcHAgICAgdGhlbiBwaXBlVHlwZSA9ICdjcHAnXG4gICAgICAgIGVsc2UgaWYgYXJncy5qcyAgICAgdGhlbiBwaXBlVHlwZSA9ICdqcydcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgIHBpcGVUeXBlID0gJ3R4dCdcbiAgICAgICAgXG4gICAgaWYgdGV4dCA9IHByb2Nlc3Muc3RkaW4ucmVhZCgpPy50b1N0cmluZyAndXRmOCdcbiAgICAgICAgbGluZXMgPSB0ZXh0LnNwbGl0IE5FV0xJTkVcbiAgICAgICAgcm5ncyAgPSBrbG9yLmRpc3NlY3QgbGluZXMsIHBpcGVUeXBlXG4gICAgICAgIFxuICAgICAgICBmb3IgaW5kZXggaW4gWzAuLi5saW5lcy5sZW5ndGhdXG4gICAgICAgICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJ1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGlmIGR1bXBcbiAgICAgICAgICAgICAgICBvdXRwdXQgcm5nc1tpbmRleF0sIGluZGV4KzEsIFtdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgbGluZS5zZWFyY2gocmVnZXhwKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMgPSBoaWdobGlnaHRSYW5nZXMgbGluZSwgcmVnZXhwXG4gICAgICAgICAgICAgICAgICAgIOKWuGFzc2VydCBoaWdobGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBzbGljZWQgPSBzbGljZVJhbmdlcyBybmdzW2luZGV4XSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgc2xpY2VkLCBpbmRleCsxLCBoaWdobGlnaHRzXG4gICAgICAgIFxucHJvY2Vzcy5zdGRpbi5vbiAnZW5kJyAtPiBcblxuc3RhcnRTZWFyY2ggPSAtPlxuICAgIGlmIG5vdCBwaXBlTW9kZSBhbmQgbm90IGFyZ3Muc3RkaW5cbiAgICAgICAgc2VhcmNoIFthcmdzLnBhdGhdXG4gICAgICAgIGxvZyAnJ1xuICAgICAgICBwcm9jZXNzLmV4aXQgMFxuICAgIFxuc2V0VGltZW91dCBzdGFydFNlYXJjaCwgMTBcbiJdfQ==
//# sourceURL=../coffee/krep.coffee