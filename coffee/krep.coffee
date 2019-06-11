###
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000      
###

fs    = require 'fs'
slash = require 'kslash'
karg  = require 'karg'
klor  = require 'klor'
kstr  = require 'kstr'

kolor = klor.kolor
kolor.globalize()

args = karg """
krep
    strings   . ? text to search for                . **
    header    . ? print file headers                . = true  . - H
    recurse   . ? recurse into subdirs              . = true  . - R
    depth     . ? recursion depth                   . = ∞     . - D    
    path      . ? file or folder to search in       . = |.|
    ext       . ? search only files with extension  . = ||
    coffee    . ? search only coffeescript files    . = false
    noon      . ? search only noon files            . = false
    styl      . ? search only styl files            . = false . - S
    pug       . ? search only pug files             . = false . - P
    md        . ? search only md files              . = false
    js        . ? search only javascript files      . = false
    cpp       . ? search only cpp files             . = false . - C
    json      . ? search only json files            . = false . - J
    numbers   . ? prefix with line numbers          . = false . - N
    regexp    . ? strings are regexp patterns       . = false
    dot       . ? search dot files                  . = false
    debug                                           . = false . - X

version       #{require("#{__dirname}/../package.json").version}
"""

if args.path == '.' and args.strings.length
    if slash.exists args.strings[0]
        if args.strings.length > 1 or slash.isFile args.strings[0]
            args.path = args.strings.shift()
    else if slash.exists args.strings[-1]
        args.path = args.strings.pop()

if args.depth == '∞' then args.depth = Infinity
else args.depth = Math.max 0, parseInt args.depth
if Number.isNaN args.depth then args.depth = 0
        
args.path = slash.resolve args.path

if args.__ignored?.length
    args.strings = args.strings.concat args.__ignored
    
hasExt = ['coffee''noon''json''js''md''cpp''pug''styl']
    .map (t) -> args[t]
    .filter (b) -> b
    .length > 0
    
if not hasExt then args.any = true

# 000   0000000   000   000   0000000   00000000   00000000  
# 000  000        0000  000  000   000  000   000  000       
# 000  000  0000  000 0 000  000   000  0000000    0000000   
# 000  000   000  000  0000  000   000  000   000  000       
# 000   0000000   000   000   0000000   000   000  00000000  

ignoreFile = (p) ->
    
    base = slash.basename p
    ext  = slash.ext p
    
    if slash.win()
        return true if base[0] == '$'
        return true if base == 'desktop.ini'
        return true if base.toLowerCase().startsWith 'ntuser'
    
    return false if p == args.path
    if args.ext then return ext != args.ext
    return true if base[0] == '.' and not args.dot
    return false if args.any
    return false if args.js     and ext == 'js'
    return false if args.json   and ext == 'json'
    return false if args.noon   and ext == 'noon'
    return false if args.md     and ext == 'md'
    return false if args.pug    and ext == 'pug'
    return false if args.styl   and ext == 'styl'
    return false if args.cpp    and ext in ['cpp', 'hpp', 'h']
    return false if args.coffee and ext in ['koffee''coffee']
    return true

ignoreDir = (p) ->
    
    return false if p == args.path
    base = slash.basename p
    ext  = slash.ext p
    return true if base[0] == '.'
    return true if base == 'node_modules'
    return true if ext  == 'app'
    false
                
#  0000000  00000000   0000000   00000000    0000000  000   000  
# 000       000       000   000  000   000  000       000   000  
# 0000000   0000000   000000000  0000000    000       000000000  
#      000  000       000   000  000   000  000       000   000  
# 0000000   00000000  000   000  000   000   0000000  000   000  

NEWLINE = /\r?\n/

search = (paths, depth=0) ->
    
    if args.strings.length
        if args.regexp
            regexp = new RegExp "(" + args.strings.join('|') + ")", 'g'
        else
            regexp = new RegExp "(" + args.strings.map((s) -> kstr.escapeRegexp(s)).join('|') + ")", 'g'
    else
        dump = true
        
    paths.forEach (path) ->
        
        if slash.isDir path
            
            dir = slash.resolve path
            
            if ((args.recurse and depth < args.depth) or depth == 0) and not ignoreDir dir
                
                search fs.readdirSync(dir).map((p) -> slash.join dir, p), depth+1
            
        else if slash.isText path
            
            file = slash.resolve path
            
            if not ignoreFile file
                
                header = false
                printHeader = ->
                    header = true
                    if args.header
                        rel = slash.relative file, process.cwd()
                        log ''
                        log W1 y5 ' ▸ ' + g2 slash.dirname(rel) + '/' + y5 slash.base(rel) + y1 '.' + slash.ext(rel) + ' '
                        log ''
                
                text  = slash.readText file
                lines = text.split NEWLINE
                rngs  = klor.dissect lines, slash.ext file
                
                for index in [0...lines.length]
                    line = lines[index]
                    if line.startsWith '//# sourceMappingURL'
                        continue
                    if dump
                        printHeader() if not header
                        output rngs[index], index+1, []
                    else
                        if line.search(regexp) >= 0
                            printHeader() if not header
                            highlights = highlightRanges line, regexp
                            ▸assert highlights.length
                            sliced = sliceRanges rngs[index], highlights
                            output sliced, index+1, highlights

# 000   000  000   0000000   000   000  000      000   0000000   000   000  000000000
# 000   000  000  000        000   000  000      000  000        000   000     000   
# 000000000  000  000  0000  000000000  000      000  000  0000  000000000     000   
# 000   000  000  000   000  000   000  000      000  000   000  000   000     000   
# 000   000  000   0000000   000   000  0000000  000   0000000   000   000     000   

highlightRanges = (line, regexp) ->
    
    ranges = []
    while m = regexp.exec line
        ranges.push start:m.index, end:m.index+m[0].length-1
    ranges
    
sliceRanges = (ranges, highlights) ->

    h = 0
    i = 0
    while i < ranges.length
        range = ranges[i]
        while h < highlights.length and range.start > highlights[h].end
            h++
        
        if h >= highlights.length then return ranges

        split = 0
        if range.start < highlights[h].start <= range.start+range.length
            split  = highlights[h].start - range.start
        else if range.start <= highlights[h].end < range.start+range.length
            split = highlights[h].end - range.start + 1

        if split
            before = Object.assign {}, range
            after  = Object.assign {}, range
            before.match  = range.match[...split]
            before.length = before.match.length
            after.match   = range.match[split...]
            after.length  = after.match.length
            after.start   = range.start + before.length
            ranges.splice i, 1, before, after
        i++
    ranges
            
#  0000000   000   000  000000000  00000000   000   000  000000000  
# 000   000  000   000     000     000   000  000   000     000     
# 000   000  000   000     000     00000000   000   000     000     
# 000   000  000   000     000     000        000   000     000     
#  0000000    0000000      000     000         0000000      000     

output = (rngs, number, highlights) ->
    
    clrzd = ''
    
    if args.numbers
        numstr = String number
        clrzd += w1(numstr) + kstr.rpad '', 4-numstr.length
        
    c = 0
    h = 0
    highlight = (s) ->
        if h < highlights.length
            if c >= highlights[h].start and c <= highlights[h].end
                return inverse s
            while h < highlights.length and c > highlights[h].end
                h++
        s
    
    for i in [0...rngs.length]
        while c < rngs[i].start 
            clrzd += highlight ' '
            c++
        clrzd += highlight colorize rngs[i]
        c += rngs[i].match.length
        
    log clrzd

#  0000000   0000000   000       0000000   00000000   000  0000000  00000000  
# 000       000   000  000      000   000  000   000  000     000   000       
# 000       000   000  000      000   000  0000000    000    000    0000000   
# 000       000   000  000      000   000  000   000  000   000     000       
#  0000000   0000000   0000000   0000000   000   000  000  0000000  00000000  

LI = /(\sli\d\s|\sh\d\s)/

colorize = (chunk) -> 
    
    if cn = kolor.map[chunk.value]
        if cn instanceof Array
            v = chunk.match
            for c in cn
                v = kolor[c] v
            return v
        else
            return kolor[cn] chunk.match
            
    
    if chunk.value.endsWith 'file'
        w8 chunk.match
    else if chunk.value.endsWith 'ext'
        w3 chunk.match
    else if chunk.value.startsWith 'punct'
        if LI.test chunk.value
            colorize match:chunk.match, value:chunk.value.replace LI, ' '
        else
            # log ">>>#{chunk.value}<<< #{chunk.match}"
            w2 chunk.match
    else
        if LI.test chunk.value
            colorize match:chunk.match, value:chunk.value.replace LI, ' '
        else
            # log ">>>#{chunk.value}<<< #{chunk.match}"
            chunk.match
    
if args.debug
    noon = require 'noon'
    log noon.stringify args, colors:true

search [args.path]
log ''
