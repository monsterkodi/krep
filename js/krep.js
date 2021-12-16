// monsterkodi/kode 0.130.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return (l != null ? typeof l.length === 'number' ? l : [] : [])}}

var fs, slash, karg, klor, kstr, tty, kolor, args, _70_17_, hasExt, ignoreFile, ignoreDir, NEWLINE, regexp, dump, search, highlightRanges, sliceRanges, output, LI, colorize, noon, pipeType

fs = require('fs')
slash = require('kslash')
karg = require('karg')
klor = require('klor')
kstr = require('kstr')
tty = require('tty')
kolor = klor.kolor
args = karg(`krep
    strings      . ? text to search for                 . **
    header       . ? print file headers                 . = true  . - H
    recurse      . ? recurse into subdirs               . = true  . - R
    depth        . ? recursion depth                    . = ∞     . - D    
    path         . ? file or folder to search in        . = |.|
    ext          . ? search only files with extension   . = ||
    kode         . ? search only kode files             . = false
    coffee       . ? search only coffeescript files     . = false
    js           . ? search only javascript files       . = false
    noon         . ? search only noon files             . = false
    styl         . ? search only styl files             . = false . - S
    pug          . ? search only pug files              . = false . - P
    md           . ? search only md files               . = false
    cpp          . ? search only cpp files              . = false . - C
    json         . ? search only json files             . = false . - J
    numbers      . ? prefix with line numbers           . = false . - N
    regexp       . ? strings are regexp patterns        . = false
    dot          . ? search dot files                   . = false
    stdin        . ? read from stdin                    . = false . - i
    color        . ? colorize output                    . = true  . - -
    replace      . ? 🔥replace matches                              . - -
    remove       . ? 🔥remove matches                     . = false . - -
    removelines  . ? 🔥remove lines containing matches    . = false . - -
    debug                                                 . = false . - X

version       ${require(`${__dirname}/../package.json`).version}`)
kolor.globalize(args.color)
if (args.replace && (args.remove || args.removelines) || args.remove && args.removelines)
{
    console.error(R4(y5(" 🔥💥 multiple replace options provided! won't replace anything! 💥🔥")))
    delete args.replace
    delete args.remove
    delete args.removelines
}
if (args.path === '.' && args.strings.length)
{
    if (slash.exists(args.strings[0]))
    {
        if (args.strings.length > 1 || slash.isFile(args.strings[0]))
        {
            args.path = args.strings.shift()
        }
    }
    else if (slash.exists(args.strings.slice(-1)[0]))
    {
        args.path = args.strings.pop()
    }
}
if (args.depth === '∞')
{
    args.depth = Infinity
}
else
{
    args.depth = Math.max(0,parseInt(args.depth))
}
if (Number.isNaN(args.depth))
{
    args.depth = 0
}
args.path = slash.resolve(args.path)
if ((args.__ignored != null ? args.__ignored.length : undefined))
{
    args.strings = args.strings.concat(args.__ignored)
}
hasExt = ['kode','coffee','noon','json','js','md','cpp','pug','styl'].map(function (t)
{
    return args[t]
}).filter(function (b)
{
    return b
}).length > 0
if (!hasExt)
{
    args.any = true
}

ignoreFile = function (p)
{
    var base, ext

    base = slash.basename(p)
    ext = slash.ext(p)
    if (slash.win())
    {
        if (base[0] === '$')
        {
            return true
        }
        if (base === 'desktop.ini')
        {
            return true
        }
        if (base.toLowerCase().startsWith('ntuser'))
        {
            return true
        }
    }
    if (p === args.path)
    {
        return false
    }
    if (args.ext)
    {
        return ext !== args.ext
    }
    if (base[0] === '.' && !args.dot)
    {
        return true
    }
    if (args.any)
    {
        return false
    }
    if (args.js && ext === 'js')
    {
        return false
    }
    if (args.json && ext === 'json')
    {
        return false
    }
    if (args.noon && ext === 'noon')
    {
        return false
    }
    if (args.md && ext === 'md')
    {
        return false
    }
    if (args.pug && ext === 'pug')
    {
        return false
    }
    if (args.styl && ext === 'styl')
    {
        return false
    }
    if (args.kode && ext === 'kode')
    {
        return false
    }
    if (args.cpp && _k_.in(ext,['cpp','hpp','h']))
    {
        return false
    }
    if (args.coffee && _k_.in(ext,['koffee','coffee']))
    {
        return false
    }
    return true
}

ignoreDir = function (p)
{
    var base, ext

    if (p === args.path)
    {
        return false
    }
    base = slash.basename(p)
    ext = slash.ext(p)
    if (base[0] === '.')
    {
        return true
    }
    if (base === 'node_modules')
    {
        return true
    }
    if (ext === 'app')
    {
        return true
    }
    return false
}
NEWLINE = /\r?\n/
if (args.strings.length)
{
    if (args.regexp)
    {
        regexp = new RegExp("(" + args.strings.join('|') + ")",'g')
    }
    else
    {
        regexp = new RegExp("(" + args.strings.map(function (s)
        {
            return kstr.escapeRegexp(s)
        }).join('|') + ")",'g')
    }
}
else
{
    dump = true
}

search = function (paths, depth = 0)
{
    return paths.forEach(function (path)
    {
        var dir, file, header, printHeader, text, lines, rngs, index, line, highlights, sliced, replaceWith, newLines

        if (slash.isDir(path))
        {
            dir = slash.resolve(path)
            if (((args.recurse && depth < args.depth) || depth === 0) && !ignoreDir(dir))
            {
                return search(fs.readdirSync(dir).map(function (p)
                {
                    return slash.join(dir,p)
                }),depth + 1)
            }
        }
        else if (slash.isText(path))
        {
            file = slash.resolve(path)
            if (!ignoreFile(file))
            {
                header = false
                printHeader = function ()
                {
                    var rel

                    header = true
                    if (args.header)
                    {
                        rel = slash.relative(file,process.cwd())
                        console.log('')
                        console.log(W1(y5(' ▸ ' + g2(slash.dirname(rel) + '/' + y5(slash.base(rel) + y1('.' + slash.ext(rel) + ' '))))))
                        console.log('')
                    }
                }
                text = slash.readText(file)
                lines = text.split(NEWLINE)
                rngs = klor.dissect(lines,slash.ext(file))
                for (index = 0; index < lines.length; index++)
                {
                    line = lines[index]
                    if (line.startsWith('//# sourceMappingURL'))
                    {
                        continue
                    }
                    if (dump)
                    {
                        if (!header)
                        {
                            printHeader()
                        }
                        output(rngs[index],index + 1,[])
                    }
                    else
                    {
                        if (line.search(regexp) >= 0)
                        {
                            if (!header)
                            {
                                printHeader()
                            }
                            highlights = highlightRanges(line,regexp)
                            sliced = sliceRanges(rngs[index],highlights)
                            output(sliced,index + 1,highlights)
                            if (args.replace || args.remove)
                            {
                                if (!line.startsWith('//# sourceMappingURL'))
                                {
                                    replaceWith = args.remove ? '' : args.replace
                                    console.log(line.replace(regexp,replaceWith))
                                }
                            }
                        }
                    }
                }
                if (regexp && !dump)
                {
                    if (args.replace || args.remove)
                    {
                        for (index = 0; index < lines.length; index++)
                        {
                            line = lines[index]
                            if (line.startsWith('//# sourceMappingURL'))
                            {
                                continue
                            }
                            replaceWith = args.remove ? '' : args.replace
                            lines[index] = line.replace(regexp,replaceWith)
                        }
                        return slash.writeText(file,lines.join('\n'))
                    }
                    else if (args.removelines)
                    {
                        newLines = []
                        for (index = 0; index < lines.length; index++)
                        {
                            line = lines[index]
                            if (line.startsWith('//# sourceMappingURL'))
                            {
                                newLines.push(line)
                                continue
                            }
                            if (line.search(regexp) >= 0)
                            {
                                continue
                            }
                            newLines.push(line)
                        }
                        return slash.writeText(file,newLines.join('\n'))
                    }
                }
            }
        }
    })
}

highlightRanges = function (line, regexp)
{
    var ranges, m

    ranges = []
    while (m = regexp.exec(line))
    {
        ranges.push({start:m.index,end:m.index + m[0].length - 1})
    }
    return ranges
}

sliceRanges = function (ranges, highlights)
{
    var h, i, range, split, before, after

    h = 0
    i = 0
    while (i < ranges.length)
    {
        range = ranges[i]
        while (h < highlights.length && range.start > highlights[h].end)
        {
            h++
        }
        if (h >= highlights.length)
        {
            return ranges
        }
        split = 0
        if ((range.start < highlights[h].start && highlights[h].start <= range.start + range.length))
        {
            split = highlights[h].start - range.start
        }
        else if ((range.start <= highlights[h].end && highlights[h].end < range.start + range.length))
        {
            split = highlights[h].end - range.start + 1
        }
        if (split)
        {
            before = Object.assign({},range)
            after = Object.assign({},range)
            before.match = range.match.slice(0, typeof split === 'number' ? split : -1)
            before.length = before.match.length
            after.match = range.match.slice(split)
            after.length = after.match.length
            after.start = range.start + before.length
            ranges.splice(i,1,before,after)
        }
        i++
    }
    return ranges
}

output = function (rngs, number, highlights)
{
    var clrzd, numstr, c, h, highlight, i

    clrzd = ''
    if (args.numbers)
    {
        numstr = String(number)
        clrzd += w2(numstr) + kstr.rpad('',4 - numstr.length)
    }
    c = 0
    h = 0
    highlight = function (s)
    {
        if (h < highlights.length)
        {
            if (c >= highlights[h].start && c <= highlights[h].end)
            {
                return inverse(s)
            }
            while (h < highlights.length && c > highlights[h].end)
            {
                h++
            }
        }
        return s
    }
    for (i = 0; i < rngs.length; i++)
    {
        while (c < rngs[i].start)
        {
            clrzd += highlight(' ')
            c++
        }
        clrzd += highlight(colorize(rngs[i]))
        c += rngs[i].match.length
    }
    console.log(clrzd)
}
LI = /(\sli\d\s|\sh\d\s)/

colorize = function (chunk)
{
    var cn, v, c

    if (cn = kolor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = chunk.match
            var list = _k_.list(cn)
            for (var _295_18_ = 0; _295_18_ < list.length; _295_18_++)
            {
                c = list[_295_18_]
                v = global[c](v)
            }
            return v
        }
        else
        {
            return global[cn](chunk.match)
        }
    }
    if (chunk.clss.endsWith('file'))
    {
        return w8(chunk.match)
    }
    else if (chunk.clss.endsWith('ext'))
    {
        return w3(chunk.match)
    }
    else if (chunk.clss.startsWith('punct'))
    {
        if (LI.test(chunk.clss))
        {
            return colorize({match:chunk.match,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return w2(chunk.match)
        }
    }
    else
    {
        if (LI.test(chunk.clss))
        {
            return colorize({match:chunk.match,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return chunk.match
        }
    }
}
if (args.debug)
{
    noon = require('noon')
    console.log(noon.stringify(args,{colors:true}))
}
if (!args.stdin)
{
    search([args.path])
    process.exit(0)
}
pipeType = null
process.stdin.on('readable',function ()
{
    var text, _341_34_, lines, rngs, index, line, highlights, sliced

    if (!pipeType)
    {
        if (args.coffee)
        {
            pipeType = 'coffee'
        }
        else if (args.kode)
        {
            pipeType = 'kode'
        }
        else if (args.noon)
        {
            pipeType = 'noon'
        }
        else if (args.json)
        {
            pipeType = 'json'
        }
        else if (args.cpp)
        {
            pipeType = 'cpp'
        }
        else if (args.js)
        {
            pipeType = 'js'
        }
        else
        {
            pipeType = 'txt'
        }
    }
    if (text = (process.stdin.read() != null ? process.stdin.read().toString('utf8') : undefined))
    {
        lines = text.split(NEWLINE)
        rngs = klor.dissect(lines,pipeType)
        for (index = 0; index < lines.length; index++)
        {
            line = lines[index]
            if (line.startsWith('//# sourceMappingURL'))
            {
                continue
            }
            if (dump)
            {
                output(rngs[index],index + 1,[])
            }
            else
            {
                if (line.search(regexp) >= 0)
                {
                    highlights = highlightRanges(line,regexp)
                    sliced = sliceRanges(rngs[index],highlights)
                    output(sliced,index + 1,highlights)
                }
            }
        }
    }
})
process.stdin.on('end',function ()
{})