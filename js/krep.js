// koffee 1.4.0

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
                                console.log('[33m[93mkrep[33m[2m.[22m[2mcoffee[22m[39m[2m[34m:[39m[22m[94m163[39m', '[1m[97massertion failure![39m[22m');

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
        clrzd += w1(numstr) + kstr.rpad('', 4 - numstr.length);
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
    if (cn = kolor.map[chunk.value]) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3JlcC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUE7O0FBUUEsRUFBQSxHQUFRLE9BQUEsQ0FBUSxJQUFSOztBQUNSLEtBQUEsR0FBUSxPQUFBLENBQVEsUUFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUjs7QUFFUixLQUFBLEdBQVEsSUFBSSxDQUFDOztBQUNiLEtBQUssQ0FBQyxTQUFOLENBQUE7O0FBRUEsSUFBQSxHQUFPLElBQUEsQ0FBSyxzckNBQUEsR0FxQkcsQ0FBQyxPQUFBLENBQVcsU0FBRCxHQUFXLGtCQUFyQixDQUF1QyxDQUFDLE9BQXpDLENBckJSOztBQXdCUCxJQUFHLElBQUksQ0FBQyxJQUFMLEtBQWEsR0FBYixJQUFxQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQXJDO0lBQ0ksSUFBRyxLQUFLLENBQUMsTUFBTixDQUFhLElBQUksQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUExQixDQUFIO1FBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsR0FBc0IsQ0FBdEIsSUFBMkIsS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFJLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBMUIsQ0FBOUI7WUFDSSxJQUFJLENBQUMsSUFBTCxHQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBYixDQUFBLEVBRGhCO1NBREo7S0FBQSxNQUdLLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFJLENBQUMsT0FBUSxVQUFFLENBQUEsQ0FBQSxDQUE1QixDQUFIO1FBQ0QsSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQWIsQ0FBQSxFQURYO0tBSlQ7OztBQU9BLElBQUcsSUFBSSxDQUFDLEtBQUwsS0FBYyxHQUFqQjtJ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LENBQUcsS0FBSyxDQUFDLEtBQVQsRUFEQztLQUFBLE1BRUEsSUFBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVgsQ0FBc0IsT0FBdEIsQ0FBSDtRQUNELElBQUcsRUFBRSxDQUFDLElBQUgsQ0FBUSxLQUFLLENBQUMsSUFBZCxDQUFIO21CQUNJLFFBQUEsQ0FBUztnQkFBQSxLQUFBLEVBQU0sS0FBSyxDQUFDLEtBQVo7Z0JBQW1CLElBQUEsRUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQVgsQ0FBbUIsRUFBbkIsRUFBdUIsR0FBdkIsQ0FBeEI7YUFBVCxFQURKO1NBQUEsTUFBQTttQkFJSSxFQUFBLENBQUcsS0FBSyxDQUFDLEtBQVQsRUFKSjtTQURDO0tBQUEsTUFBQTtRQU9ELElBQUcsRUFBRSxDQUFDLElBQUgsQ0FBUSxLQUFLLENBQUMsSUFBZCxDQUFIO21CQUNJLFFBQUEsQ0FBUztnQkFBQSxLQUFBLEVBQU0sS0FBSyxDQUFDLEtBQVo7Z0JBQW1CLElBQUEsRUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQVgsQ0FBbUIsRUFBbkIsRUFBdUIsR0FBdkIsQ0FBeEI7YUFBVCxFQURKO1NBQUEsTUFBQTttQkFJSSxLQUFLLENBQUMsTUFKVjtTQVBDOztBQWhCRTs7QUE2QlgsSUFBRyxJQUFJLENBQUMsS0FBUjtJQUNJLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjtJQUFjLE9BQUEsQ0FDckIsR0FEcUIsQ0FDakIsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLEVBQXFCO1FBQUEsTUFBQSxFQUFPLElBQVA7S0FBckIsQ0FEaUIsRUFEekI7OztBQUlBLE1BQUEsQ0FBTyxDQUFDLElBQUksQ0FBQyxJQUFOLENBQVA7O0FBQWtCLE9BQUEsQ0FDbEIsR0FEa0IsQ0FDZCxFQURjIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbjAwMDAwMDAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4wMDAgIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICBcbiMjI1xuXG5mcyAgICA9IHJlcXVpcmUgJ2ZzJ1xuc2xhc2ggPSByZXF1aXJlICdrc2xhc2gnXG5rYXJnICA9IHJlcXVpcmUgJ2thcmcnXG5rbG9yICA9IHJlcXVpcmUgJ2tsb3InXG5rc3RyICA9IHJlcXVpcmUgJ2tzdHInXG5cbmtvbG9yID0ga2xvci5rb2xvclxua29sb3IuZ2xvYmFsaXplKClcblxuYXJncyA9IGthcmcgXCJcIlwiXG5rcmVwXG4gICAgc3RyaW5ncyAgIC4gPyB0ZXh0IHRvIHNlYXJjaCBmb3IgICAgICAgICAgICAgICAgLiAqKlxuICAgIGhlYWRlciAgICAuID8gcHJpbnQgZmlsZSBoZWFkZXJzICAgICAgICAgICAgICAgIC4gPSB0cnVlICAuIC0gSFxuICAgIHJlY3Vyc2UgICAuID8gcmVjdXJzZSBpbnRvIHN1YmRpcnMgICAgICAgICAgICAgIC4gPSB0cnVlICAuIC0gUlxuICAgIGRlcHRoICAgICAuID8gcmVjdXJzaW9uIGRlcHRoICAgICAgICAgICAgICAgICAgIC4gPSDiiJ4gICAgIC4gLSBEICAgIFxuICAgIHBhdGggICAgICAuID8gZmlsZSBvciBmb2xkZXIgdG8gc2VhcmNoIGluICAgICAgIC4gPSB8LnxcbiAgICBleHQgICAgICAgLiA/IHNlYXJjaCBvbmx5IGZpbGVzIHdpdGggZXh0ZW5zaW9uICAuID0gfHxcbiAgICBjb2ZmZWUgICAgLiA/IHNlYXJjaCBvbmx5IGNvZmZlZXNjcmlwdCBmaWxlcyAgICAuID0gZmFsc2VcbiAgICBub29uICAgICAgLiA/IHNlYXJjaCBvbmx5IG5vb24gZmlsZXMgICAgICAgICAgICAuID0gZmFsc2VcbiAgICBzdHlsICAgICAgLiA/IHNlYXJjaCBvbmx5IHN0eWwgZmlsZXMgICAgICAgICAgICAuID0gZmFsc2UgLiAtIFNcbiAgICBwdWcgICAgICAgLiA/IHNlYXJjaCBvbmx5IHB1ZyBmaWxlcyAgICAgICAgICAgICAuID0gZmFsc2UgLiAtIFBcbiAgICBtZCAgICAgICAgLiA/IHNlYXJjaCBvbmx5IG1kIGZpbGVzICAgICAgICAgICAgICAuID0gZmFsc2VcbiAgICBqcyAgICAgICAgLiA/IHNlYXJjaCBvbmx5IGphdmFzY3JpcHQgZmlsZXMgICAgICAuID0gZmFsc2VcbiAgICBjcHAgICAgICAgLiA/IHNlYXJjaCBvbmx5IGNwcCBmaWxlcyAgICAgICAgICAgICAuID0gZmFsc2UgLiAtIENcbiAgICBqc29uICAgICAgLiA/IHNlYXJjaCBvbmx5IGpzb24gZmlsZXMgICAgICAgICAgICAuID0gZmFsc2UgLiAtIEpcbiAgICBudW1iZXJzICAgLiA/IHByZWZpeCB3aXRoIGxpbmUgbnVtYmVycyAgICAgICAgICAuID0gZmFsc2UgLiAtIE5cbiAgICByZWdleHAgICAgLiA/IHN0cmluZ3MgYXJlIHJlZ2V4cCBwYXR0ZXJucyAgICAgICAuID0gZmFsc2VcbiAgICBkb3QgICAgICAgLiA/IHNlYXJjaCBkb3QgZmlsZXMgICAgICAgICAgICAgICAgICAuID0gZmFsc2VcbiAgICBkZWJ1ZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuID0gZmFsc2UgLiAtIFhcblxudmVyc2lvbiAgICAgICAje3JlcXVpcmUoXCIje19fZGlybmFtZX0vLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259XG5cIlwiXCJcblxuaWYgYXJncy5wYXRoID09ICcuJyBhbmQgYXJncy5zdHJpbmdzLmxlbmd0aFxuICAgIGlmIHNsYXNoLmV4aXN0cyBhcmdzLnN0cmluZ3NbMF1cbiAgICAgICAgaWYgYXJncy5zdHJpbmdzLmxlbmd0aCA+IDEgb3Igc2xhc2guaXNGaWxlIGFyZ3Muc3RyaW5nc1swXVxuICAgICAgICAgICAgYXJncy5wYXRoID0gYXJncy5zdHJpbmdzLnNoaWZ0KClcbiAgICBlbHNlIGlmIHNsYXNoLmV4aXN0cyBhcmdzLnN0cmluZ3NbLTFdXG4gICAgICAgIGFyZ3MucGF0aCA9IGFyZ3Muc3RyaW5ncy5wb3AoKVxuXG5pZiBhcmdzLmRlcHRoID09ICfiiJ4nIHRoZW4gYXJncy5kZXB0aCA9IEluZmluaXR5XG5lbHNlIGFyZ3MuZGVwdGggPSBNYXRoLm1heCAwLCBwYXJzZUludCBhcmdzLmRlcHRoXG5pZiBOdW1iZXIuaXNOYU4gYXJncy5kZXB0aCB0aGVuIGFyZ3MuZGVwdGggPSAwXG4gICAgICAgIFxuYXJncy5wYXRoID0gc2xhc2gucmVzb2x2ZSBhcmdzLnBhdGhcblxuaWYgYXJncy5fX2lnbm9yZWQ/Lmxlbmd0aFxuICAgIGFyZ3Muc3RyaW5ncyA9IGFyZ3Muc3RyaW5ncy5jb25jYXQgYXJncy5fX2lnbm9yZWRcbiAgICBcbmhhc0V4dCA9IFsnY29mZmVlJydub29uJydqc29uJydqcycnbWQnJ2NwcCcncHVnJydzdHlsJ11cbiAgICAubWFwICh0KSAtPiBhcmdzW3RdXG4gICAgLmZpbHRlciAoYikgLT4gYlxuICAgIC5sZW5ndGggPiAwXG4gICAgXG5pZiBub3QgaGFzRXh0IHRoZW4gYXJncy5hbnkgPSB0cnVlXG5cbiMgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwICBcbiMgMDAwICAwMDAgICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICBcbiMgMDAwICAwMDAgIDAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICBcbiMgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwICBcblxuaWdub3JlRmlsZSA9IChwKSAtPlxuICAgIFxuICAgIGJhc2UgPSBzbGFzaC5iYXNlbmFtZSBwXG4gICAgZXh0ICA9IHNsYXNoLmV4dCBwXG4gICAgXG4gICAgaWYgc2xhc2gud2luKClcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgYmFzZVswXSA9PSAnJCdcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgYmFzZSA9PSAnZGVza3RvcC5pbmknXG4gICAgICAgIHJldHVybiB0cnVlIGlmIGJhc2UudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoICdudHVzZXInXG4gICAgXG4gICAgcmV0dXJuIGZhbHNlIGlmIHAgPT0gYXJncy5wYXRoXG4gICAgaWYgYXJncy5leHQgdGhlbiByZXR1cm4gZXh0ICE9IGFyZ3MuZXh0XG4gICAgcmV0dXJuIHRydWUgaWYgYmFzZVswXSA9PSAnLicgYW5kIG5vdCBhcmdzLmRvdFxuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmFueVxuICAgIHJldHVybiBmYWxzZSBpZiBhcmdzLmpzICAgICBhbmQgZXh0ID09ICdqcydcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5qc29uICAgYW5kIGV4dCA9PSAnanNvbidcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5ub29uICAgYW5kIGV4dCA9PSAnbm9vbidcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5tZCAgICAgYW5kIGV4dCA9PSAnbWQnXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MucHVnICAgIGFuZCBleHQgPT0gJ3B1ZydcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5zdHlsICAgYW5kIGV4dCA9PSAnc3R5bCdcbiAgICByZXR1cm4gZmFsc2UgaWYgYXJncy5jcHAgICAgYW5kIGV4dCBpbiBbJ2NwcCcsICdocHAnLCAnaCddXG4gICAgcmV0dXJuIGZhbHNlIGlmIGFyZ3MuY29mZmVlIGFuZCBleHQgaW4gWydrb2ZmZWUnJ2NvZmZlZSddXG4gICAgcmV0dXJuIHRydWVcblxuaWdub3JlRGlyID0gKHApIC0+XG4gICAgXG4gICAgcmV0dXJuIGZhbHNlIGlmIHAgPT0gYXJncy5wYXRoXG4gICAgYmFzZSA9IHNsYXNoLmJhc2VuYW1lIHBcbiAgICBleHQgID0gc2xhc2guZXh0IHBcbiAgICByZXR1cm4gdHJ1ZSBpZiBiYXNlWzBdID09ICcuJ1xuICAgIHJldHVybiB0cnVlIGlmIGJhc2UgPT0gJ25vZGVfbW9kdWxlcydcbiAgICByZXR1cm4gdHJ1ZSBpZiBleHQgID09ICdhcHAnXG4gICAgZmFsc2VcbiAgICAgICAgICAgICAgICBcbiMgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgXG4jIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIFxuIyAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgICAgICAgMDAwMDAwMDAwICBcbiMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgXG4jIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIFxuXG5ORVdMSU5FID0gL1xccj9cXG4vXG5cbnNlYXJjaCA9IChwYXRocywgZGVwdGg9MCkgLT5cbiAgICBcbiAgICBpZiBhcmdzLnN0cmluZ3MubGVuZ3RoXG4gICAgICAgIGlmIGFyZ3MucmVnZXhwXG4gICAgICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwIFwiKFwiICsgYXJncy5zdHJpbmdzLmpvaW4oJ3wnKSArIFwiKVwiLCAnZydcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cCBcIihcIiArIGFyZ3Muc3RyaW5ncy5tYXAoKHMpIC0+IGtzdHIuZXNjYXBlUmVnZXhwKHMpKS5qb2luKCd8JykgKyBcIilcIiwgJ2cnXG4gICAgZWxzZVxuICAgICAgICBkdW1wID0gdHJ1ZVxuICAgICAgICBcbiAgICBwYXRocy5mb3JFYWNoIChwYXRoKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgc2xhc2guaXNEaXIgcGF0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkaXIgPSBzbGFzaC5yZXNvbHZlIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKChhcmdzLnJlY3Vyc2UgYW5kIGRlcHRoIDwgYXJncy5kZXB0aCkgb3IgZGVwdGggPT0gMCkgYW5kIG5vdCBpZ25vcmVEaXIgZGlyXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VhcmNoIGZzLnJlYWRkaXJTeW5jKGRpcikubWFwKChwKSAtPiBzbGFzaC5qb2luIGRpciwgcCksIGRlcHRoKzFcbiAgICAgICAgICAgIFxuICAgICAgICBlbHNlIGlmIHNsYXNoLmlzVGV4dCBwYXRoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbGUgPSBzbGFzaC5yZXNvbHZlIHBhdGhcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IGlnbm9yZUZpbGUgZmlsZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGhlYWRlciA9IGZhbHNlXG4gICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIgPSAtPlxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MuaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWwgPSBzbGFzaC5yZWxhdGl2ZSBmaWxlLCBwcm9jZXNzLmN3ZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cgJydcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBXMSB5NSAnIOKWuCAnICsgZzIgc2xhc2guZGlybmFtZShyZWwpICsgJy8nICsgeTUgc2xhc2guYmFzZShyZWwpICsgeTEgJy4nICsgc2xhc2guZXh0KHJlbCkgKyAnICdcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyAnJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRleHQgID0gc2xhc2gucmVhZFRleHQgZmlsZVxuICAgICAgICAgICAgICAgIGxpbmVzID0gdGV4dC5zcGxpdCBORVdMSU5FXG4gICAgICAgICAgICAgICAgcm5ncyAgPSBrbG9yLmRpc3NlY3QgbGluZXMsIHNsYXNoLmV4dCBmaWxlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIGluZGV4IGluIFswLi4ubGluZXMubGVuZ3RoXVxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICAgICAgICAgICAgICAgIGlmIGxpbmUuc3RhcnRzV2l0aCAnLy8jIHNvdXJjZU1hcHBpbmdVUkwnXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgICAgICBpZiBkdW1wXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludEhlYWRlcigpIGlmIG5vdCBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBybmdzW2luZGV4XSwgaW5kZXgrMSwgW11cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbGluZS5zZWFyY2gocmVnZXhwKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRIZWFkZXIoKSBpZiBub3QgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IGhpZ2hsaWdodFJhbmdlcyBsaW5lLCByZWdleHBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICDilrhhc3NlcnQgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQgPSBzbGljZVJhbmdlcyBybmdzW2luZGV4XSwgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCBzbGljZWQsIGluZGV4KzEsIGhpZ2hsaWdodHNcblxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwMDAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG5oaWdobGlnaHRSYW5nZXMgPSAobGluZSwgcmVnZXhwKSAtPlxuICAgIFxuICAgIHJhbmdlcyA9IFtdXG4gICAgd2hpbGUgbSA9IHJlZ2V4cC5leGVjIGxpbmVcbiAgICAgICAgcmFuZ2VzLnB1c2ggc3RhcnQ6bS5pbmRleCwgZW5kOm0uaW5kZXgrbVswXS5sZW5ndGgtMVxuICAgIHJhbmdlc1xuICAgIFxuc2xpY2VSYW5nZXMgPSAocmFuZ2VzLCBoaWdobGlnaHRzKSAtPlxuXG4gICAgaCA9IDBcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCByYW5nZXMubGVuZ3RoXG4gICAgICAgIHJhbmdlID0gcmFuZ2VzW2ldXG4gICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgcmFuZ2Uuc3RhcnQgPiBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgaCsrXG4gICAgICAgIFxuICAgICAgICBpZiBoID49IGhpZ2hsaWdodHMubGVuZ3RoIHRoZW4gcmV0dXJuIHJhbmdlc1xuXG4gICAgICAgIHNwbGl0ID0gMFxuICAgICAgICBpZiByYW5nZS5zdGFydCA8IGhpZ2hsaWdodHNbaF0uc3RhcnQgPD0gcmFuZ2Uuc3RhcnQrcmFuZ2UubGVuZ3RoXG4gICAgICAgICAgICBzcGxpdCAgPSBoaWdobGlnaHRzW2hdLnN0YXJ0IC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgZWxzZSBpZiByYW5nZS5zdGFydCA8PSBoaWdobGlnaHRzW2hdLmVuZCA8IHJhbmdlLnN0YXJ0K3JhbmdlLmxlbmd0aFxuICAgICAgICAgICAgc3BsaXQgPSBoaWdobGlnaHRzW2hdLmVuZCAtIHJhbmdlLnN0YXJ0ICsgMVxuXG4gICAgICAgIGlmIHNwbGl0XG4gICAgICAgICAgICBiZWZvcmUgPSBPYmplY3QuYXNzaWduIHt9LCByYW5nZVxuICAgICAgICAgICAgYWZ0ZXIgID0gT2JqZWN0LmFzc2lnbiB7fSwgcmFuZ2VcbiAgICAgICAgICAgIGJlZm9yZS5tYXRjaCAgPSByYW5nZS5tYXRjaFsuLi5zcGxpdF1cbiAgICAgICAgICAgIGJlZm9yZS5sZW5ndGggPSBiZWZvcmUubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5tYXRjaCAgID0gcmFuZ2UubWF0Y2hbc3BsaXQuLi5dXG4gICAgICAgICAgICBhZnRlci5sZW5ndGggID0gYWZ0ZXIubWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICBhZnRlci5zdGFydCAgID0gcmFuZ2Uuc3RhcnQgKyBiZWZvcmUubGVuZ3RoXG4gICAgICAgICAgICByYW5nZXMuc3BsaWNlIGksIDEsIGJlZm9yZSwgYWZ0ZXJcbiAgICAgICAgaSsrXG4gICAgcmFuZ2VzXG4gICAgICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgICAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIFxuXG5vdXRwdXQgPSAocm5ncywgbnVtYmVyLCBoaWdobGlnaHRzKSAtPlxuICAgIFxuICAgIGNscnpkID0gJydcbiAgICBcbiAgICBpZiBhcmdzLm51bWJlcnNcbiAgICAgICAgbnVtc3RyID0gU3RyaW5nIG51bWJlclxuICAgICAgICBjbHJ6ZCArPSB3MShudW1zdHIpICsga3N0ci5ycGFkICcnLCA0LW51bXN0ci5sZW5ndGhcbiAgICAgICAgXG4gICAgYyA9IDBcbiAgICBoID0gMFxuICAgIGhpZ2hsaWdodCA9IChzKSAtPlxuICAgICAgICBpZiBoIDwgaGlnaGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGlmIGMgPj0gaGlnaGxpZ2h0c1toXS5zdGFydCBhbmQgYyA8PSBoaWdobGlnaHRzW2hdLmVuZFxuICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnNlIHNcbiAgICAgICAgICAgIHdoaWxlIGggPCBoaWdobGlnaHRzLmxlbmd0aCBhbmQgYyA+IGhpZ2hsaWdodHNbaF0uZW5kXG4gICAgICAgICAgICAgICAgaCsrXG4gICAgICAgIHNcbiAgICBcbiAgICBmb3IgaSBpbiBbMC4uLnJuZ3MubGVuZ3RoXVxuICAgICAgICB3aGlsZSBjIDwgcm5nc1tpXS5zdGFydCBcbiAgICAgICAgICAgIGNscnpkICs9IGhpZ2hsaWdodCAnICdcbiAgICAgICAgICAgIGMrK1xuICAgICAgICBjbHJ6ZCArPSBoaWdobGlnaHQgY29sb3JpemUgcm5nc1tpXVxuICAgICAgICBjICs9IHJuZ3NbaV0ubWF0Y2gubGVuZ3RoXG4gICAgICAgIFxuICAgIGxvZyBjbHJ6ZFxuXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIFxuXG5MSSA9IC8oXFxzbGlcXGRcXHN8XFxzaFxcZFxccykvXG5cbmNvbG9yaXplID0gKGNodW5rKSAtPiBcbiAgICBcbiAgICBpZiBjbiA9IGtvbG9yLm1hcFtjaHVuay52YWx1ZV1cbiAgICAgICAgaWYgY24gaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgICAgdiA9IGNodW5rLm1hdGNoXG4gICAgICAgICAgICBmb3IgYyBpbiBjblxuICAgICAgICAgICAgICAgIHYgPSBrb2xvcltjXSB2XG4gICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4ga29sb3JbY25dIGNodW5rLm1hdGNoXG4gICAgICAgICAgICBcbiAgICBcbiAgICBpZiBjaHVuay5jbHNzLmVuZHNXaXRoICdmaWxlJ1xuICAgICAgICB3OCBjaHVuay5tYXRjaFxuICAgIGVsc2UgaWYgY2h1bmsuY2xzcy5lbmRzV2l0aCAnZXh0J1xuICAgICAgICB3MyBjaHVuay5tYXRjaFxuICAgIGVsc2UgaWYgY2h1bmsuY2xzcy5zdGFydHNXaXRoICdwdW5jdCdcbiAgICAgICAgaWYgTEkudGVzdCBjaHVuay5jbHNzXG4gICAgICAgICAgICBjb2xvcml6ZSBtYXRjaDpjaHVuay5tYXRjaCwgY2xzczpjaHVuay5jbHNzLnJlcGxhY2UgTEksICcgJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIGxvZyBcIj4+PiN7Y2h1bmsuY2xzc308PDwgI3tjaHVuay5tYXRjaH1cIlxuICAgICAgICAgICAgdzIgY2h1bmsubWF0Y2hcbiAgICBlbHNlXG4gICAgICAgIGlmIExJLnRlc3QgY2h1bmsuY2xzc1xuICAgICAgICAgICAgY29sb3JpemUgbWF0Y2g6Y2h1bmsubWF0Y2gsIGNsc3M6Y2h1bmsuY2xzcy5yZXBsYWNlIExJLCAnICdcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBsb2cgXCI+Pj4je2NodW5rLmNsc3N9PDw8ICN7Y2h1bmsubWF0Y2h9XCJcbiAgICAgICAgICAgIGNodW5rLm1hdGNoXG4gICAgXG5pZiBhcmdzLmRlYnVnXG4gICAgbm9vbiA9IHJlcXVpcmUgJ25vb24nXG4gICAgbG9nIG5vb24uc3RyaW5naWZ5IGFyZ3MsIGNvbG9yczp0cnVlXG5cbnNlYXJjaCBbYXJncy5wYXRoXVxubG9nICcnXG4iXX0=
//# sourceURL=../coffee/krep.coffee