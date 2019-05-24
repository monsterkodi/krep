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
    coffee        . ? search coffeescript files       . = true
    noon          . ? search noon files               . = true
    js            . ? search javascript files         . = true
    json          . ? search json files               . = true  . - J
    recurse       . ? recurse into subdirs            . = true  . - R
    regexp        . ? strings are regexp patterns     . = false
    dot           . ? search dot files                . = false
    any           . ? search all text files           . = false
    debug                                             . = false . - D

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
        return false if args.any
        ext = slash.ext p
        return true if not args.js     and ext == 'js'
        return true if not args.json   and ext == 'json'
        return true if not args.noon   and ext == 'noon'
        return true if not args.coffee and ext in ['koffee''coffee']
    false

ignoreDir = (p) ->
    
    if not args.all
        base = slash.basename p
        return true if base[0] == '.'
        return true if base == 'node_modules'
    false
    
colormap =
    'punct':                            'w3'
    'punct this':                       'b3'
    'punct comment':                    'w1' 
    'punct comment triple':             'w1' 
    'punct regexp start':               'm8' 
    'punct regexp end':                 'm8' 
    'punct regexp':                     'm2'
    'punct regexp triple':              'm2'
    'punct semver':                     'r2' 
    'punct escape regexp':              'm1'
    'punct escape regexp triple':       'm1'
    'punct string single':              'g1' 
    'punct string single triple':       'g1' 
    'punct string double':              'g2' 
    'punct string double triple':       'g2' 
    'punct string interpolation start': 'g1'
    'punct string interpolation end':   'g1'
    'punct dictionary':                 'y8' 
    'punct property':                   'y1' 
    'punct range':                      'b4' 
    'punct method':                     'r2'
    'punct function':                   'r1'
    'punct function tail':              ['b6', 'bold', 'B1']
    'punct function head':              ['b6', 'bold', 'B1']
    'punct function bound tail':        ['r5', 'bold', 'R1']
    'punct function bound head':        ['r5', 'bold', 'R1']
    'punct h1':                         'y1'
    'text h1':                          'y4'
    'punct h2':                         'r1'
    'text h2':                          'r4'
    'punct h3':                         'b3'
    'text h3':                          'b8'
    'punct h4':                         'b2'
    'text h4':                          'b6'
    'punct h5':                         'b1'
    'text h5':                          'b5'
    'string single':                    'g3' 
    'string single triple':             'g3' 
    'string double':                    'g4' 
    'string double triple':             'g4' 
    'nil':                              'm2'
    'obj':                              'y5' 
    'text':                             'w8' 
    'text this':                        'b8' 
    'text regexp':                      'm6'
    'text regexp triple':               'm6'
    'require':                          'w3' 
    'keyword':                          'b8' 
    'number':                           'b7' 
    'number hex':                       'c3' 
    'number float':                     'r7' 
    'punct number float':               'r3' 
    'semver':                           'r5' 
    'module this':                      'y2' 
    'module':                           'y6' 
    'class':                            'y5' 
    'property':                         'y6' 
    'dictionary key':                   'y8' 
    'punct function call':              'r2' 
    'function call this':               'r2' 
    'function call':                    'r5' 
    'function':                         'r4' 
    'method':                           'r6'
    'punct bold':                       'b1'
    'text bold':                        'b7'
    'text code':                        'b8'
    'punct code':                       'b1' 
    'punct code triple':                'b1' 
    'punct meta':                       'g1' 
    'meta':                             'g4' 
    'comment':                          'w3'
    'comment triple':                   'w4'
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
    # log '>>'+chunk.value+'<<'
    chunk.match
    
output = (rngs) ->
    
    c = 0
    clrzd = ''
    for i in [0...rngs.length]
        while c < rngs[i].start 
            c++
            clrzd += ' '
        clrzd += colorize rngs[i]
        c += rngs[i].match.length
    log clrzd
    
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
                        output rngs[index]
            
# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000

klog 'args:' args if args.debug

search [args.path]
