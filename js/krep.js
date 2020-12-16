// koffee 1.14.0

/*
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000
 */
var LI, NEWLINE, args, colorize, fs, hasExt, highlightRanges, ignoreDir, ignoreFile, karg, klor, kolor, kstr, noon, output, ref, search, slash, sliceRanges;

fs = require('fs');

slash = require('kslash');

karg = require('karg');

klor = require('klor');

kstr = require('kstr');

kolor = klor.kolor;

kolor.globalize();

args = karg("krep\n    strings   . ? text to search for                . **\n    header    . ? print file headers                . = true  . - H\n    recurse   . ? recurse into subdirs              . = true  . - R\n    depth     . ? recursion depth                   . = ∞     . - D    \n    path      . ? file or folder to search in       . = |.|\n    ext       . ? search only files with extension  . = ||\n    coffee    . ? search only coffeescript files    . = false\n    noon      . ? search only noon files            . = false\n    styl      . ? search only styl files            . = false . - S\n    pug       . ? search only pug files             . = false . - P\n    md        . ? search only md files              . = false\n    js        . ? search only javascript files      . = false\n    cpp       . ? search only cpp files             . = false . - C\n    json      . ? search only json files            . = false . - J\n    numbers   . ? prefix with line numbers          . = false . - N\n    regexp    . ? strings are regexp patterns       . = false\n    dot       . ? search dot files                  . = false\n    debug                                           . = false . - X\n\nversion       " + (require(__dirname + "/../package.json").version));

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

search = function(paths, depth) {
    var dump, regexp;
    if (depth == null) {
        depth = 0;
    }
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
                                klog('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m163[39m', '[1m[97massertion failure![39m[22m');

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
                v = kolor[c](v);
            }
            return v;
        } else {
            return kolor[cn](chunk.match);
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

search([args.path]);

console.log('');

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3JlcC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImtyZXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLEVBQUEsR0FBUSxPQUFBLENBQVEsSUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBRVIsS0FBQSxHQUFRLElBQUksQ0FBQzs7QUFDYixLQUFLLENBQUMsU0FBTixDQUFBOztBQUVBLElBQUEsR0FBTyxJQUFBLENBQUssc3JDQUFBLEdBcUJHLENBQUMsT0FBQSxDQUFXLFNBQUQsR0FBVyxrQkFBckIsQ0FBdUMsQ0FBQyxPQUF6QyxDQXJCUjs7QUF3QlAsSUFBRyxJQUFJLENBQUMsSUFBTCxLQUFhLEdBQWIsSUFBcUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFyQztJQUNJLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFJLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBMUIsQ0FBSDtRQUNJLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFiLEdBQXNCLENBQXRCLElBQTJCLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQTFCLENBQTlCO1lBQ0ksSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQWIsQ0FBQSxFQURoQjtTQURKO0tBQUEsTUFHSyxJQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBSSxDQUFDLE9BQVEsVUFBRSxDQUFBLENBQUEsQ0FBNUIsQ0FBSDtRQUNELElBQUksQ0FBQyxJQUFMLEdBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFiLENBQUEsRUFEWDtLQUpUOzs7QUFPQSxJQUFHLElBQUksQ0FB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QUFwQixDQUFIO2VBQ0QsRUFBQSxDQUFHLEtBQUssQ0FBQyxLQUFULEVBREM7S0FBQSxNQUVBLElBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFYLENBQXNCLE9BQXRCLENBQUg7UUFDRCxJQUFHLEVBQUUsQ0FBQyxJQUFILENBQVEsS0FBSyxDQUFDLElBQWQsQ0FBSDttQkFDSSxRQUFBLENBQVM7Z0JBQUEsS0FBQSxFQUFNLEtBQUssQ0FBQyxLQUFaO2dCQUFtQixJQUFBLEVBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFYLENBQW1CLEVBQW5CLEVBQXVCLEdBQXZCLENBQXhCO2FBQVQsRUFESjtTQUFBLE1BQUE7bUJBR0ksRUFBQSxDQUFHLEtBQUssQ0FBQyxLQUFULEVBSEo7U0FEQztLQUFBLE1BQUE7UUFNRCxJQUFHLEVBQUUsQ0FBQyxJQUFILENBQVEsS0FBSyxDQUFDLElBQWQsQ0FBSDttQkFDSSxRQUFBLENBQVM7Z0JBQUEsS0FBQSxFQUFNLEtBQUssQ0FBQyxLQUFaO2dCQUFtQixJQUFBLEVBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFYLENBQW1CLEVBQW5CLEVBQXVCLEdBQXZCLENBQXhCO2FBQVQsRUFESjtTQUFBLE1BQUE7bUJBR0ksS0FBSyxDQUFDLE1BSFY7U0FOQzs7QUFoQkU7O0FBMkJYLElBQUcsSUFBSSxDQUFDLEtBQVI7SUFDSSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7SUFBYyxPQUFBLENBQ3JCLEdBRHFCLENBQ2pCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQUFxQjtRQUFBLE1BQUEsRUFBTyxJQUFQO0tBQXJCLENBRGlCLEVBRHpCOzs7QUFJQSxNQUFBLENBQU8sQ0FBQyxJQUFJLENBQUMsSUFBTixDQUFQOztBQUFrQixPQUFBLENBQ2xCLEdBRGtCLENBQ2QsRUFEYyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4wMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICBcbjAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgXG4jIyNcblxuZnMgICAgPSByZXF1aXJlICdmcydcbnNsYXNoID0gcmVxdWlyZSAna3NsYXNoJ1xua2FyZyAgPSByZXF1aXJlICdrYXJnJ1xua2xvciAgPSByZXF1aXJlICdrbG9yJ1xua3N0ciAgPSByZXF1aXJlICdrc3RyJ1xuXG5rb2xvciA9IGtsb3Iua29sb3JcbmtvbG9yLmdsb2JhbGl6ZSgpXG5cbmFyZ3MgPSBrYXJnIFwiXCJcIlxua3JlcFxuICAgIHN0cmluZ3MgICAuID8gdGV4dCB0byBzZWFyY2ggZm9yICAgICAgICAgICAgICAgIC4gKipcbiAgICBoZWFkZXIgICAgLiA/IHByaW50IGZpbGUgaGVhZGVycyAgICAgICAgICAgICAgICAuID0gdHJ1ZSAgLiAtIEhcbiAgICByZWN1cnNlICAgLiA/IHJlY3Vyc2UgaW50byBzdWJkaXJzICAgICAgICAgICAgICAuID0gdHJ1ZSAgLiAtIFJcbiAgICBkZXB0aCAgICAgLiA/IHJlY3Vyc2lvbiBkZXB0aCAgICAgICAgICAgICAgICAgICAuID0g4oieICAgICAuIC0gRCAgICBcbiAgICBwYXRoICAgICAgLiA/IGZpbGUgb3IgZm9sZGVyIHRvIHNlYXJjaCBpbiAgICAgICAuID0gfC58XG4gICAgZXh0ICAgICAgIC4gPyBzZWFyY2ggb25seSBmaWxlcyB3aXRoIGV4dGVuc2lvbiAgLiA9IHx8XG4gICAgY29mZmVlICAgIC4gPyBzZWFyY2ggb25seSBjb2ZmZWVzY3JpcHQgZmlsZXMgICAgLiA9IGZhbHNlXG4gICAgbm9vbiAgICAgIC4gPyBzZWFyY2ggb25seSBub29uIGZpbGVzICAgICAgICAgICAgLiA9IGZhbHNlXG4gICAgc3R5bCAgICAgIC4gPyBzZWFyY2ggb25seSBzdHlsIGZpbGVzICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBTXG4gICAgcHVnICAgICAgIC4gPyBzZWFyY2ggb25seSBwdWcgZmlsZXMgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBQXG4gICAgbWQgICAgICAgIC4gPyBzZWFyY2ggb25seSBtZCBmaWxlcyAgICAgICAgICAgICAgLiA9IGZhbHNlXG4gICAganMgICAgICAgIC4gPyBzZWFyY2ggb25seSBqYXZhc2NyaXB0IGZpbGVzICAgICAgLiA9IGZhbHNlXG4gICAgY3BwICAgICAgIC4gPyBzZWFyY2ggb25seSBjcHAgZmlsZXMgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBDXG4gICAganNvbiAgICAgIC4gPyBzZWFyY2ggb25seSBqc29uIGZpbGVzICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBKXG4gICAgbnVtYmVycyAgIC4gPyBwcmVmaXggd2l0aCBsaW5lIG51bWJlcnMgICAgICAgICAgLiA9IGZhbHNlIC4gLSBOXG4gICAgcmVnZXhwICAgIC4gPyBzdHJpbmdzIGFyZSByZWdleHAgcGF0dGVybnMgICAgICAgLiA9IGZhbHNlXG4gICAgZG90ICAgICAgIC4gPyBzZWFyY2ggZG90IGZpbGVzICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlXG4gICAgZGVidWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLiA9IGZhbHNlIC4gLSBYXG5cbnZlcnNpb24gICAgICAgI3tyZXF1aXJlKFwiI3tfX2Rpcm5hbWV9Ly4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufVxuXCJcIlwiXG5cbmlmIGFyZ3MucGF0aCA9PSAnLicgYW5kIGFyZ3Muc3RyaW5ncy5sZW5ndGhcbiAgICBpZiBzbGFzaC5leGlzdHMgYXJncy5zdHJpbmdzWzBdXG4gICAgICAgIGlmIGFyZ3Muc3RyaW5ncy5sZW5ndGggPiAxIG9yIHNsYXNoLmlzRmlsZSBhcmdzLnN0cmluZ3NbMF1cbiAgICAgICAgICAgIGFyZ3MucGF0aCA9IGFyZ3Muc3RyaW5ncy5zaGlmdCgpXG4gICAgZWxzZSBpZiBzbGFzaC5leGlzdHMgYXJncy5zdHJpbmdzWy0xXVxuICAgICAgICBhcmdzLnBhdGggPSBhcmdzLnN0cmluZ3MucG9wKClcblxuaWYgYXJncy5kZXB0aCA9PSAn4oieJyB0aGVuIGFyZ3MuZGVwdGggPSBJbmZpbml0eVxuZWxzZSBhcmdzLmRlcHRoID0gTWF0aC5tYXggMCwgcGFyc2VJbnQgYXJncy5kZXB0aFxuaWYgTnVtYmVyLmlzTmFOIGFyZ3MuZGVwdGggdGhlbiBhcmdzLmRlcHRoID0gMFxuICAgICAgICBcbmFyZ3MucGF0aCA9IHNsYXNoLnJlc29sdmUgYXJncy5wYXRoXG5cbmlmIGFyZ3MuX19pZ25vcmVkPy5sZW5ndGhcbiAgICBhcmdzLnN0cmluZ3MgPSBhcmdzLnN0cmluZ3MuY29uY2F0IGFyZ3MuX19pZ25vcmVkXG4gICAgXG5oYXNFeHQgPSBbJ2NvZmZlZScnbm9vbicnanNvbicnanMnJ21kJydjcHAnJ3B1Zycnc3R5bCddXG4gICAgLm1hcCAodCkgLT4gYXJnc1t0XVxuICAgIC5maWx0ZXIgKGIpIC0+IGJcbiAgICAubGVuZ3RoID4gMFxuICAgIFxuaWYgbm90IGhhc0V4dCB0aGVuIGFyZ3MuYW55ID0gdHJ1ZVxuXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMCAgXG4jIDAwMCAgMDAwICAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMCAgMDAwICAwMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgXG4jIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgXG5cbmlnbm9yZUZpbGUgPSAocCkgLT5cbiAgICBcbiAgICBiYXNlID0gc2xhc2guYmFzZW5hbWUgcFxuICAgIGV4dCAgPSBzbGFzaC5leHQgcFxuICAgIFxuICAgIGlmIHNsYXNoLndpbigpXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJyQnXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2UgPT0gJ2Rlc2t0b3AuaW5pJ1xuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCAnbnR1c2VyJ1xuICAgIFxuICAgIHJldHVybiBmYWxzZSBpZiBwID09IGFyZ3MucGF0aFxuICAgIGlmIGFyZ3MuZXh0IHRoZW4gcmV0dXJuIGV4dCAhPSBhcmdzLmV4dFxuICAgIHJldHVybiB0cnVlIGlmIGJhc2VbMF0gPT0gJy4nIGFuZCBub3QgYXJncy5kb3RcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5hbnlcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5qcyAgICAgYW5kIGV4dCA9PSAnanMnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuanNvbiAgIGFuZCBleHQgPT0gJ2pzb24nXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3Mubm9vbiAgIGFuZCBleHQgPT0gJ25vb24nXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MubWQgICAgIGFuZCBleHQgPT0gJ21kJ1xuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLnB1ZyAgICBhbmQgZXh0ID09ICdwdWcnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3Muc3R5bCAgIGFuZCBleHQgPT0gJ3N0eWwnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuY3BwICAgIGFuZCBleHQgaW4gWydjcHAnLCAnaHBwJywgJ2gnXVxuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmNvZmZlZSBhbmQgZXh0IGluIFsna29mZmVlJydjb2ZmZWUnXVxuICAgIHJldHVybiB0cnVlXG5cbmlnbm9yZURpciA9IChwKSAtPlxuICAgIFxuICAgIHJldHVybiBmYWxzZSBpZiBwID09IGFyZ3MucGF0aFxuICAgIGJhc2UgPSBzbGFzaC5iYXNlbmFtZSBwXG4gICAgZXh0ICA9IHNsYXNoLmV4dCBwXG4gICAgcmV0dXJuIHRydWUgaWYgYmFzZVswXSA9PSAnLidcbiAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlID09ICdub2RlX21vZHVsZXMnXG4gICAgcmV0dXJuIHRydWUgaWYgZXh0ICA9PSAnYXBwJ1xuICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgXG4jICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICBcbiMgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgIDAwMDAwMDAwMCAgXG4jICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICBcblxuTkVXTElORSA9IC9cXHI/XFxuL1xuXG5zZWFyY2ggPSAocGF0aHMsIGRlcHRoPTApIC0+XG4gICAgXG4gICAgaWYgYXJncy5zdHJpbmdzLmxlbmd0aFxuICAgICAgICBpZiBhcmdzLnJlZ2V4cFxuICAgICAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cCBcIihcIiArIGFyZ3Muc3RyaW5ncy5qb2luKCd8JykgKyBcIilcIiwgJ2cnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAgXCIoXCIgKyBhcmdzLnN0cmluZ3MubWFwKChzKSAtPiBrc3RyLmVzY2FwZVJlZ2V4cChzKSkuam9pbignfCcpICsgXCIpXCIsICdnJ1xuICAgIGVsc2VcbiAgICAgICAgZHVtcCA9IHRydWVcbiAgICAgICAgXG4gICAgcGF0aHMuZm9yRWFjaCAocGF0aCkgLT5cbiAgICAgICAgXG4gICAgICAgIGlmIHNsYXNoLmlzRGlyIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGlyID0gc2xhc2gucmVzb2x2ZSBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgoYXJncy5yZWN1cnNlIGFuZCBkZXB0aCA8IGFyZ3MuZGVwdGgpIG9yIGRlcHRoID09IDApIGFuZCBub3QgaWdub3JlRGlyIGRpclxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNlYXJjaCBmcy5yZWFkZGlyU3luYyhkaXIpLm1hcCgocCkgLT4gc2xhc2guam9pbiBkaXIsIHApLCBkZXB0aCsxXG4gICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBzbGFzaC5pc1RleHQgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmaWxlID0gc2xhc2gucmVzb2x2ZSBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG5vdCBpZ25vcmVGaWxlIGZpbGVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHByaW50SGVhZGVyID0gLT5cbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmdzLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsID0gc2xhc2gucmVsYXRpdmUgZmlsZSwgcHJvY2Vzcy5jd2QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nICcnXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgVzEgeTUgJyDilrggJyArIGcyIHNsYXNoLmRpcm5hbWUocmVsKSArICcvJyArIHk1IHNsYXNoLmJhc2UocmVsKSArIHkxICcuJyArIHNsYXNoLmV4dChyZWwpICsgJyAnXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgJydcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0ZXh0ICA9IHNsYXNoLnJlYWRUZXh0IGZpbGVcbiAgICAgICAgICAgICAgICBsaW5lcyA9IHRleHQuc3BsaXQgTkVXTElORVxuICAgICAgICAgICAgICAgIHJuZ3MgID0ga2xvci5kaXNzZWN0IGxpbmVzLCBzbGFzaC5leHQgZmlsZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciBpbmRleCBpbiBbMC4uLmxpbmVzLmxlbmd0aF1cbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmVzW2luZGV4XVxuICAgICAgICAgICAgICAgICAgICBpZiBsaW5lLnN0YXJ0c1dpdGggJy8vIyBzb3VyY2VNYXBwaW5nVVJMJ1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICAgICAgaWYgZHVtcFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIoKSBpZiBub3QgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgcm5nc1tpbmRleF0sIGluZGV4KzEsIFtdXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGxpbmUuc2VhcmNoKHJlZ2V4cCkgPj0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50SGVhZGVyKCkgaWYgbm90IGhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMgPSBoaWdobGlnaHRSYW5nZXMgbGluZSwgcmVnZXhwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAg4pa4YXNzZXJ0IGhpZ2hsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpY2VkID0gc2xpY2VSYW5nZXMgcm5nc1tpbmRleF0sIGhpZ2hsaWdodHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgc2xpY2VkLCBpbmRleCsxLCBoaWdobGlnaHRzXG5cbiMgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuaGlnaGxpZ2h0UmFuZ2VzID0gKGxpbmUsIHJlZ2V4cCkgLT5cbiAgICBcbiAgICByYW5nZXMgPSBbXVxuICAgIHdoaWxlIG0gPSByZWdleHAuZXhlYyBsaW5lXG4gICAgICAgIHJhbmdlcy5wdXNoIHN0YXJ0Om0uaW5kZXgsIGVuZDptLmluZGV4K21bMF0ubGVuZ3RoLTFcbiAgICByYW5nZXNcbiAgICBcbnNsaWNlUmFuZ2VzID0gKHJhbmdlcywgaGlnaGxpZ2h0cykgLT5cblxuICAgIGggPSAwXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgcmFuZ2VzLmxlbmd0aFxuICAgICAgICByYW5nZSA9IHJhbmdlc1tpXVxuICAgICAgICB3aGlsZSBoIDwgaGlnaGxpZ2h0cy5sZW5ndGggYW5kIHJhbmdlLnN0YXJ0ID4gaGlnaGxpZ2h0c1toXS5lbmRcbiAgICAgICAgICAgIGgrK1xuICAgICAgICBcbiAgICAgICAgaWYgaCA+PSBoaWdobGlnaHRzLmxlbmd0aCB0aGVuIHJldHVybiByYW5nZXNcblxuICAgICAgICBzcGxpdCA9IDBcbiAgICAgICAgaWYgcmFuZ2Uuc3RhcnQgPCBoaWdobGlnaHRzW2hdLnN0YXJ0IDw9IHJhbmdlLnN0YXJ0K3JhbmdlLmxlbmd0aFxuICAgICAgICAgICAgc3BsaXQgID0gaGlnaGxpZ2h0c1toXS5zdGFydCAtIHJhbmdlLnN0YXJ0XG4gICAgICAgIGVsc2UgaWYgcmFuZ2Uuc3RhcnQgPD0gaGlnaGxpZ2h0c1toXS5lbmQgPCByYW5nZS5zdGFydCtyYW5nZS5sZW5ndGhcbiAgICAgICAgICAgIHNwbGl0ID0gaGlnaGxpZ2h0c1toXS5lbmQgLSByYW5nZS5zdGFydCArIDFcblxuICAgICAgICBpZiBzcGxpdFxuICAgICAgICAgICAgYmVmb3JlID0gT2JqZWN0LmFzc2lnbiB7fSwgcmFuZ2VcbiAgICAgICAgICAgIGFmdGVyICA9IE9iamVjdC5hc3NpZ24ge30sIHJhbmdlXG4gICAgICAgICAgICBiZWZvcmUubWF0Y2ggID0gcmFuZ2UubWF0Y2hbLi4uc3BsaXRdXG4gICAgICAgICAgICBiZWZvcmUubGVuZ3RoID0gYmVmb3JlLm1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgYWZ0ZXIubWF0Y2ggICA9IHJhbmdlLm1hdGNoW3NwbGl0Li4uXVxuICAgICAgICAgICAgYWZ0ZXIubGVuZ3RoICA9IGFmdGVyLm1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgYWZ0ZXIuc3RhcnQgICA9IHJhbmdlLnN0YXJ0ICsgYmVmb3JlLmxlbmd0aFxuICAgICAgICAgICAgcmFuZ2VzLnNwbGljZSBpLCAxLCBiZWZvcmUsIGFmdGVyXG4gICAgICAgIGkrK1xuICAgIHJhbmdlc1xuICAgICAgICAgICAgXG4jICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICBcblxub3V0cHV0ID0gKHJuZ3MsIG51bWJlciwgaGlnaGxpZ2h0cykgLT5cbiAgICBcbiAgICBjbHJ6ZCA9ICcnXG4gICAgXG4gICAgaWYgYXJncy5udW1iZXJzXG4gICAgICAgIG51bXN0ciA9IFN0cmluZyBudW1iZXJcbiAgICAgICAgY2xyemQgKz0gdzIobnVtc3RyKSArIGtzdHIucnBhZCAnJywgNC1udW1zdHIubGVuZ3RoXG4gICAgICAgIFxuICAgIGMgPSAwXG4gICAgaCA9IDBcbiAgICBoaWdobGlnaHQgPSAocykgLT5cbiAgICAgICAgaWYgaCA8IGhpZ2hsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBpZiBjID49IGhpZ2hsaWdodHNbaF0uc3RhcnQgYW5kIGMgPD0gaGlnaGxpZ2h0c1toXS5lbmRcbiAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJzZSBzXG4gICAgICAgICAgICB3aGlsZSBoIDwgaGlnaGxpZ2h0cy5sZW5ndGggYW5kIGMgPiBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgICAgIGgrK1xuICAgICAgICBzXG4gICAgXG4gICAgZm9yIGkgaW4gWzAuLi5ybmdzLmxlbmd0aF1cbiAgICAgICAgd2hpbGUgYyA8IHJuZ3NbaV0uc3RhcnQgXG4gICAgICAgICAgICBjbHJ6ZCArPSBoaWdobGlnaHQgJyAnXG4gICAgICAgICAgICBjKytcbiAgICAgICAgY2xyemQgKz0gaGlnaGxpZ2h0IGNvbG9yaXplIHJuZ3NbaV1cbiAgICAgICAgYyArPSBybmdzW2ldLm1hdGNoLmxlbmd0aFxuICAgICAgICBcbiAgICBsb2cgY2xyemRcblxuIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIDAwMCAgIDAwMCAgICAgICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcblxuTEkgPSAvKFxcc2xpXFxkXFxzfFxcc2hcXGRcXHMpL1xuXG5jb2xvcml6ZSA9IChjaHVuaykgLT4gXG4gICAgXG4gICAgaWYgY24gPSBrb2xvci5tYXBbY2h1bmsuY2xzc11cbiAgICAgICAgaWYgY24gaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgICAgdiA9IGNodW5rLm1hdGNoXG4gICAgICAgICAgICBmb3IgYyBpbiBjblxuICAgICAgICAgICAgICAgIHYgPSBrb2xvcltjXSB2XG4gICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4ga29sb3JbY25dIGNodW5rLm1hdGNoXG4gICAgICAgICAgICBcbiAgICBcbiAgICBpZiBjaHVuay5jbHNzLmVuZHNXaXRoICdmaWxlJ1xuICAgICAgICB3OCBjaHVuay5tYXRjaFxuICAgIGVsc2UgaWYgY2h1bmsuY2xzcy5lbmRzV2l0aCAnZXh0J1xuICAgICAgICB3MyBjaHVuay5tYXRjaFxuICAgIGVsc2UgaWYgY2h1bmsuY2xzcy5zdGFydHNXaXRoICdwdW5jdCdcbiAgICAgICAgaWYgTEkudGVzdCBjaHVuay5jbHNzXG4gICAgICAgICAgICBjb2xvcml6ZSBtYXRjaDpjaHVuay5tYXRjaCwgY2xzczpjaHVuay5jbHNzLnJlcGxhY2UgTEksICcgJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB3MiBjaHVuay5tYXRjaFxuICAgIGVsc2VcbiAgICAgICAgaWYgTEkudGVzdCBjaHVuay5jbHNzXG4gICAgICAgICAgICBjb2xvcml6ZSBtYXRjaDpjaHVuay5tYXRjaCwgY2xzczpjaHVuay5jbHNzLnJlcGxhY2UgTEksICcgJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaHVuay5tYXRjaFxuICAgIFxuaWYgYXJncy5kZWJ1Z1xuICAgIG5vb24gPSByZXF1aXJlICdub29uJ1xuICAgIGxvZyBub29uLnN0cmluZ2lmeSBhcmdzLCBjb2xvcnM6dHJ1ZVxuXG5zZWFyY2ggW2FyZ3MucGF0aF1cbmxvZyAnJ1xuIl19
//# sourceURL=../coffee/krep.coffee