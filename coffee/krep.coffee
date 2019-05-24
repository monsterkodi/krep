###
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000      
###

{ childp, slash, karg, klog, kstr, fs, _ } = require 'kxk'

klor = require 'klor'
# ansi = require 'ansi-256-colors'

#  0000000   00000000    0000000    0000000
# 000   000  000   000  000        000
# 000000000  0000000    000  0000  0000000
# 000   000  000   000  000   000       000
# 000   000  000   000   0000000   0000000

args = karg """
krep
    strings       . ? text to search for              . **
    path          . ? file or folder to search in     . = |.|
    regexp        . ? strings are regexp patterns     . = false
    coffee        . ? search coffeescript files       . = true
    js            . ? search javascript files         . = false 
    dot           . ? search dot files                . = false
    any           . ? search all text files           . = false
    recurse       . ? recurse into subdirs            . = true  . - R
    debug         . ? debug logs                      . = false . - D

version      #{require("#{__dirname}/../package.json").version}
"""

if args.strings.length > 1 and args.path == '.'
    if slash.exists args.strings[0]
        args.path = args.strings.shift()
    else if slash.exists args.strings[-1]
        args.path = args.strings.pop()

# 000   0000000   000   000   0000000   00000000   00000000  
# 000  000        0000  000  000   000  000   000  000       
# 000  000  0000  000 0 000  000   000  0000000    0000000   
# 000  000   000  000  0000  000   000  000   000  000       
# 000   0000000   000   000   0000000   000   000  00000000  

ignoreFile = (p) ->
    
    base = slash.basename p
    
    if slash.win()
        return true if base[0] == '$'
        return true if base == 'desktop.ini'
        return true if base.toLowerCase().startsWith 'ntuser'
    if not args.all
        return true if base[0] == '.'
    false

ignoreDir = (p) ->
    
    if not args.all
        base = slash.basename p
        return true if base[0] == '.'
        return true if base == 'node_modules'
    false
    
colorize = (chunk) -> chunk.match
    
output = (input) ->
    
    rngs = klor.ranges input, 'coffee'
    c = 0
    line = ''
    for i in [0...rngs.length]
        while c < rngs[i].start 
            c++
            line += ' '
        line += colorize rngs[i]
        c += rngs[i].match.length
    log line
    
#  0000000  00000000   0000000   00000000    0000000  000   000  
# 000       000       000   000  000   000  000       000   000  
# 0000000   0000000   000000000  0000000    000       000000000  
#      000  000       000   000  000   000  000       000   000  
# 0000000   00000000  000   000  000   000   0000000  000   000  

NEWLINE = /\r?\n/
search = (paths) ->
    
    regexp = new RegExp "(" + args.strings.map((s)->kstr.escapeRegexp(s)).join('|') + ")", 'g'

    paths.forEach (path) ->
        
        if slash.isDir path
            
            dir = slash.resolve path
            if not ignoreDir dir
                search fs.readdirSync(dir).map (p) -> slash.join dir, p
            
        else if slash.isText path
            
            file = slash.resolve path
            if not ignoreFile file
                # log 'file', file if args.debug
                text = slash.readText file
                lines = text.split NEWLINE
                for line in lines
                    if line.search(regexp) >= 0
                        output line
            
# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000

klog 'args:' args if args.debug

search [args.path]
