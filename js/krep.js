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

args = karg("krep\n    strings   . ? text to search for                . **\n    header    . ? print file headers                . = true  . - H\n    recurse   . ? recurse into subdirs              . = true  . - R\n    depth     . ? recursion depth                   . = ∞     . - D    \n    path      . ? file or folder to search in       . = |.|\n    ext       . ? search only files with extension  . = ||\n    coffee    . ? search only coffeescript files    . = false\n    js        . ? search only javascript files      . = false\n    noon      . ? search only noon files            . = false\n    styl      . ? search only styl files            . = false . - S\n    pug       . ? search only pug files             . = false . - P\n    md        . ? search only md files              . = false\n    cpp       . ? search only cpp files             . = false . - C\n    json      . ? search only json files            . = false . - J\n    numbers   . ? prefix with line numbers          . = false . - N\n    regexp    . ? strings are regexp patterns       . = false\n    dot       . ? search dot files                  . = false\n    stdin     . ? read from stdin                   . = false . - i\n    kolor     . ? colorize output                   . = true\n    replace   . ? replace found strings             . = 🔥💥👎💥🔥\n    debug                                           . = false . - X\n\nversion       " + (require(__dirname + "/../package.json").version));

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
                        klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m334[39m', '[1m[97massertion failure![39m[22m');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3JlcC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImtyZXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLEVBQUEsR0FBUSxPQUFBLENBQVEsSUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBQ1IsR0FBQSxHQUFRLE9BQUEsQ0FBUSxLQUFSOztBQUVSLEtBQUEsR0FBUSxJQUFJLENBQUM7O0FBRWIsSUFBQSxHQUFPLElBQUEsQ0FBSyw2M0NBQUEsR0F3QkcsQ0FBQyxPQUFBLENBQVcsU0FBRCxHQUFXLGtCQUFyQixDQUF1QyxDQUFDLE9BQXpDLENBeEJSOztBQTJCUCxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFJLENBQUMsS0FBckI7O0FBRUEsSUFBRyxJQUFJLENBQUMsT0FBTCxLQUFnQixZQUFuQjtJQUVJLElBQUcsT0FBTyxJQUFJLENBQUMsT0FBWixLQUF1QixRQUExQjtRQUNHLE9BQUEsQ0FBQyxLQUFELENBQU8sRUFBQSxDQUFHLEVBQUEsQ0FBRyw4RkFBSCxDQUFILENBQVA7UUFDQyxJQUFJLENBQUMsT0FBTCxHQUFlLGFBRm5CO0tBRko7OztBQU1BLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxHQUFiLElBQXFCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBckM7SUFDSSxJQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQTFCLENBQUg7UUFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixHQUFzQixDQUF0QixJQUEyQixLQUFLLENBQUMsTUFBTixDQUFhLElBQUksQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUExQixDQUE5QjtZ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LCtDQUEyQixDQUFFLFFBQXRCLENBQStCLE1BQS9CLFVBQVY7UUFDSSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFYO1FBQ1IsSUFBQSxHQUFRLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixRQUFwQjtBQUVSO2FBQWEsa0dBQWI7WUFDSSxJQUFBLEdBQU8sS0FBTSxDQUFBLEtBQUE7WUFDYixJQUFHLElBQUksQ0FBQyxVQUFMLENBQWdCLHNCQUFoQixDQUFIO0FBQ0kseUJBREo7O1lBR0EsSUFBRyxJQUFIOzZCQUNJLE1BQUEsQ0FBTyxJQUFLLENBQUEsS0FBQSxDQUFaLEVBQW9CLEtBQUEsR0FBTSxDQUExQixFQUE2QixFQUE3QixHQURKO2FBQUEsTUFBQTtnQkFHSSxJQUFHLElBQUksQ0FBQyxNQUFMLENBQVksTUFBWixDQUFBLElBQXVCLENBQTFCO29CQUNJLFVBQUEsR0FBYSxlQUFBLENBQWdCLElBQWhCLEVBQXNCLE1BQXRCO29CQUE0QixJQUFBLG9CQUFBO0FBQUE7QUFBQTswQ0FBQTs7b0JBRXpDLE1BQUEsR0FBUyxXQUFBLENBQVksSUFBSyxDQUFBLEtBQUEsQ0FBakIsRUFBeUIsVUFBekI7aUNBQ1QsTUFBQSxDQUFPLE1BQVAsRUFBZSxLQUFBLEdBQU0sQ0FBckIsRUFBd0IsVUFBeEIsR0FKSjtpQkFBQSxNQUFBO3lDQUFBO2lCQUhKOztBQUxKO3VCQUpKOztBQVR3QixDQUE1Qjs7QUEyQkEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFkLENBQWlCLEtBQWpCLEVBQXVCLFNBQUEsR0FBQSxDQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgXG4jIyNcblxuZnMgICAgPSByZXF1aXJlICdmcydcbnNsYXNoID0gcmVxdWlyZSAna3NsYXNoJ1xua2FyZyAgPSByZXF1aXJlICdrYXJnJ1xua2xvciAgPSByZXF1aXJlICdrbG9yJ1xua3N0ciAgPSByZXF1aXJlICdrc3RyJ1xudHR5ICAgPSByZXF1aXJlICd0dHknXG5cbmtvbG9yID0ga2xvci5rb2xvclxuXG5hcmdzID0ga2FyZyBcIlwiXCJcbmtyZXBcbiAgICBzdHJpbmdzICAgLiA/IHRleHQgdG8gc2VhcmNoIGZvciAgICAgICAgICAgICAgICAuICoqXG4gICAgaGVhZGVyICAgIC4gPyBwcmludCBmaWxlIGhlYWRlcnMgICAgICAgICAgICAgICAgLiA9IHRydWUgIC4gLSBIXG4gICAgcmVjdXJzZSAgIC4gPyByZWN1cnNlIGludG8gc3ViZGlycyAgICAgICAgICAgICAgLiA9IHRydWUgIC4gLSBSXG4gICAgZGVwdGggICAgIC4gPyByZWN1cnNpb24gZGVwdGggICAgICAgICAgICAgICAgICAgLiA9IOKIniAgICAgLiAtIEQgICAgXG4gICAgcGF0aCAgICAgIC4gPyBmaWxlIG9yIGZvbGRlciB0byBzZWFyY2ggaW4gICAgICAgLiA9IHwufFxuICAgIGV4dCAgICAgICAuID8gc2VhcmNoIG9ubHkgZmlsZXMgd2l0aCBleHRlbnNpb24gIC4gPSB8fFxuICAgIGNvZmZlZSAgICAuID8gc2VhcmNoIG9ubHkgY29mZmVlc2NyaXB0IGZpbGVzICAgIC4gPSBmYWxzZVxuICAgIGpzICAgICAgICAuID8gc2VhcmNoIG9ubHkgamF2YXNjcmlwdCBmaWxlcyAgICAgIC4gPSBmYWxzZVxuICAgIG5vb24gICAgICAuID8gc2VhcmNoIG9ubHkgbm9vbiBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIHN0eWwgICAgICAuID8gc2VhcmNoIG9ubHkgc3R5bCBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gU1xuICAgIHB1ZyAgICAgICAuID8gc2VhcmNoIG9ubHkgcHVnIGZpbGVzICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gUFxuICAgIG1kICAgICAgICAuID8gc2VhcmNoIG9ubHkgbWQgZmlsZXMgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGNwcCAgICAgICAuID8gc2VhcmNoIG9ubHkgY3BwIGZpbGVzICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gQ1xuICAgIGpzb24gICAgICAuID8gc2VhcmNoIG9ubHkganNvbiBmaWxlcyAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gSlxuICAgIG51bWJlcnMgICAuID8gcHJlZml4IHdpdGggbGluZSBudW1iZXJzICAgICAgICAgIC4gPSBmYWxzZSAuIC0gTlxuICAgIHJlZ2V4cCAgICAuID8gc3RyaW5ncyBhcmUgcmVnZXhwIHBhdHRlcm5zICAgICAgIC4gPSBmYWxzZVxuICAgIGRvdCAgICAgICAuID8gc2VhcmNoIGRvdCBmaWxlcyAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIHN0ZGluICAgICAuID8gcmVhZCBmcm9tIHN0ZGluICAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gaVxuICAgIGtvbG9yICAgICAuID8gY29sb3JpemUgb3V0cHV0ICAgICAgICAgICAgICAgICAgIC4gPSB0cnVlXG4gICAgcmVwbGFjZSAgIC4gPyByZXBsYWNlIGZvdW5kIHN0cmluZ3MgICAgICAgICAgICAgLiA9IPCflKXwn5Kl8J+RjvCfkqXwn5SlXG4gICAgZGVidWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBYXG5cbnZlcnNpb24gICAgICAgI3tyZXF1aXJlKFwiI3tfX2Rpcm5hbWV9Ly4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufVxuXCJcIlwiXG5cbmtvbG9yLmdsb2JhbGl6ZSBhcmdzLmtvbG9yXG5cbmlmIGFyZ3MucmVwbGFjZSAhPSAn8J+UpfCfkqXwn5GO8J+SpfCflKUnXG4gICAgXG4gICAgaWYgdHlwZW9mIGFyZ3MucmVwbGFjZSAhPSAnc3RyaW5nJ1xuICAgICAgICBlcnJvciBSNCB5NSBcIiBubyByZXBsYWNlIHN0cmluZyBwcm92aWRlZCEgd29uJ3QgcmVwbGFjZSBhbnl0aGluZyEgdXNlIFxcXCJcXFwiIHRvIHJlcGxhY2Ugd2l0aCBlbXB0eSBzdHJpbmcuIFwiXG4gICAgICAgIGFyZ3MucmVwbGFjZSA9ICfwn5Sl8J+SpfCfkY7wn5Kl8J+UpSdcblxuaWYgYXJncy5wYXRoID09ICcuJyBhbmQgYXJncy5zdHJpbmdzLmxlbmd0aFxuICAgIGlmIHNsYXNoLmV4aXN0cyBhcmdzLnN0cmluZ3NbMF1cbiAgICAgICAgaWYgYXJncy5zdHJpbmdzLmxlbmd0aCA+IDEgb3Igc2xhc2guaXNGaWxlIGFyZ3Muc3RyaW5nc1swXVxuICAgICAgICAgICAgYXJncy5wYXRoID0gYXJncy5zdHJpbmdzLnNoaWZ0KClcbiAgICBlbHNlIGlmIHNsYXNoLmV4aXN0cyBhcmdzLnN0cmluZ3NbLTFdXG4gICAgICAgIGFyZ3MucGF0aCA9IGFyZ3Muc3RyaW5ncy5wb3AoKVxuXG5pZiBhcmdzLmRlcHRoID09ICfiiJ4nIHRoZW4gYXJncy5kZXB0aCA9IEluZmluaXR5XG5lbHNlIGFyZ3MuZGVwdGggPSBNYXRoLm1heCAwLCBwYXJzZUludCBhcmdzLmRlcHRoXG5pZiBOdW1iZXIuaXNOYU4gYXJncy5kZXB0aCB0aGVuIGFyZ3MuZGVwdGggPSAwXG4gICAgICAgIFxuYXJncy5wYXRoID0gc2xhc2gucmVzb2x2ZSBhcmdzLnBhdGhcblxuaWYgYXJncy5fX2lnbm9yZWQ/Lmxlbmd0aFxuICAgIGFyZ3Muc3RyaW5ncyA9IGFyZ3Muc3RyaW5ncy5jb25jYXQgYXJncy5fX2lnbm9yZWRcbiAgICBcbmhhc0V4dCA9IFsnY29mZmVlJydub29uJydqc29uJydqcycnbWQnJ2NwcCcncHVnJydzdHlsJ11cbiAgICAubWFwICh0KSAtPiBhcmdzW3RdXG4gICAgLmZpbHRlciAoYikgLT4gYlxuICAgIC5sZW5ndGggPiAwXG4gICAgXG5pZiBub3QgaGFzRXh0IHRoZW4gYXJncy5hbnkgPSB0cnVlXG5cbiMgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwICBcbiMgMDAwICAwMDAgICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICBcbiMgMDAwICAwMDAgIDAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICBcbiMgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwICBcblxuaWdub3JlRmlsZSA9IChwKSAtPlxuICAgIFxuICAgIGJhc2UgPSBzbGFzaC5iYXNlbmFtZSBwXG4gICAgZXh0ICA9IHNsYXNoLmV4dCBwXG4gICAgXG4gICAgaWYgc2xhc2gud2luKClcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgYmFzZVswXSA9PSAnJCdcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgYmFzZSA9PSAnZGVza3RvcC5pbmknXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2UudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoICdudHVzZXInXG4gICAgXG4gICAgcmV0dXJuIGZhbHNlIGlmIHAgPT0gYXJncy5wYXRoXG4gICAgaWYgYXJncy5leHQgdGhlbiByZXR1cm4gZXh0ICE9IGFyZ3MuZXh0XG4gICAgcmV0dXJuIHRydWUgaWYgYmFzZVswXSA9PSAnLicgYW5kIG5vdCBhcmdzLmRvdFxuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmFueVxuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmpzICAgICBhbmQgZXh0ID09ICdqcydcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5qc29uICAgYW5kIGV4dCA9PSAnanNvbidcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5ub29uICAgYW5kIGV4dCA9PSAnbm9vbidcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5tZCAgICAgYW5kIGV4dCA9PSAnbWQnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MucHVnICAgIGFuZCBleHQgPT0gJ3B1ZydcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5zdHlsICAgYW5kIGV4dCA9PSAnc3R5bCdcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5jcHAgICAgYW5kIGV4dCBpbiBbJ2NwcCcsICdocHAnLCAnaCddXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuY29mZmVlIGFuZCBleHQgaW4gWydrb2ZmZWUnJ2NvZmZlZSddXG4gICAgcmV0dXJuIHRydWVcblxuaWdub3JlRGlyID0gKHApIC0+XG4gICAgXG4gICAgcmV0dXJuIGZhbHNlIGlmIHAgPT0gYXJncy5wYXRoXG4gICAgYmFzZSA9IHNsYXNoLmJhc2VuYW1lIHBcbiAgICBleHQgID0gc2xhc2guZXh0IHBcbiAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlWzBdID09ICcuJ1xuICAgIHJldHVybiB0cnVlIGlmIGJhc2UgPT0gJ25vZGVfbW9kdWxlcydcbiAgICByZXR1cm4gdHJ1ZSBpZiBleHQgID09ICdhcHAnXG4gICAgZmFsc2VcbiAgICAgICAgICAgICAgICBcbiMgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG4jIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgICAgICAgMDAwMDAwMDAwICBcbiMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuXG5ORVdMSU5FID0gL1xccj9cXG4vXG5cbmlmIGFyZ3Muc3RyaW5ncy5sZW5ndGhcbiAgICBpZiBhcmdzLnJlZ2V4cFxuICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwIFwiKFwiICsgYXJncy5zdHJpbmdzLmpvaW4oJ3wnKSArIFwiKVwiLCAnZydcbiAgICBlbHNlXG4gICAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAgXCIoXCIgKyBhcmdzLnN0cmluZ3MubWFwKChzKSAtPiBrc3RyLmVzY2FwZVJlZ2V4cChzKSkuam9pbignfCcpICsgXCIpXCIsICdnJ1xuZWxzZVxuICAgIGR1bXAgPSB0cnVlXG5cbnNlYXJjaCA9IChwYXRocywgZGVwdGg9MCkgLT5cbiAgICAgICAgICAgIFxuICAgIHBhdGhzLmZvckVhY2ggKHBhdGgpIC0+XG4gICAgICAgIFxuICAgICAgICBpZiBzbGFzaC5pc0RpciBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRpciA9IHNsYXNoLnJlc29sdmUgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoKGFyZ3MucmVjdXJzZSBhbmQgZGVwdGggPCBhcmdzLmRlcHRoKSBvciBkZXB0aCA9PSAwKSBhbmQgbm90IGlnbm9yZURpciBkaXJcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZWFyY2ggZnMucmVhZGRpclN5bmMoZGlyKS5tYXAoKHApIC0+IHNsYXNoLmpvaW4gZGlyLCBwKSwgZGVwdGgrMVxuICAgICAgICAgICAgXG4gICAgICAgIGVsc2UgaWYgc2xhc2guaXNUZXh0IHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZmlsZSA9IHNsYXNoLnJlc29sdmUgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBub3QgaWdub3JlRmlsZSBmaWxlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaGVhZGVyID0gZmFsc2VcbiAgICAgICAgICAgICAgICBwcmludEhlYWRlciA9IC0+XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlciA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgaWYgYXJncy5oZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbCA9IHNsYXNoLnJlbGF0aXZlIGZpbGUsIHByb2Nlc3MuY3dkKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFcxIHk1ICcg4pa4ICcgKyBnMiBzbGFzaC5kaXJuYW1lKHJlbCkgKyAnLycgKyB5NSBzbGFzaC5iYXNlKHJlbCkgKyB5MSAnLicgKyBzbGFzaC5leHQocmVsKSArICcgJ1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nICcnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGV4dCAgPSBzbGFzaC5yZWFkVGV4dCBmaWxlXG4gICAgICAgICAgICAgICAgbGluZXMgPSB0ZXh0LnNwbGl0IE5FV0xJTkVcbiAgICAgICAgICAgICAgICBybmdzICA9IGtsb3IuZGlzc2VjdCBsaW5lcywgc2xhc2guZXh0IGZpbGVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmb3IgaW5kZXggaW4gWzAuLi5saW5lcy5sZW5ndGhdXG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpbmRleF1cbiAgICAgICAgICAgICAgICAgICAgaWYgbGluZS5zdGFydHNXaXRoICcvLyMgc291cmNlTWFwcGluZ1VSTCcgdGhlbiBjb250aW51ZVxuICAgICAgICAgICAgICAgICAgICBpZiBkdW1wXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludEhlYWRlcigpIGlmIG5vdCBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBybmdzW2luZGV4XSwgaW5kZXgrMSwgW11cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbGluZS5zZWFyY2gocmVnZXhwKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIoKSBpZiBub3QgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IGhpZ2hsaWdodFJhbmdlcyBsaW5lLCByZWdleHBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICDilrhhc3NlcnQgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQgPSBzbGljZVJhbmdlcyBybmdzW2luZGV4XSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBzbGljZWQsIGluZGV4KzEsIGhpZ2hsaWdodHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiByZWdleHAgYW5kIG5vdCBkdW1wIGFuZCBhcmdzLnJlcGxhY2UgIT0gJ/CflKXwn5Kl8J+RjvCfkqXwn5SlJ1xuICAgICAgICAgICAgICAgICAgICBmb3IgaW5kZXggaW4gWzAuLi5saW5lcy5sZW5ndGhdXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJyB0aGVuIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpbmRleF0gPSBsaW5lLnJlcGxhY2UgcmVnZXhwLCBhcmdzLnJlcGxhY2VcbiAgICAgICAgICAgICAgICAgICAgc2xhc2gud3JpdGVUZXh0IGZpbGUsIGxpbmVzLmpvaW4gJ1xcbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuaGlnaGxpZ2h0UmFuZ2VzID0gKGxpbmUsIHJlZ2V4cCkgLT5cbiAgICBcbiAgICByYW5nZXMgPSBbXVxuICAgIHdoaWxlIG0gPSByZWdleHAuZXhlYyBsaW5lXG4gICAgICAgIHJhbmdlcy5wdXNoIHN0YXJ0Om0uaW5kZXgsIGVuZDptLmluZGV4K21bMF0ubGVuZ3RoLTFcbiAgICByYW5nZXNcbiAgICBcbnNsaWNlUmFuZ2VzID0gKHJhbmdlcywgaGlnaGxpZ2h0cykgLT5cblxuICAgIGggPSAwXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgcmFuZ2VzLmxlbmd0aFxuICAgICAgICByYW5nZSA9IHJhbmdlc1tpXVxuICAgICAgICB3aGlsZSBoIDwgaGlnaGxpZ2h0cy5sZW5ndGggYW5kIHJhbmdlLnN0YXJ0ID4gaGlnaGxpZ2h0c1toXS5lbmRcbiAgICAgICAgICAgIGgrK1xuICAgICAgICBcbiAgICAgICAgaWYgaCA+PSBoaWdobGlnaHRzLmxlbmd0aCB0aGVuIHJldHVybiByYW5nZXNcblxuICAgICAgICBzcGxpdCA9IDBcbiAgICAgICAgaWYgcmFuZ2Uuc3RhcnQgPCBoaWdobGlnaHRzW2hdLnN0YXJ0IDw9IHJhbmdlLnN0YXJ0K3JhbmdlLmxlbmd0aFxuICAgICAgICAgICAgc3BsaXQgID0gaGlnaGxpZ2h0c1toXS5zdGFydCAtIHJhbmdlLnN0YXJ0XG4gICAgICAgIGVsc2UgaWYgcmFuZ2Uuc3RhcnQgPD0gaGlnaGxpZ2h0c1toXS5lbmQgPCByYW5nZS5zdGFydCtyYW5nZS5sZW5ndGhcbiAgICAgICAgICAgIHNwbGl0ID0gaGlnaGxpZ2h0c1toXS5lbmQgLSByYW5nZS5zdGFydCArIDFcblxuICAgICAgICBpZiBzcGxpdFxuICAgICAgICAgICAgYmVmb3JlID0gT2JqZWN0LmFzc2lnbiB7fSwgcmFuZ2VcbiAgICAgICAgICAgIGFmdGVyICA9IE9iamVjdC5hc3NpZ24ge30sIHJhbmdlXG4gICAgICAgICAgICBiZWZvcmUubWF0Y2ggID0gcmFuZ2UubWF0Y2hbLi4uc3BsaXRdXG4gICAgICAgICAgICBiZWZvcmUubGVuZ3RoID0gYmVmb3JlLm1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgYWZ0ZXIubWF0Y2ggICA9IHJhbmdlLm1hdGNoW3NwbGl0Li4uXVxuICAgICAgICAgICAgYWZ0ZXIubGVuZ3RoICA9IGFmdGVyLm1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgYWZ0ZXIuc3RhcnQgICA9IHJhbmdlLnN0YXJ0ICsgYmVmb3JlLmxlbmd0aFxuICAgICAgICAgICAgcmFuZ2VzLnNwbGljZSBpLCAxLCBiZWZvcmUsIGFmdGVyXG4gICAgICAgIGkrK1xuICAgIHJhbmdlc1xuICAgICAgICAgICAgXG4jICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICBcblxub3V0cHV0ID0gKHJuZ3MsIG51bWJlciwgaGlnaGxpZ2h0cykgLT5cbiAgICBcbiAgICBjbHJ6ZCA9ICcnXG4gICAgXG4gICAgaWYgYXJncy5udW1iZXJzXG4gICAgICAgIG51bXN0ciA9IFN0cmluZyBudW1iZXJcbiAgICAgICAgY2xyemQgKz0gdzIobnVtc3RyKSArIGtzdHIucnBhZCAnJywgNC1udW1zdHIubGVuZ3RoXG4gICAgICAgIFxuICAgIGMgPSAwXG4gICAgaCA9IDBcbiAgICBoaWdobGlnaHQgPSAocykgLT5cbiAgICAgICAgaWYgaCA8IGhpZ2hsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBpZiBjID49IGhpZ2hsaWdodHNbaF0uc3RhcnQgYW5kIGMgPD0gaGlnaGxpZ2h0c1toXS5lbmRcbiAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJzZSBzXG4gICAgICAgICAgICB3aGlsZSBoIDwgaGlnaGxpZ2h0cy5sZW5ndGggYW5kIGMgPiBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgICAgIGgrK1xuICAgICAgICBzXG4gICAgXG4gICAgZm9yIGkgaW4gWzAuLi5ybmdzLmxlbmd0aF1cbiAgICAgICAgd2hpbGUgYyA8IHJuZ3NbaV0uc3RhcnQgXG4gICAgICAgICAgICBjbHJ6ZCArPSBoaWdobGlnaHQgJyAnXG4gICAgICAgICAgICBjKytcbiAgICAgICAgY2xyemQgKz0gaGlnaGxpZ2h0IGNvbG9yaXplIHJuZ3NbaV1cbiAgICAgICAgYyArPSBybmdzW2ldLm1hdGNoLmxlbmd0aFxuICAgICAgICBcbiAgICBsb2cgY2xyemRcblxuIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIDAwMCAgIDAwMCAgICAgICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcblxuTEkgPSAvKFxcc2xpXFxkXFxzfFxcc2hcXGRcXHMpL1xuXG5jb2xvcml6ZSA9IChjaHVuaykgLT4gXG4gICAgXG4gICAgaWYgY24gPSBrb2xvci5tYXBbY2h1bmsuY2xzc11cbiAgICAgICAgaWYgY24gaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgICAgdiA9IGNodW5rLm1hdGNoXG4gICAgICAgICAgICBmb3IgYyBpbiBjblxuICAgICAgICAgICAgICAgICMgdiA9IGtvbG9yW2NdIHZcbiAgICAgICAgICAgICAgICB2ID0gZ2xvYmFsW2NdIHZcbiAgICAgICAgICAgIHJldHVybiB2XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgcmV0dXJuIGtvbG9yW2NuXSBjaHVuay5tYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbFtjbl0gY2h1bmsubWF0Y2hcbiAgICBcbiAgICBpZiBjaHVuay5jbHNzLmVuZHNXaXRoICdmaWxlJ1xuICAgICAgICB3OCBjaHVuay5tYXRjaFxuICAgIGVsc2UgaWYgY2h1bmsuY2xzcy5lbmRzV2l0aCAnZXh0J1xuICAgICAgICB3MyBjaHVuay5tYXRjaFxuICAgIGVsc2UgaWYgY2h1bmsuY2xzcy5zdGFydHNXaXRoICdwdW5jdCdcbiAgICAgICAgaWYgTEkudGVzdCBjaHVuay5jbHNzXG4gICAgICAgICAgICBjb2xvcml6ZSBtYXRjaDpjaHVuay5tYXRjaCwgY2xzczpjaHVuay5jbHNzLnJlcGxhY2UgTEksICcgJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB3MiBjaHVuay5tYXRjaFxuICAgIGVsc2VcbiAgICAgICAgaWYgTEkudGVzdCBjaHVuay5jbHNzXG4gICAgICAgICAgICBjb2xvcml6ZSBtYXRjaDpjaHVuay5tYXRjaCwgY2xzczpjaHVuay5jbHNzLnJlcGxhY2UgTEksICcgJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaHVuay5tYXRjaFxuICAgIFxuaWYgYXJncy5kZWJ1Z1xuICAgIG5vb24gPSByZXF1aXJlICdub29uJ1xuICAgIGxvZyBub29uLnN0cmluZ2lmeSBhcmdzLCBjb2xvcnM6dHJ1ZVxuXG5pZiBub3QgYXJncy5zdGRpblxuICAgIHNlYXJjaCBbYXJncy5wYXRoXVxuICAgIGxvZyAnJ1xuICAgIHByb2Nlc3MuZXhpdCAwXG4gICAgXG4jIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAwMDAwMCAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgXG4jIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgICBcbiMgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwMDAwMDAgIFxuXG5waXBlVHlwZSA9IG51bGxcbnByb2Nlc3Muc3RkaW4ub24gJ3JlYWRhYmxlJyAtPlxuICAgIGlmIG5vdCBwaXBlVHlwZVxuICAgICAgICBpZiAgICAgIGFyZ3MuY29mZmVlIHRoZW4gcGlwZVR5cGUgPSAnY29mZmVlJ1xuICAgICAgICBlbHNlIGlmIGFyZ3Mubm9vbiAgIHRoZW4gcGlwZVR5cGUgPSAnbm9vbidcbiAgICAgICAgZWxzZSBpZiBhcmdzLmpzb24gICB0aGVuIHBpcGVUeXBlID0gJ2pzb24nXG4gICAgICAgIGVsc2UgaWYgYXJncy5jcHAgICAgdGhlbiBwaXBlVHlwZSA9ICdjcHAnXG4gICAgICAgIGVsc2UgaWYgYXJncy5qcyAgICAgdGhlbiBwaXBlVHlwZSA9ICdqcydcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgIHBpcGVUeXBlID0gJ3R4dCdcbiAgICAgICAgXG4gICAgaWYgdGV4dCA9IHByb2Nlc3Muc3RkaW4ucmVhZCgpPy50b1N0cmluZyAndXRmOCdcbiAgICAgICAgbGluZXMgPSB0ZXh0LnNwbGl0IE5FV0xJTkVcbiAgICAgICAgcm5ncyAgPSBrbG9yLmRpc3NlY3QgbGluZXMsIHBpcGVUeXBlXG4gICAgICAgIFxuICAgICAgICBmb3IgaW5kZXggaW4gWzAuLi5saW5lcy5sZW5ndGhdXG4gICAgICAgICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJ1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGlmIGR1bXBcbiAgICAgICAgICAgICAgICBvdXRwdXQgcm5nc1tpbmRleF0sIGluZGV4KzEsIFtdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgbGluZS5zZWFyY2gocmVnZXhwKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMgPSBoaWdobGlnaHRSYW5nZXMgbGluZSwgcmVnZXhwXG4gICAgICAgICAgICAgICAgICAgIOKWuGFzc2VydCBoaWdobGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBzbGljZWQgPSBzbGljZVJhbmdlcyBybmdzW2luZGV4XSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgc2xpY2VkLCBpbmRleCsxLCBoaWdobGlnaHRzXG4gICAgICAgIFxucHJvY2Vzcy5zdGRpbi5vbiAnZW5kJyAtPiBcbiAgICAiXX0=
//# sourceURL=../coffee/krep.coffee