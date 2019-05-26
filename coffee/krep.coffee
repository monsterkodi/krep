###
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000      
###

{ slash, karg, klog, kstr, valid, fs, _ } = require 'kxk'

kolor = require './kolor'
klor  = require 'klor'

kolor.globalize()

args = karg """
krep
    strings   . ? text to search for                . **
    path      . ? file or folder to search in       . = |.|
    ext       . ? search only files with extension  . = ||
    coffee    . ? search coffeescript files         . = true
    noon      . ? search noon files                 . = true
    js        . ? search javascript files           . = true
    json      . ? search json files                 . = true  . - J
    header    . ? print file headers                . = true  . - H
    recurse   . ? recurse into subdirs              . = true  . - R
    numbers   . ? prefix with line numbers          . = false . - N
    regexp    . ? strings are regexp patterns       . = false
    dot       . ? search dot files                  . = false
    any       . ? search all text files             . = false
    debug                                           . = false . - D

version       #{require("#{__dirname}/../package.json").version}
"""

if args.path == '.' and args.strings.length
    if slash.exists args.strings[0]
        if args.strings.length > 1 or slash.isFile args.strings[0]
            args.path = args.strings.shift()
    else if slash.exists args.strings[-1]
        args.path = args.strings.pop()
        
args.path = slash.resolve args.path

if valid args.__ignored
    args.strings = args.strings.concat args.__ignored

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

search = (paths) ->
    
    if args.regexp
        regexp = new RegExp "(" + args.strings.join('|') + ")", 'g'
    else
        regexp = new RegExp "(" + args.strings.map((s) -> kstr.escapeRegexp(s)).join('|') + ")", 'g'

    paths.forEach (path) ->
        
        if slash.isDir path
            
            dir = slash.resolve path
            
            if not ignoreDir dir
                
                search fs.readdirSync(dir).map (p) -> slash.join dir, p
            
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
                rngs  = klor.dissect lines, 'coffee'
                
                for index in [0...lines.length]
                    line = lines[index]
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
            before = _.clone range
            after  = _.clone range
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
        clrzd += w1(numstr) + _.pad '', 4-numstr.length
        
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

colorize = (chunk) -> 

    if cn = kolor.map[chunk.value]
        if cn instanceof Array
            v = chunk.match
            for c in cn
                v = kolor[c] v
            return v
        else
            return kolor[cn] chunk.match
    chunk.match
    
klog 'args:' args if args.debug

search [args.path]
