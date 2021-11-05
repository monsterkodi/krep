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

args = karg("krep\n    strings      . ? text to search for                 . **\n    header       . ? print file headers                 . = true  . - H\n    recurse      . ? recurse into subdirs               . = true  . - R\n    depth        . ? recursion depth                    . = ∞     . - D    \n    path         . ? file or folder to search in        . = |.|\n    ext          . ? search only files with extension   . = ||\n    coffee       . ? search only coffeescript files     . = false\n    js           . ? search only javascript files       . = false\n    noon         . ? search only noon files             . = false\n    styl         . ? search only styl files             . = false . - S\n    pug          . ? search only pug files              . = false . - P\n    md           . ? search only md files               . = false\n    cpp          . ? search only cpp files              . = false . - C\n    json         . ? search only json files             . = false . - J\n    numbers      . ? prefix with line numbers           . = false . - N\n    regexp       . ? strings are regexp patterns        . = false\n    dot          . ? search dot files                   . = false\n    stdin        . ? read from stdin                    . = false . - i\n    kolor        . ? colorize output                    . = true\n    replace      . ? 🔥replace matches                              . - -\n    remove       . ? 🔥remove matches                     . = false . - -\n    removelines  . ? 🔥remove lines containing matches    . = false . - -\n    debug                                                 . = false . - X\n\nversion       " + (require(__dirname + "/../package.json").version));

kolor.globalize(args.kolor);

if (args.replace && (args.remove || args.removelines) || args.remove && args.removelines) {
    console.error(R4(y5(" 🔥💥 multiple replace options provided! won't replace anything! 💥🔥")));
    delete args.replace;
    delete args.remove;
    delete args.removelines;
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
        var dir, file, header, highlights, index, j, k, l, line, lines, newLines, printHeader, ref1, ref2, ref3, replaceWith, rngs, sliced, text;
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
                                klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m176[39m', '[1m[97massertion failure![39m[22m');

                                process.exit(666);
                            };
                            sliced = sliceRanges(rngs[index], highlights);
                            output(sliced, index + 1, highlights);
                        }
                    }
                }
                if (regexp && !dump) {
                    if (args.replace || args.remove) {
                        for (index = k = 0, ref2 = lines.length; 0 <= ref2 ? k < ref2 : k > ref2; index = 0 <= ref2 ? ++k : --k) {
                            line = lines[index];
                            if (line.startsWith('//# sourceMappingURL')) {
                                continue;
                            }
                            if (args.remove) {
                                replaceWith = '';
                            } else {
                                replaceWith = args.replace;
                            }
                            lines[index] = line.replace(regexp, replaceWith);
                        }
                        return slash.writeText(file, lines.join('\n'));
                    } else if (args.removelines) {
                        newLines = [];
                        for (index = l = 0, ref3 = lines.length; 0 <= ref3 ? l < ref3 : l > ref3; index = 0 <= ref3 ? ++l : --l) {
                            line = lines[index];
                            if (line.startsWith('//# sourceMappingURL')) {
                                newLines.push(line);
                                continue;
                            }
                            if (line.search(regexp) >= 0) {
                                continue;
                            }
                            newLines.push(line);
                        }
                        return slash.writeText(file, newLines.join('\n'));
                    }
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
                        klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m348[39m', '[1m[97massertion failure![39m[22m');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3JlcC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImtyZXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLEVBQUEsR0FBUSxPQUFBLENBQVEsSUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBQ1IsR0FBQSxHQUFRLE9BQUEsQ0FBUSxLQUFSOztBQUVSLEtBQUEsR0FBUSxJQUFJLENBQUM7O0FBRWIsSUFBQSxHQUFPLElBQUEsQ0FBSyw0bURBQUEsR0EwQkcsQ0FBQyxPQUFBLENBQVcsU0FBRCxHQUFXLGtCQUFyQixDQUF1QyxDQUFDLE9BQXpDLENBMUJSOztBQTZCUCxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFJLENBQUMsS0FBckI7O0FBRUEsSUFBRyxJQUFJLENBQUMsT0FBTCxJQUFpQixDQUFDLElBQUksQ0FBQyxNQUFMLElBQWUsSUFBSSxDQUFDLFdBQXJCLENBQWpCLElBQXNELElBQUksQ0FBQyxNQUFMLElBQWdCLElBQUksQ0FBQyxXQUE5RTtJQUVHLE9BQUEsQ0FBQyxLQUFELENBQU8sRUFBQSxDQUFHLEVBQUEsQ0FBRyx1RUFBSCxDQUFILENBQVA7SUFDQyxPQUFPLElBQUksQ0FBQztJQUNaLE9BQU8sSUFBSSxDQUFDO0lBQ1osT0FBTyxJQUFJLENBQUMsWUFMaEI7OztBQU9BLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxHQUFiLElBQXFCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBckM7SUFDSSxJQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQTFCLENBQUg7UUFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixHQUFz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QUFBLENBQWdCLElBQWhCLEVBQXNCLE1BQXRCO29CQUE0QixJQUFBLG9CQUFBO0FBQUE7QUFBQTswQ0FBQTs7b0JBRXpDLE1BQUEsR0FBUyxXQUFBLENBQVksSUFBSyxDQUFBLEtBQUEsQ0FBakIsRUFBeUIsVUFBekI7aUNBQ1QsTUFBQSxDQUFPLE1BQVAsRUFBZSxLQUFBLEdBQU0sQ0FBckIsRUFBd0IsVUFBeEIsR0FKSjtpQkFBQSxNQUFBO3lDQUFBO2lCQUhKOztBQUxKO3VCQUpKOztBQVR3QixDQUE1Qjs7QUEyQkEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFkLENBQWlCLEtBQWpCLEVBQXVCLFNBQUEsR0FBQSxDQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgXG4jIyNcblxuZnMgICAgPSByZXF1aXJlICdmcydcbnNsYXNoID0gcmVxdWlyZSAna3NsYXNoJ1xua2FyZyAgPSByZXF1aXJlICdrYXJnJ1xua2xvciAgPSByZXF1aXJlICdrbG9yJ1xua3N0ciAgPSByZXF1aXJlICdrc3RyJ1xudHR5ICAgPSByZXF1aXJlICd0dHknXG5cbmtvbG9yID0ga2xvci5rb2xvclxuXG5hcmdzID0ga2FyZyBcIlwiXCJcbmtyZXBcbiAgICBzdHJpbmdzICAgICAgLiA/IHRleHQgdG8gc2VhcmNoIGZvciAgICAgICAgICAgICAgICAgLiAqKlxuICAgIGhlYWRlciAgICAgICAuID8gcHJpbnQgZmlsZSBoZWFkZXJzICAgICAgICAgICAgICAgICAuID0gdHJ1ZSAgLiAtIEhcbiAgICByZWN1cnNlICAgICAgLiA/IHJlY3Vyc2UgaW50byBzdWJkaXJzICAgICAgICAgICAgICAgLiA9IHRydWUgIC4gLSBSXG4gICAgZGVwdGggICAgICAgIC4gPyByZWN1cnNpb24gZGVwdGggICAgICAgICAgICAgICAgICAgIC4gPSDiiJ4gICAgIC4gLSBEICAgIFxuICAgIHBhdGggICAgICAgICAuID8gZmlsZSBvciBmb2xkZXIgdG8gc2VhcmNoIGluICAgICAgICAuID0gfC58XG4gICAgZXh0ICAgICAgICAgIC4gPyBzZWFyY2ggb25seSBmaWxlcyB3aXRoIGV4dGVuc2lvbiAgIC4gPSB8fFxuICAgIGNvZmZlZSAgICAgICAuID8gc2VhcmNoIG9ubHkgY29mZmVlc2NyaXB0IGZpbGVzICAgICAuID0gZmFsc2VcbiAgICBqcyAgICAgICAgICAgLiA/IHNlYXJjaCBvbmx5IGphdmFzY3JpcHQgZmlsZXMgICAgICAgLiA9IGZhbHNlXG4gICAgbm9vbiAgICAgICAgIC4gPyBzZWFyY2ggb25seSBub29uIGZpbGVzICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIHN0eWwgICAgICAgICAuID8gc2VhcmNoIG9ubHkgc3R5bCBmaWxlcyAgICAgICAgICAgICAuID0gZmFsc2UgLiAtIFNcbiAgICBwdWcgICAgICAgICAgLiA/IHNlYXJjaCBvbmx5IHB1ZyBmaWxlcyAgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBQXG4gICAgbWQgICAgICAgICAgIC4gPyBzZWFyY2ggb25seSBtZCBmaWxlcyAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGNwcCAgICAgICAgICAuID8gc2VhcmNoIG9ubHkgY3BwIGZpbGVzICAgICAgICAgICAgICAuID0gZmFsc2UgLiAtIENcbiAgICBqc29uICAgICAgICAgLiA/IHNlYXJjaCBvbmx5IGpzb24gZmlsZXMgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBKXG4gICAgbnVtYmVycyAgICAgIC4gPyBwcmVmaXggd2l0aCBsaW5lIG51bWJlcnMgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gTlxuICAgIHJlZ2V4cCAgICAgICAuID8gc3RyaW5ncyBhcmUgcmVnZXhwIHBhdHRlcm5zICAgICAgICAuID0gZmFsc2VcbiAgICBkb3QgICAgICAgICAgLiA/IHNlYXJjaCBkb3QgZmlsZXMgICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlXG4gICAgc3RkaW4gICAgICAgIC4gPyByZWFkIGZyb20gc3RkaW4gICAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gaVxuICAgIGtvbG9yICAgICAgICAuID8gY29sb3JpemUgb3V0cHV0ICAgICAgICAgICAgICAgICAgICAuID0gdHJ1ZVxuICAgIHJlcGxhY2UgICAgICAuID8g8J+UpXJlcGxhY2UgbWF0Y2hlcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4gLSAtXG4gICAgcmVtb3ZlICAgICAgIC4gPyDwn5SlcmVtb3ZlIG1hdGNoZXMgICAgICAgICAgICAgICAgICAgICAuID0gZmFsc2UgLiAtIC1cbiAgICByZW1vdmVsaW5lcyAgLiA/IPCflKVyZW1vdmUgbGluZXMgY29udGFpbmluZyBtYXRjaGVzICAgIC4gPSBmYWxzZSAuIC0gLVxuICAgIGRlYnVnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZSAuIC0gWFxuXG52ZXJzaW9uICAgICAgICN7cmVxdWlyZShcIiN7X19kaXJuYW1lfS8uLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbn1cblwiXCJcIlxuXG5rb2xvci5nbG9iYWxpemUgYXJncy5rb2xvclxuXG5pZiBhcmdzLnJlcGxhY2UgYW5kIChhcmdzLnJlbW92ZSBvciBhcmdzLnJlbW92ZWxpbmVzKSBvciBhcmdzLnJlbW92ZSBhbmQgYXJncy5yZW1vdmVsaW5lc1xuICAgIFxuICAgIGVycm9yIFI0IHk1IFwiIPCflKXwn5KlIG11bHRpcGxlIHJlcGxhY2Ugb3B0aW9ucyBwcm92aWRlZCEgd29uJ3QgcmVwbGFjZSBhbnl0aGluZyEg8J+SpfCflKVcIlxuICAgIGRlbGV0ZSBhcmdzLnJlcGxhY2VcbiAgICBkZWxldGUgYXJncy5yZW1vdmVcbiAgICBkZWxldGUgYXJncy5yZW1vdmVsaW5lc1xuXG5pZiBhcmdzLnBhdGggPT0gJy4nIGFuZCBhcmdzLnN0cmluZ3MubGVuZ3RoXG4gICAgaWYgc2xhc2guZXhpc3RzIGFyZ3Muc3RyaW5nc1swXVxuICAgICAgICBpZiBhcmdzLnN0cmluZ3MubGVuZ3RoID4gMSBvciBzbGFzaC5pc0ZpbGUgYXJncy5zdHJpbmdzWzBdXG4gICAgICAgICAgICBhcmdzLnBhdGggPSBhcmdzLnN0cmluZ3Muc2hpZnQoKVxuICAgIGVsc2UgaWYgc2xhc2guZXhpc3RzIGFyZ3Muc3RyaW5nc1stMV1cbiAgICAgICAgYXJncy5wYXRoID0gYXJncy5zdHJpbmdzLnBvcCgpXG5cbmlmIGFyZ3MuZGVwdGggPT0gJ+KInicgdGhlbiBhcmdzLmRlcHRoID0gSW5maW5pdHlcbmVsc2UgYXJncy5kZXB0aCA9IE1hdGgubWF4IDAsIHBhcnNlSW50IGFyZ3MuZGVwdGhcbmlmIE51bWJlci5pc05hTiBhcmdzLmRlcHRoIHRoZW4gYXJncy5kZXB0aCA9IDBcbiAgICAgICAgXG5hcmdzLnBhdGggPSBzbGFzaC5yZXNvbHZlIGFyZ3MucGF0aFxuXG5pZiBhcmdzLl9faWdub3JlZD8ubGVuZ3RoXG4gICAgYXJncy5zdHJpbmdzID0gYXJncy5zdHJpbmdzLmNvbmNhdCBhcmdzLl9faWdub3JlZFxuICAgIFxuaGFzRXh0ID0gWydjb2ZmZWUnJ25vb24nJ2pzb24nJ2pzJydtZCcnY3BwJydwdWcnJ3N0eWwnXVxuICAgIC5tYXAgKHQpIC0+IGFyZ3NbdF1cbiAgICAuZmlsdGVyIChiKSAtPiBiXG4gICAgLmxlbmd0aCA+IDBcbiAgICBcbmlmIG5vdCBoYXNFeHQgdGhlbiBhcmdzLmFueSA9IHRydWVcblxuIyAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIFxuIyAwMDAgIDAwMCAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAgIDAwMCAgMDAwMCAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIFxuXG5pZ25vcmVGaWxlID0gKHApIC0+XG4gICAgXG4gICAgYmFzZSA9IHNsYXNoLmJhc2VuYW1lIHBcbiAgICBleHQgID0gc2xhc2guZXh0IHBcbiAgICBcbiAgICBpZiBzbGFzaC53aW4oKVxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlWzBdID09ICckJ1xuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlID09ICdkZXNrdG9wLmluaSdcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgYmFzZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGggJ250dXNlcidcbiAgICBcbiAgICByZXR1cm4gZmFsc2UgaWYgcCA9PSBhcmdzLnBhdGhcbiAgICBpZiBhcmdzLmV4dCB0aGVuIHJldHVybiBleHQgIT0gYXJncy5leHRcbiAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlWzBdID09ICcuJyBhbmQgbm90IGFyZ3MuZG90XG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuYW55XG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuanMgICAgIGFuZCBleHQgPT0gJ2pzJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmpzb24gICBhbmQgZXh0ID09ICdqc29uJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLm5vb24gICBhbmQgZXh0ID09ICdub29uJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLm1kICAgICBhbmQgZXh0ID09ICdtZCdcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5wdWcgICAgYW5kIGV4dCA9PSAncHVnJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLnN0eWwgICBhbmQgZXh0ID09ICdzdHlsJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmNwcCAgICBhbmQgZXh0IGluIFsnY3BwJywgJ2hwcCcsICdoJ11cbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5jb2ZmZWUgYW5kIGV4dCBpbiBbJ2tvZmZlZScnY29mZmVlJ11cbiAgICByZXR1cm4gdHJ1ZVxuXG5pZ25vcmVEaXIgPSAocCkgLT5cbiAgICBcbiAgICByZXR1cm4gZmFsc2UgaWYgcCA9PSBhcmdzLnBhdGhcbiAgICBiYXNlID0gc2xhc2guYmFzZW5hbWUgcFxuICAgIGV4dCAgPSBzbGFzaC5leHQgcFxuICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJy4nXG4gICAgcmV0dXJuIHRydWUgaWYgYmFzZSA9PSAnbm9kZV9tb2R1bGVzJ1xuICAgIHJldHVybiB0cnVlIGlmIGV4dCAgPT0gJ2FwcCdcbiAgICBmYWxzZVxuICAgICAgICAgICAgICAgIFxuIyAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICBcbiMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwICAgIDAwMCAgICAgICAwMDAwMDAwMDAgIFxuIyAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICBcbiMgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG5cbk5FV0xJTkUgPSAvXFxyP1xcbi9cblxuaWYgYXJncy5zdHJpbmdzLmxlbmd0aFxuICAgIGlmIGFyZ3MucmVnZXhwXG4gICAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAgXCIoXCIgKyBhcmdzLnN0cmluZ3Muam9pbignfCcpICsgXCIpXCIsICdnJ1xuICAgIGVsc2VcbiAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cCBcIihcIiArIGFyZ3Muc3RyaW5ncy5tYXAoKHMpIC0+IGtzdHIuZXNjYXBlUmVnZXhwKHMpKS5qb2luKCd8JykgKyBcIilcIiwgJ2cnXG5lbHNlXG4gICAgZHVtcCA9IHRydWVcblxuc2VhcmNoID0gKHBhdGhzLCBkZXB0aD0wKSAtPlxuICAgICAgICAgICAgXG4gICAgcGF0aHMuZm9yRWFjaCAocGF0aCkgLT5cbiAgICAgICAgXG4gICAgICAgIGlmIHNsYXNoLmlzRGlyIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGlyID0gc2xhc2gucmVzb2x2ZSBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgoYXJncy5yZWN1cnNlIGFuZCBkZXB0aCA8IGFyZ3MuZGVwdGgpIG9yIGRlcHRoID09IDApIGFuZCBub3QgaWdub3JlRGlyIGRpclxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNlYXJjaCBmcy5yZWFkZGlyU3luYyhkaXIpLm1hcCgocCkgLT4gc2xhc2guam9pbiBkaXIsIHApLCBkZXB0aCsxXG4gICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBzbGFzaC5pc1RleHQgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmaWxlID0gc2xhc2gucmVzb2x2ZSBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG5vdCBpZ25vcmVGaWxlIGZpbGVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHByaW50SGVhZGVyID0gLT5cbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmdzLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsID0gc2xhc2gucmVsYXRpdmUgZmlsZSwgcHJvY2Vzcy5jd2QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nICcnXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgVzEgeTUgJyDilrggJyArIGcyIHNsYXNoLmRpcm5hbWUocmVsKSArICcvJyArIHk1IHNsYXNoLmJhc2UocmVsKSArIHkxICcuJyArIHNsYXNoLmV4dChyZWwpICsgJyAnXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgJydcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0ZXh0ICA9IHNsYXNoLnJlYWRUZXh0IGZpbGVcbiAgICAgICAgICAgICAgICBsaW5lcyA9IHRleHQuc3BsaXQgTkVXTElORVxuICAgICAgICAgICAgICAgIHJuZ3MgID0ga2xvci5kaXNzZWN0IGxpbmVzLCBzbGFzaC5leHQgZmlsZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciBpbmRleCBpbiBbMC4uLmxpbmVzLmxlbmd0aF1cbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmVzW2luZGV4XVxuICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJyB0aGVuIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgIGlmIGR1bXBcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50SGVhZGVyKCkgaWYgbm90IGhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0IHJuZ3NbaW5kZXhdLCBpbmRleCsxLCBbXVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnNlYXJjaChyZWdleHApID49IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludEhlYWRlcigpIGlmIG5vdCBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRzID0gaGlnaGxpZ2h0UmFuZ2VzIGxpbmUsIHJlZ2V4cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKWuGFzc2VydCBoaWdobGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlZCA9IHNsaWNlUmFuZ2VzIHJuZ3NbaW5kZXhdLCBoaWdobGlnaHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0IHNsaWNlZCwgaW5kZXgrMSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIHJlZ2V4cCBhbmQgbm90IGR1bXAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MucmVwbGFjZSBvciBhcmdzLnJlbW92ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGluZGV4IGluIFswLi4ubGluZXMubGVuZ3RoXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpbmRleF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJyB0aGVuIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXJncy5yZW1vdmUgdGhlbiByZXBsYWNlV2l0aCA9ICcnIGVsc2UgcmVwbGFjZVdpdGggPSBhcmdzLnJlcGxhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpbmRleF0gPSBsaW5lLnJlcGxhY2UgcmVnZXhwLCByZXBsYWNlV2l0aFxuICAgICAgICAgICAgICAgICAgICAgICAgc2xhc2gud3JpdGVUZXh0IGZpbGUsIGxpbmVzLmpvaW4gJ1xcbidcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBhcmdzLnJlbW92ZWxpbmVzXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMaW5lcyA9IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgaW5kZXggaW4gWzAuLi5saW5lcy5sZW5ndGhdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmVzW2luZGV4XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGxpbmUuc3RhcnRzV2l0aCAnLy8jIHNvdXJjZU1hcHBpbmdVUkwnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdMaW5lcy5wdXNoIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnNlYXJjaChyZWdleHApID49IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdMaW5lcy5wdXNoIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsYXNoLndyaXRlVGV4dCBmaWxlLCBuZXdMaW5lcy5qb2luICdcXG4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG5cbmhpZ2hsaWdodFJhbmdlcyA9IChsaW5lLCByZWdleHApIC0+XG4gICAgXG4gICAgcmFuZ2VzID0gW11cbiAgICB3aGlsZSBtID0gcmVnZXhwLmV4ZWMgbGluZVxuICAgICAgICByYW5nZXMucHVzaCBzdGFydDptLmluZGV4LCBlbmQ6bS5pbmRleCttWzBdLmxlbmd0aC0xXG4gICAgcmFuZ2VzXG4gICAgXG5zbGljZVJhbmdlcyA9IChyYW5nZXMsIGhpZ2hsaWdodHMpIC0+XG5cbiAgICBoID0gMFxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IHJhbmdlcy5sZW5ndGhcbiAgICAgICAgcmFuZ2UgPSByYW5nZXNbaV1cbiAgICAgICAgd2hpbGUgaCA8IGhpZ2hsaWdodHMubGVuZ3RoIGFuZCByYW5nZS5zdGFydCA+IGhpZ2hsaWdodHNbaF0uZW5kXG4gICAgICAgICAgICBoKytcbiAgICAgICAgXG4gICAgICAgIGlmIGggPj0gaGlnaGxpZ2h0cy5sZW5ndGggdGhlbiByZXR1cm4gcmFuZ2VzXG5cbiAgICAgICAgc3BsaXQgPSAwXG4gICAgICAgIGlmIHJhbmdlLnN0YXJ0IDwgaGlnaGxpZ2h0c1toXS5zdGFydCA8PSByYW5nZS5zdGFydCtyYW5nZS5sZW5ndGhcbiAgICAgICAgICAgIHNwbGl0ICA9IGhpZ2hsaWdodHNbaF0uc3RhcnQgLSByYW5nZS5zdGFydFxuICAgICAgICBlbHNlIGlmIHJhbmdlLnN0YXJ0IDw9IGhpZ2hsaWdodHNbaF0uZW5kIDwgcmFuZ2Uuc3RhcnQrcmFuZ2UubGVuZ3RoXG4gICAgICAgICAgICBzcGxpdCA9IGhpZ2hsaWdodHNbaF0uZW5kIC0gcmFuZ2Uuc3RhcnQgKyAxXG5cbiAgICAgICAgaWYgc3BsaXRcbiAgICAgICAgICAgIGJlZm9yZSA9IE9iamVjdC5hc3NpZ24ge30sIHJhbmdlXG4gICAgICAgICAgICBhZnRlciAgPSBPYmplY3QuYXNzaWduIHt9LCByYW5nZVxuICAgICAgICAgICAgYmVmb3JlLm1hdGNoICA9IHJhbmdlLm1hdGNoWy4uLnNwbGl0XVxuICAgICAgICAgICAgYmVmb3JlLmxlbmd0aCA9IGJlZm9yZS5tYXRjaC5sZW5ndGhcbiAgICAgICAgICAgIGFmdGVyLm1hdGNoICAgPSByYW5nZS5tYXRjaFtzcGxpdC4uLl1cbiAgICAgICAgICAgIGFmdGVyLmxlbmd0aCAgPSBhZnRlci5tYXRjaC5sZW5ndGhcbiAgICAgICAgICAgIGFmdGVyLnN0YXJ0ICAgPSByYW5nZS5zdGFydCArIGJlZm9yZS5sZW5ndGhcbiAgICAgICAgICAgIHJhbmdlcy5zcGxpY2UgaSwgMSwgYmVmb3JlLCBhZnRlclxuICAgICAgICBpKytcbiAgICByYW5nZXNcbiAgICAgICAgICAgIFxuIyAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiMgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgICAgICAgMDAwMDAwMCAgICAgIDAwMCAgICAgXG5cbm91dHB1dCA9IChybmdzLCBudW1iZXIsIGhpZ2hsaWdodHMpIC0+XG4gICAgXG4gICAgY2xyemQgPSAnJ1xuICAgIFxuICAgIGlmIGFyZ3MubnVtYmVyc1xuICAgICAgICBudW1zdHIgPSBTdHJpbmcgbnVtYmVyXG4gICAgICAgIGNscnpkICs9IHcyKG51bXN0cikgKyBrc3RyLnJwYWQgJycsIDQtbnVtc3RyLmxlbmd0aFxuICAgICAgICBcbiAgICBjID0gMFxuICAgIGggPSAwXG4gICAgaGlnaGxpZ2h0ID0gKHMpIC0+XG4gICAgICAgIGlmIGggPCBoaWdobGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgaWYgYyA+PSBoaWdobGlnaHRzW2hdLnN0YXJ0IGFuZCBjIDw9IGhpZ2hsaWdodHNbaF0uZW5kXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludmVyc2Ugc1xuICAgICAgICAgICAgd2hpbGUgaCA8IGhpZ2hsaWdodHMubGVuZ3RoIGFuZCBjID4gaGlnaGxpZ2h0c1toXS5lbmRcbiAgICAgICAgICAgICAgICBoKytcbiAgICAgICAgc1xuICAgIFxuICAgIGZvciBpIGluIFswLi4ucm5ncy5sZW5ndGhdXG4gICAgICAgIHdoaWxlIGMgPCBybmdzW2ldLnN0YXJ0IFxuICAgICAgICAgICAgY2xyemQgKz0gaGlnaGxpZ2h0ICcgJ1xuICAgICAgICAgICAgYysrXG4gICAgICAgIGNscnpkICs9IGhpZ2hsaWdodCBjb2xvcml6ZSBybmdzW2ldXG4gICAgICAgIGMgKz0gcm5nc1tpXS5tYXRjaC5sZW5ndGhcbiAgICAgICAgXG4gICAgbG9nIGNscnpkXG5cbiMgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAwMDAgICAwMDAgICAgICAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgICAgMDAwICAgIDAwMDAwMDAgICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIFxuIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgXG5cbkxJID0gLyhcXHNsaVxcZFxcc3xcXHNoXFxkXFxzKS9cblxuY29sb3JpemUgPSAoY2h1bmspIC0+IFxuICAgIFxuICAgIGlmIGNuID0ga29sb3IubWFwW2NodW5rLmNsc3NdXG4gICAgICAgIGlmIGNuIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICAgIHYgPSBjaHVuay5tYXRjaFxuICAgICAgICAgICAgZm9yIGMgaW4gY25cbiAgICAgICAgICAgICAgICB2ID0gZ2xvYmFsW2NdIHZcbiAgICAgICAgICAgIHJldHVybiB2XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxbY25dIGNodW5rLm1hdGNoXG4gICAgXG4gICAgaWYgY2h1bmsuY2xzcy5lbmRzV2l0aCAnZmlsZSdcbiAgICAgICAgdzggY2h1bmsubWF0Y2hcbiAgICBlbHNlIGlmIGNodW5rLmNsc3MuZW5kc1dpdGggJ2V4dCdcbiAgICAgICAgdzMgY2h1bmsubWF0Y2hcbiAgICBlbHNlIGlmIGNodW5rLmNsc3Muc3RhcnRzV2l0aCAncHVuY3QnXG4gICAgICAgIGlmIExJLnRlc3QgY2h1bmsuY2xzc1xuICAgICAgICAgICAgY29sb3JpemUgbWF0Y2g6Y2h1bmsubWF0Y2gsIGNsc3M6Y2h1bmsuY2xzcy5yZXBsYWNlIExJLCAnICdcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdzIgY2h1bmsubWF0Y2hcbiAgICBlbHNlXG4gICAgICAgIGlmIExJLnRlc3QgY2h1bmsuY2xzc1xuICAgICAgICAgICAgY29sb3JpemUgbWF0Y2g6Y2h1bmsubWF0Y2gsIGNsc3M6Y2h1bmsuY2xzcy5yZXBsYWNlIExJLCAnICdcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2h1bmsubWF0Y2hcbiAgICBcbmlmIGFyZ3MuZGVidWdcbiAgICBub29uID0gcmVxdWlyZSAnbm9vbidcbiAgICBsb2cgbm9vbi5zdHJpbmdpZnkgYXJncywgY29sb3JzOnRydWVcblxuaWYgbm90IGFyZ3Muc3RkaW5cbiAgICBzZWFyY2ggW2FyZ3MucGF0aF1cbiAgICAjIGxvZyAnJ1xuICAgIHByb2Nlc3MuZXhpdCAwXG4gICAgXG4jIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIFxuIyAwMDAwMDAwMCAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgXG4jIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgICBcbiMgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwMDAwMDAgIFxuXG5waXBlVHlwZSA9IG51bGxcbnByb2Nlc3Muc3RkaW4ub24gJ3JlYWRhYmxlJyAtPlxuICAgIGlmIG5vdCBwaXBlVHlwZVxuICAgICAgICBpZiAgICAgIGFyZ3MuY29mZmVlIHRoZW4gcGlwZVR5cGUgPSAnY29mZmVlJ1xuICAgICAgICBlbHNlIGlmIGFyZ3Mubm9vbiAgIHRoZW4gcGlwZVR5cGUgPSAnbm9vbidcbiAgICAgICAgZWxzZSBpZiBhcmdzLmpzb24gICB0aGVuIHBpcGVUeXBlID0gJ2pzb24nXG4gICAgICAgIGVsc2UgaWYgYXJncy5jcHAgICAgdGhlbiBwaXBlVHlwZSA9ICdjcHAnXG4gICAgICAgIGVsc2UgaWYgYXJncy5qcyAgICAgdGhlbiBwaXBlVHlwZSA9ICdqcydcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgIHBpcGVUeXBlID0gJ3R4dCdcbiAgICAgICAgXG4gICAgaWYgdGV4dCA9IHByb2Nlc3Muc3RkaW4ucmVhZCgpPy50b1N0cmluZyAndXRmOCdcbiAgICAgICAgbGluZXMgPSB0ZXh0LnNwbGl0IE5FV0xJTkVcbiAgICAgICAgcm5ncyAgPSBrbG9yLmRpc3NlY3QgbGluZXMsIHBpcGVUeXBlXG4gICAgICAgIFxuICAgICAgICBmb3IgaW5kZXggaW4gWzAuLi5saW5lcy5sZW5ndGhdXG4gICAgICAgICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJ1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGlmIGR1bXBcbiAgICAgICAgICAgICAgICBvdXRwdXQgcm5nc1tpbmRleF0sIGluZGV4KzEsIFtdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgbGluZS5zZWFyY2gocmVnZXhwKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMgPSBoaWdobGlnaHRSYW5nZXMgbGluZSwgcmVnZXhwXG4gICAgICAgICAgICAgICAgICAgIOKWuGFzc2VydCBoaWdobGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBzbGljZWQgPSBzbGljZVJhbmdlcyBybmdzW2luZGV4XSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgc2xpY2VkLCBpbmRleCsxLCBoaWdobGlnaHRzXG4gICAgICAgIFxucHJvY2Vzcy5zdGRpbi5vbiAnZW5kJyAtPiBcbiAgICAiXX0=
//# sourceURL=../coffee/krep.coffee