###
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000      
###

{ childp, slash, karg, klog, kstr, fs, _ } = require 'kxk'

kolor = require './kolor'
klor  = require 'klor'

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
    
colormap =
    'punct':                            'w3'
    'punct comment':                    'w2' 
    'punct comment triple':             'w2' 
    'punct regexp start':               'm8' 
    'punct regexp end':                 'm8' 
    'punct regexp':                     'm2'
    'punct semver':                     'r2' 
    'punct escape regexp':              'm1'
    'punct string single':              'g1' 
    'punct string double':              'g2' 
    'punct string double triple':       'g2' 
    'punct string interpolation start': 'g1'
    'punct string interpolation end':   'g1'
    'punct dictionary':                 'y8' 
    'punct property':                   'y1' 
    'punct range':                      'b4' 
    'punct function':                   'r1'
    'punct function tail':              'b4'
    'punct function head':              'b4'
    'string single':                    'g4' 
    'string double':                    'g6' 
    'string double triple':             'g6' 
    'nil':                              'm2'
    'obj':                              'y5' 
    'text':                             'w8' 
    'text regexp':                      'm6'
    'require':                          'w3' 
    'keyword':                          'b8' 
    'number':                           'b7' 
    'semver':                           'r5' 
    'module':                           'y6' 
    'property':                         'y6' 
    'dictionary key':                   'y8' 
    'function call':                    'r5' 
    'function':                         'r4' 
    'comment':                          'w3'
    'comment header':                   ['g1', 'G1']
    'comment triple header':            ['g2', 'G2']
    
colorize = (chunk) -> 

    if cn = colormap[chunk.value]
        if cn instanceof Array
            v = chunk.match
            for c in cn
                v = kolor[c] v
            return v
        else
            return kolor[cn] chunk.match
    log '>>'+chunk.value+'<<'
    chunk.match
    
output = (input, rngs) ->
    
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
                text = slash.readText file
                lines = text.split NEWLINE
                
                rngs = klor.dissect lines, 'coffee'
                
                for index in [0...lines.length]
                    line = lines[index]
                    if line.search(regexp) >= 0
                        output line, rngs[index]
            
# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000

klog 'args:' args if args.debug

search [args.path]
