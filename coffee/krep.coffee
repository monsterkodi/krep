###
000   000  00000000   00000000  00000000 
000  000   000   000  000       000   000
0000000    0000000    0000000   00000000 
000  000   000   000  000       000      
000   000  000   000  00000000  000      
###

{ childp, slash, karg, klog, kstr, fs, _ } = require 'kxk'

▸doc 'krep'

    Search for text in files. Similar to `grep` or `ag` but way more colorful 😋
        
    ```coffeescript
    
    npm install -g krep
    
    krep string    # search recursively in the current directory for 'string' in coffee, js, json and noon files
        
    krep string .. # same as above, but in the parent directory
    
    krep .. string # dito
    
    krep -h        # for more options
    ```

kolor = require './kolor'
klor  = require 'klor'

#  0000000   00000000    0000000    0000000
# 000   000  000   000  000        000
# 000000000  0000000    000  0000  0000000
# 000   000  000   000  000   000       000
# 000   000  000   000   0000000   0000000

args = karg """
krep
    strings   . ? text to search for              . **
    path      . ? file or folder to search in     . = |.|
    coffee    . ? search coffeescript files       . = true
    noon      . ? search noon files               . = true
    js        . ? search javascript files         . = true
    json      . ? search json files               . = true  . - J
    header    . ? print file headers              . = true  . - H
    recurse   . ? recurse into subdirs            . = true  . - R
    numbers   . ? prefix with line numbers        . = false . - N
    regexp    . ? strings are regexp patterns     . = false
    dot       . ? search dot files                . = false
    any       . ? search all text files           . = false
    debug                                         . = false . - D

version      #{require("#{__dirname}/../package.json").version}
"""

if args.path == '.' and args.strings.length
    if slash.exists args.strings[0]
        args.path = args.strings.shift()
    else if slash.exists args.strings[-1]
        args.path = args.strings.pop()
        
args.path = slash.resolve args.path

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
    return true if base[0] == '.'
    return true if base == 'node_modules'
    false
                
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
                        output rngs[index], index+1

#  0000000   000   000  000000000  00000000   000   000  000000000  
# 000   000  000   000     000     000   000  000   000     000     
# 000   000  000   000     000     00000000   000   000     000     
# 000   000  000   000     000     000        000   000     000     
#  0000000    0000000      000     000         0000000      000     

output = (rngs, number) ->
    
    c = 0
    clrzd = ''
    if args.numbers
        clrzd += kolor.w2("#{number}") + kolor.w1 ':'
    for i in [0...rngs.length]
        while c < rngs[i].start 
            c++
            clrzd += ' '
        clrzd += colorize rngs[i]
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
    
# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000

klog 'args:' args if args.debug

search [args.path]
