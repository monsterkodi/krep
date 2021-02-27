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
                                klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m167[39m', '[1m[97massertion failure![39m[22m');

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
                        klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m316[39m', '[1m[97massertion failure![39m[22m');

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

if (process.stdin.isTTY && !args.stdin) {
    search([args.path]);
    console.log('');
    process.exit(0);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3JlcC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImtyZXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLEVBQUEsR0FBUSxPQUFBLENBQVEsSUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBQ1IsR0FBQSxHQUFRLE9BQUEsQ0FBUSxLQUFSOztBQUVSLEtBQUEsR0FBUSxJQUFJLENBQUM7O0FBRWIsSUFBQSxHQUFPLElBQUEsQ0FBSyx5ekNBQUEsR0F1QkcsQ0FBQyxPQUFBLENBQVcsU0FBRCxHQUFXLGtCQUFyQixDQUF1QyxDQUFDLE9BQXpDLENBdkJSOztBQTBCUCxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFJLENBQUMsS0FBckI7O0FBRUEsSUFBRyxJQUFJLENBQUMsSUFBTCxLQUFhLEdBQWIsSUFBcUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFyQztJQUNJLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFJLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBMUIsQ0FBSDtRQUNJLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFiLEdBQXNCLENBQXRCLElBQTJCLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQTFCLENBQTlCO1lBQ0ksSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQWIsQ0FBQSxFQURoQjtTQURKO0tBQUEsTUFHSyxJQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLE9BQVEsVUFBRSxDQUFBLENBQUEsQ0FBNUIsQ0FBSDtRQUNELElBQUksQ0FBQyxJQUFMLEdBQVksSUFBSSxDQUFDLE9B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QSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQWQsQ0FBaUIsS0FBakIsRUFBdUIsU0FBQSxHQUFBLENBQXZCOztBQUVBLElBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFkLElBQXdCLENBQUksSUFBSSxDQUFDLEtBQXBDO0lBQ0ksTUFBQSxDQUFPLENBQUMsSUFBSSxDQUFDLElBQU4sQ0FBUDtJQUFrQixPQUFBLENBQ2xCLEdBRGtCLENBQ2QsRUFEYztJQUVsQixPQUFPLENBQUMsSUFBUixDQUFhLENBQWIsRUFISiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgXG4jIyNcblxuZnMgICAgPSByZXF1aXJlICdmcydcbnNsYXNoID0gcmVxdWlyZSAna3NsYXNoJ1xua2FyZyAgPSByZXF1aXJlICdrYXJnJ1xua2xvciAgPSByZXF1aXJlICdrbG9yJ1xua3N0ciAgPSByZXF1aXJlICdrc3RyJ1xudHR5ICAgPSByZXF1aXJlICd0dHknXG5cbmtvbG9yID0ga2xvci5rb2xvclxuXG5hcmdzID0ga2FyZyBcIlwiXCJcbmtyZXBcbiAgICBzdHJpbmdzICAgLiA/IHRleHQgdG8gc2VhcmNoIGZvciAgICAgICAgICAgICAgICAuICoqXG4gICAgaGVhZGVyICAgIC4gPyBwcmludCBmaWxlIGhlYWRlcnMgICAgICAgICAgICAgICAgLiA9IHRydWUgIC4gLSBIXG4gICAgcmVjdXJzZSAgIC4gPyByZWN1cnNlIGludG8gc3ViZGlycyAgICAgICAgICAgICAgLiA9IHRydWUgIC4gLSBSXG4gICAgZGVwdGggICAgIC4gPyByZWN1cnNpb24gZGVwdGggICAgICAgICAgICAgICAgICAgLiA9IOKIniAgICAgLiAtIEQgICAgXG4gICAgcGF0aCAgICAgIC4gPyBmaWxlIG9yIGZvbGRlciB0byBzZWFyY2ggaW4gICAgICAgLiA9IHwufFxuICAgIGV4dCAgICAgICAuID8gc2VhcmNoIG9ubHkgZmlsZXMgd2l0aCBleHRlbnNpb24gIC4gPSB8fFxuICAgIGNvZmZlZSAgICAuID8gc2VhcmNoIG9ubHkgY29mZmVlc2NyaXB0IGZpbGVzICAgIC4gPSBmYWxzZVxuICAgIGpzICAgICAgICAuID8gc2VhcmNoIG9ubHkgamF2YXNjcmlwdCBmaWxlcyAgICAgIC4gPSBmYWxzZVxuICAgIG5vb24gICAgICAuID8gc2VhcmNoIG9ubHkgbm9vbiBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIHN0eWwgICAgICAuID8gc2VhcmNoIG9ubHkgc3R5bCBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gU1xuICAgIHB1ZyAgICAgICAuID8gc2VhcmNoIG9ubHkgcHVnIGZpbGVzICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gUFxuICAgIG1kICAgICAgICAuID8gc2VhcmNoIG9ubHkgbWQgZmlsZXMgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGNwcCAgICAgICAuID8gc2VhcmNoIG9ubHkgY3BwIGZpbGVzICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gQ1xuICAgIGpzb24gICAgICAuID8gc2VhcmNoIG9ubHkganNvbiBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gSlxuICAgIG51bWJlcnMgICAuID8gcHJlZml4IHdpdGggbGluZSBudW1iZXJzICAgICAgICAgIC4gPSBmYWxzZSAuIC0gTlxuICAgIHJlZ2V4cCAgICAuID8gc3RyaW5ncyBhcmUgcmVnZXhwIHBhdHRlcm5zICAgICAgIC4gPSBmYWxzZVxuICAgIGRvdCAgICAgICAuID8gc2VhcmNoIGRvdCBmaWxlcyAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIHN0ZGluICAgICAuID8gcmVhZCBmcm9tIHN0ZGluICAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gaVxuICAgIGtvbG9yICAgICAuID8gY29sb3JpemUgb3V0cHV0ICAgICAgICAgICAgICAgICAgIC4gPSB0cnVlXG4gICAgZGVidWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBYXG5cbnZlcnNpb24gICAgICAgI3tyZXF1aXJlKFwiI3tfX2Rpcm5hbWV9Ly4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufVxuXCJcIlwiXG5cbmtvbG9yLmdsb2JhbGl6ZSBhcmdzLmtvbG9yXG5cbmlmIGFyZ3MucGF0aCA9PSAnLicgYW5kIGFyZ3Muc3RyaW5ncy5sZW5ndGhcbiAgICBpZiBzbGFzaC5leGlzdHMgYXJncy5zdHJpbmdzWzBdXG4gICAgICAgIGlmIGFyZ3Muc3RyaW5ncy5sZW5ndGggPiAxIG9yIHNsYXNoLmlzRmlsZSBhcmdzLnN0cmluZ3NbMF1cbiAgICAgICAgICAgIGFyZ3MucGF0aCA9IGFyZ3Muc3RyaW5ncy5zaGlmdCgpXG4gICAgZWxzZSBpZiBzbGFzaC5leGlzdHMgYXJncy5zdHJpbmdzWy0xXVxuICAgICAgICBhcmdzLnBhdGggPSBhcmdzLnN0cmluZ3MucG9wKClcblxuaWYgYXJncy5kZXB0aCA9PSAn4oieJyB0aGVuIGFyZ3MuZGVwdGggPSBJbmZpbml0eVxuZWxzZSBhcmdzLmRlcHRoID0gTWF0aC5tYXggMCwgcGFyc2VJbnQgYXJncy5kZXB0aFxuaWYgTnVtYmVyLmlzTmFOIGFyZ3MuZGVwdGggdGhlbiBhcmdzLmRlcHRoID0gMFxuICAgICAgICBcbmFyZ3MucGF0aCA9IHNsYXNoLnJlc29sdmUgYXJncy5wYXRoXG5cbmlmIGFyZ3MuX19pZ25vcmVkPy5sZW5ndGhcbiAgICBhcmdzLnN0cmluZ3MgPSBhcmdzLnN0cmluZ3MuY29uY2F0IGFyZ3MuX19pZ25vcmVkXG4gICAgXG5oYXNFeHQgPSBbJ2NvZmZlZScnbm9vbicnanNvbicnanMnJ21kJydjcHAnJ3B1Zycnc3R5bCddXG4gICAgLm1hcCAodCkgLT4gYXJnc1t0XVxuICAgIC5maWx0ZXIgKGIpIC0+IGJcbiAgICAubGVuZ3RoID4gMFxuICAgIFxuaWYgbm90IGhhc0V4dCB0aGVuIGFyZ3MuYW55ID0gdHJ1ZVxuXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMCAgXG4jIDAwMCAgMDAwICAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMCAgMDAwICAwMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgXG5cbmlnbm9yZUZpbGUgPSAocCkgLT5cbiAgICBcbiAgICBiYXNlID0gc2xhc2guYmFzZW5hbWUgcFxuICAgIGV4dCAgPSBzbGFzaC5leHQgcFxuICAgIFxuICAgIGlmIHNsYXNoLndpbigpXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJyQnXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2UgPT0gJ2Rlc2t0b3AuaW5pJ1xuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCAnbnR1c2VyJ1xuICAgIFxuICAgIHJldHVybiBmYWxzZSBpZiBwID09IGFyZ3MucGF0aFxuICAgIGlmIGFyZ3MuZXh0IHRoZW4gcmV0dXJuIGV4dCAhPSBhcmdzLmV4dFxuICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJy4nIGFuZCBub3QgYXJncy5kb3RcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5hbnlcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5qcyAgICAgYW5kIGV4dCA9PSAnanMnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuanNvbiAgIGFuZCBleHQgPT0gJ2pzb24nXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3Mubm9vbiAgIGFuZCBleHQgPT0gJ25vb24nXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MubWQgICAgIGFuZCBleHQgPT0gJ21kJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLnB1ZyAgICBhbmQgZXh0ID09ICdwdWcnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3Muc3R5bCAgIGFuZCBleHQgPT0gJ3N0eWwnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuY3BwICAgIGFuZCBleHQgaW4gWydjcHAnLCAnaHBwJywgJ2gnXVxuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmNvZmZlZSBhbmQgZXh0IGluIFsna29mZmVlJydjb2ZmZWUnXVxuICAgIHJldHVybiB0cnVlXG5cbmlnbm9yZURpciA9IChwKSAtPlxuICAgIFxuICAgIHJldHVybiBmYWxzZSBpZiBwID09IGFyZ3MucGF0aFxuICAgIGJhc2UgPSBzbGFzaC5iYXNlbmFtZSBwXG4gICAgZXh0ICA9IHNsYXNoLmV4dCBwXG4gICAgcmV0dXJuIHRydWUgaWYgYmFzZVswXSA9PSAnLidcbiAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlID09ICdub2RlX21vZHVsZXMnXG4gICAgcmV0dXJuIHRydWUgaWYgZXh0ICA9PSAnYXBwJ1xuICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICBcbiMgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgIDAwMDAwMDAwMCAgXG4jICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICBcblxuTkVXTElORSA9IC9cXHI/XFxuL1xuXG5pZiBhcmdzLnN0cmluZ3MubGVuZ3RoXG4gICAgaWYgYXJncy5yZWdleHBcbiAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cCBcIihcIiArIGFyZ3Muc3RyaW5ncy5qb2luKCd8JykgKyBcIilcIiwgJ2cnXG4gICAgZWxzZVxuICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwIFwiKFwiICsgYXJncy5zdHJpbmdzLm1hcCgocykgLT4ga3N0ci5lc2NhcGVSZWdleHAocykpLmpvaW4oJ3wnKSArIFwiKVwiLCAnZydcbmVsc2VcbiAgICBkdW1wID0gdHJ1ZVxuXG5zZWFyY2ggPSAocGF0aHMsIGRlcHRoPTApIC0+XG4gICAgICAgICAgICBcbiAgICBwYXRocy5mb3JFYWNoIChwYXRoKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgc2xhc2guaXNEaXIgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkaXIgPSBzbGFzaC5yZXNvbHZlIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKChhcmdzLnJlY3Vyc2UgYW5kIGRlcHRoIDwgYXJncy5kZXB0aCkgb3IgZGVwdGggPT0gMCkgYW5kIG5vdCBpZ25vcmVEaXIgZGlyXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VhcmNoIGZzLnJlYWRkaXJTeW5jKGRpcikubWFwKChwKSAtPiBzbGFzaC5qb2luIGRpciwgcCksIGRlcHRoKzFcbiAgICAgICAgICAgIFxuICAgICAgICBlbHNlIGlmIHNsYXNoLmlzVGV4dCBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbGUgPSBzbGFzaC5yZXNvbHZlIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IGlnbm9yZUZpbGUgZmlsZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGhlYWRlciA9IGZhbHNlXG4gICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIgPSAtPlxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MuaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWwgPSBzbGFzaC5yZWxhdGl2ZSBmaWxlLCBwcm9jZXNzLmN3ZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgJydcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBXMSB5NSAnIOKWuCAnICsgZzIgc2xhc2guZGlybmFtZShyZWwpICsgJy8nICsgeTUgc2xhc2guYmFzZShyZWwpICsgeTEgJy4nICsgc2xhc2guZXh0KHJlbCkgKyAnICdcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyAnJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRleHQgID0gc2xhc2gucmVhZFRleHQgZmlsZVxuICAgICAgICAgICAgICAgIGxpbmVzID0gdGV4dC5zcGxpdCBORVdMSU5FXG4gICAgICAgICAgICAgICAgcm5ncyAgPSBrbG9yLmRpc3NlY3QgbGluZXMsIHNsYXNoLmV4dCBmaWxlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIGluZGV4IGluIFswLi4ubGluZXMubGVuZ3RoXVxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICAgICAgICAgICAgICAgIGlmIGxpbmUuc3RhcnRzV2l0aCAnLy8jIHNvdXJjZU1hcHBpbmdVUkwnXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgICAgICBpZiBkdW1wXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludEhlYWRlcigpIGlmIG5vdCBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBybmdzW2luZGV4XSwgaW5kZXgrMSwgW11cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbGluZS5zZWFyY2gocmVnZXhwKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIoKSBpZiBub3QgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IGhpZ2hsaWdodFJhbmdlcyBsaW5lLCByZWdleHBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICDilrhhc3NlcnQgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQgPSBzbGljZVJhbmdlcyBybmdzW2luZGV4XSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBzbGljZWQsIGluZGV4KzEsIGhpZ2hsaWdodHNcblxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwMDAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG5oaWdobGlnaHRSYW5nZXMgPSAobGluZSwgcmVnZXhwKSAtPlxuICAgIFxuICAgIHJhbmdlcyA9IFtdXG4gICAgd2hpbGUgbSA9IHJlZ2V4cC5leGVjIGxpbmVcbiAgICAgICAgcmFuZ2VzLnB1c2ggc3RhcnQ6bS5pbmRleCwgZW5kOm0uaW5kZXgrbVswXS5sZW5ndGgtMVxuICAgIHJhbmdlc1xuICAgIFxuc2xpY2VSYW5nZXMgPSAocmFuZ2VzLCBoaWdobGlnaHRzKSAtPlxuXG4gICAgaCA9IDBcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCByYW5nZXMubGVuZ3RoXG4gICAgICAgIHJhbmdlID0gcmFuZ2VzW2ldXG4gICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgcmFuZ2Uuc3RhcnQgPiBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgaCsrXG4gICAgICAgIFxuICAgICAgICBpZiBoID49IGhpZ2hsaWdodHMubGVuZ3RoIHRoZW4gcmV0dXJuIHJhbmdlc1xuXG4gICAgICAgIHNwbGl0ID0gMFxuICAgICAgICBpZiByYW5nZS5zdGFydCA8IGhpZ2hsaWdodHNbaF0uc3RhcnQgPD0gcmFuZ2Uuc3RhcnQrcmFuZ2UubGVuZ3RoXG4gICAgICAgICAgICBzcGxpdCAgPSBoaWdobGlnaHRzW2hdLnN0YXJ0IC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgZWxzZSBpZiByYW5nZS5zdGFydCA8PSBoaWdobGlnaHRzW2hdLmVuZCA8IHJhbmdlLnN0YXJ0K3JhbmdlLmxlbmd0aFxuICAgICAgICAgICAgc3BsaXQgPSBoaWdobGlnaHRzW2hdLmVuZCAtIHJhbmdlLnN0YXJ0ICsgMVxuXG4gICAgICAgIGlmIHNwbGl0XG4gICAgICAgICAgICBiZWZvcmUgPSBPYmplY3QuYXNzaWduIHt9LCByYW5nZVxuICAgICAgICAgICAgYWZ0ZXIgID0gT2JqZWN0LmFzc2lnbiB7fSwgcmFuZ2VcbiAgICAgICAgICAgIGJlZm9yZS5tYXRjaCAgPSByYW5nZS5tYXRjaFsuLi5zcGxpdF1cbiAgICAgICAgICAgIGJlZm9yZS5sZW5ndGggPSBiZWZvcmUubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5tYXRjaCAgID0gcmFuZ2UubWF0Y2hbc3BsaXQuLi5dXG4gICAgICAgICAgICBhZnRlci5sZW5ndGggID0gYWZ0ZXIubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5zdGFydCAgID0gcmFuZ2Uuc3RhcnQgKyBiZWZvcmUubGVuZ3RoXG4gICAgICAgICAgICByYW5nZXMuc3BsaWNlIGksIDEsIGJlZm9yZSwgYWZ0ZXJcbiAgICAgICAgaSsrXG4gICAgcmFuZ2VzXG4gICAgICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgICAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIFxuXG5vdXRwdXQgPSAocm5ncywgbnVtYmVyLCBoaWdobGlnaHRzKSAtPlxuICAgIFxuICAgIGNscnpkID0gJydcbiAgICBcbiAgICBpZiBhcmdzLm51bWJlcnNcbiAgICAgICAgbnVtc3RyID0gU3RyaW5nIG51bWJlclxuICAgICAgICBjbHJ6ZCArPSB3MihudW1zdHIpICsga3N0ci5ycGFkICcnLCA0LW51bXN0ci5sZW5ndGhcbiAgICAgICAgXG4gICAgYyA9IDBcbiAgICBoID0gMFxuICAgIGhpZ2hsaWdodCA9IChzKSAtPlxuICAgICAgICBpZiBoIDwgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGlmIGMgPj0gaGlnaGxpZ2h0c1toXS5zdGFydCBhbmQgYyA8PSBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnNlIHNcbiAgICAgICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgYyA+IGhpZ2hsaWdodHNbaF0uZW5kXG4gICAgICAgICAgICAgICAgaCsrXG4gICAgICAgIHNcbiAgICBcbiAgICBmb3IgaSBpbiBbMC4uLnJuZ3MubGVuZ3RoXVxuICAgICAgICB3aGlsZSBjIDwgcm5nc1tpXS5zdGFydCBcbiAgICAgICAgICAgIGNscnpkICs9IGhpZ2hsaWdodCAnICdcbiAgICAgICAgICAgIGMrK1xuICAgICAgICBjbHJ6ZCArPSBoaWdobGlnaHQgY29sb3JpemUgcm5nc1tpXVxuICAgICAgICBjICs9IHJuZ3NbaV0ubWF0Y2gubGVuZ3RoXG4gICAgICAgIFxuICAgIGxvZyBjbHJ6ZFxuXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuXG5MSSA9IC8oXFxzbGlcXGRcXHN8XFxzaFxcZFxccykvXG5cbmNvbG9yaXplID0gKGNodW5rKSAtPiBcbiAgICBcbiAgICBpZiBjbiA9IGtvbG9yLm1hcFtjaHVuay5jbHNzXVxuICAgICAgICBpZiBjbiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgICB2ID0gY2h1bmsubWF0Y2hcbiAgICAgICAgICAgIGZvciBjIGluIGNuXG4gICAgICAgICAgICAgICAgIyB2ID0ga29sb3JbY10gdlxuICAgICAgICAgICAgICAgIHYgPSBnbG9iYWxbY10gdlxuICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyByZXR1cm4ga29sb3JbY25dIGNodW5rLm1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsW2NuXSBjaHVuay5tYXRjaFxuICAgIFxuICAgIGlmIGNodW5rLmNsc3MuZW5kc1dpdGggJ2ZpbGUnXG4gICAgICAgIHc4IGNodW5rLm1hdGNoXG4gICAgZWxzZSBpZiBjaHVuay5jbHNzLmVuZHNXaXRoICdleHQnXG4gICAgICAgIHczIGNodW5rLm1hdGNoXG4gICAgZWxzZSBpZiBjaHVuay5jbHNzLnN0YXJ0c1dpdGggJ3B1bmN0J1xuICAgICAgICBpZiBMSS50ZXN0IGNodW5rLmNsc3NcbiAgICAgICAgICAgIGNvbG9yaXplIG1hdGNoOmNodW5rLm1hdGNoLCBjbHNzOmNodW5rLmNsc3MucmVwbGFjZSBMSSwgJyAnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHcyIGNodW5rLm1hdGNoXG4gICAgZWxzZVxuICAgICAgICBpZiBMSS50ZXN0IGNodW5rLmNsc3NcbiAgICAgICAgICAgIGNvbG9yaXplIG1hdGNoOmNodW5rLm1hdGNoLCBjbHNzOmNodW5rLmNsc3MucmVwbGFjZSBMSSwgJyAnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNodW5rLm1hdGNoXG4gICAgXG5pZiBhcmdzLmRlYnVnXG4gICAgbm9vbiA9IHJlcXVpcmUgJ25vb24nXG4gICAgbG9nIG5vb24uc3RyaW5naWZ5IGFyZ3MsIGNvbG9yczp0cnVlXG5cbiMgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICBcbiMgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgIFxuIyAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwMCAgXG5cbnBpcGVUeXBlID0gbnVsbFxucHJvY2Vzcy5zdGRpbi5vbiAncmVhZGFibGUnIC0+XG4gICAgaWYgbm90IHBpcGVUeXBlXG4gICAgICAgIGlmICAgICAgYXJncy5jb2ZmZWUgdGhlbiBwaXBlVHlwZSA9ICdjb2ZmZWUnXG4gICAgICAgIGVsc2UgaWYgYXJncy5ub29uICAgdGhlbiBwaXBlVHlwZSA9ICdub29uJ1xuICAgICAgICBlbHNlIGlmIGFyZ3MuanNvbiAgIHRoZW4gcGlwZVR5cGUgPSAnanNvbidcbiAgICAgICAgZWxzZSBpZiBhcmdzLmNwcCAgICB0aGVuIHBpcGVUeXBlID0gJ2NwcCdcbiAgICAgICAgZWxzZSBpZiBhcmdzLmpzICAgICB0aGVuIHBpcGVUeXBlID0gJ2pzJ1xuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgcGlwZVR5cGUgPSAndHh0J1xuICAgICAgICBcbiAgICBpZiB0ZXh0ID0gcHJvY2Vzcy5zdGRpbi5yZWFkKCk/LnRvU3RyaW5nICd1dGY4J1xuICAgICAgICBsaW5lcyA9IHRleHQuc3BsaXQgTkVXTElORVxuICAgICAgICBybmdzICA9IGtsb3IuZGlzc2VjdCBsaW5lcywgcGlwZVR5cGVcbiAgICAgICAgXG4gICAgICAgIGZvciBpbmRleCBpbiBbMC4uLmxpbmVzLmxlbmd0aF1cbiAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpbmRleF1cbiAgICAgICAgICAgIGlmIGxpbmUuc3RhcnRzV2l0aCAnLy8jIHNvdXJjZU1hcHBpbmdVUkwnXG4gICAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgaWYgZHVtcFxuICAgICAgICAgICAgICAgIG91dHB1dCBybmdzW2luZGV4XSwgaW5kZXgrMSwgW11cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBsaW5lLnNlYXJjaChyZWdleHApID49IDBcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IGhpZ2hsaWdodFJhbmdlcyBsaW5lLCByZWdleHBcbiAgICAgICAgICAgICAgICAgICAg4pa4YXNzZXJ0IGhpZ2hsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHNsaWNlZCA9IHNsaWNlUmFuZ2VzIHJuZ3NbaW5kZXhdLCBoaWdobGlnaHRzXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCBzbGljZWQsIGluZGV4KzEsIGhpZ2hsaWdodHNcbiAgICAgICAgXG5wcm9jZXNzLnN0ZGluLm9uICdlbmQnIC0+IFxuXG5pZiBwcm9jZXNzLnN0ZGluLmlzVFRZIGFuZCBub3QgYXJncy5zdGRpblxuICAgIHNlYXJjaCBbYXJncy5wYXRoXVxuICAgIGxvZyAnJ1xuICAgIHByb2Nlc3MuZXhpdCAwXG4gICAgIl19
//# sourceURL=../coffee/krep.coffee