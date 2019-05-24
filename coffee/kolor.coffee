###
000   000   0000000   000       0000000   00000000 
000  000   000   000  000      000   000  000   000
0000000    000   000  000      000   000  0000000  
000  000   000   000  000      000   000  000   000
000   000   0000000   0000000   0000000   000   000
###

▸doc 'kolor'

    A merge of [colorette](https://github.com/jorgebucaran/colorette) and [ansi-256-colors](https://github.com/jbnicolai/ansi-256-colors)
    
    It exports a bunch of functions that wrap a string in 256 color ansi codes.
    
    `r g b c m y w` + [1..8] for foreground colors 
    `R G B C M Y W` + [1..8] for background colors
        
    ```coffeescript
    log kolor.y8 'bright yellow' + kolor.R1 'on dark red'
    ```

exports.map =
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
    'punct function tail':              ['b6' 'bold' 'B1']
    'punct function head':              ['b6' 'bold' 'B1']
    'punct function bound tail':        ['r5' 'bold' 'R1']
    'punct function bound head':        ['r5' 'bold' 'R1']
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
    'comment header':                   ['g1' 'G1']
    'comment triple header':            ['g2' 'G2']

f_ = (r, g, b) -> '\x1b[38;5;' + (16 + 36*r + 6*g + b) + 'm'
b_ = (r, g, b) -> '\x1b[48;5;' + (16 + 36*r + 6*g + b) + 'm'

r = (i=4) -> (i < 6) and f_(i, 0, 0) or f_(  5, i-5, i-5)
R = (i=4) -> (i < 6) and b_(i, 0, 0) or b_(  5, i-5, i-5)
g = (i=4) -> (i < 6) and f_(0, i, 0) or f_(i-5,   5, i-5)
G = (i=4) -> (i < 6) and b_(0, i, 0) or b_(i-5,   5, i-5)
b = (i=4) -> (i < 6) and f_(0, 0, i) or f_(i-5, i-5,   5)
B = (i=4) -> (i < 6) and b_(0, 0, i) or b_(i-5, i-5,   5)
y = (i=4) -> (i < 6) and f_(i, i, 0) or f_(  5,   5, i-5)
Y = (i=4) -> (i < 6) and b_(i, i, 0) or b_(  5,   5, i-5)
m = (i=4) -> (i < 6) and f_(i, 0, i) or f_(  5, i-5,   5)
M = (i=4) -> (i < 6) and b_(i, 0, i) or b_(  5, i-5,   5)
c = (i=4) -> (i < 6) and f_(0, i, i) or f_(i-5,  5,    5)
C = (i=4) -> (i < 6) and b_(0, i, i) or b_(i-5,  5,    5)
w = (i=4) -> '\x1b[38;5;' + (232+i) + 'm'
W = (i=4) -> '\x1b[48;5;' + (232+i) + 'm'

r1 = r 1; R1 = R 1; g1 = g 1; G1 = G 1; b1 = b 1; B1 = B 1
r2 = r 2; R2 = R 2; g2 = g 2; G2 = G 2; b2 = b 2; B2 = B 2
r3 = r 3; R3 = R 3; g3 = g 3; G3 = G 3; b3 = b 3; B3 = B 3
r4 = r 4; R4 = R 4; g4 = g 4; G4 = G 4; b4 = b 4; B4 = B 4
r5 = r 5; R5 = R 5; g5 = g 5; G5 = G 5; b5 = b 5; B5 = B 5
r6 = r 6; R6 = R 6; g6 = g 6; G6 = G 6; b6 = b 6; B6 = B 6
r7 = r 7; R7 = R 7; g7 = g 7; G7 = G 7; b7 = b 7; B7 = B 7
r8 = r 8; R8 = R 8; g8 = g 8; G8 = G 8; b8 = b 8; B8 = B 8

c1 = c 1; C1 = C 1; m1 = m 1; M1 = M 1; y1 = y 1; Y1 = Y 1
c2 = c 2; C2 = C 2; m2 = m 2; M2 = M 2; y2 = y 2; Y2 = Y 2
c3 = c 3; C3 = C 3; m3 = m 3; M3 = M 3; y3 = y 3; Y3 = Y 3
c4 = c 4; C4 = C 4; m4 = m 4; M4 = M 4; y4 = y 4; Y4 = Y 4
c5 = c 5; C5 = C 5; m5 = m 5; M5 = M 5; y5 = y 5; Y5 = Y 5
c6 = c 6; C6 = C 6; m6 = m 6; M6 = M 6; y6 = y 6; Y6 = Y 6
c7 = c 7; C7 = C 7; m7 = m 7; M7 = M 7; y7 = y 7; Y7 = Y 7
c8 = c 8; C8 = C 8; m8 = m 8; M8 = M 8; y8 = y 8; Y8 = Y 8

w1 = w 0*3; W1 = W 0*3+2;
w2 = w 1*3; W2 = W 1*3+2;
w3 = w 2*3; W3 = W 2*3+2;
w4 = w 3*3; W4 = W 3*3+2;
w5 = w 4*3; W5 = W 4*3+2;
w6 = w 5*3; W6 = W 5*3+2;
w7 = w 6*3; W7 = W 6*3+2;
w8 = w 7*3; W8 = W 7*3+2;

FG_COLORS = ['r' 'g' 'b' 'c' 'm' 'y' 'w']
BG_COLORS = ['R' 'M' 'B' 'Y' 'G' 'C' 'W']

rawInit = (open, close, searchRegex, replaceValue) ->
    (s) -> open + (~(s += "").indexOf(close, 4) and s.replace(searchRegex, replaceValue) or s) + close

init = (open, close) -> rawInit "\x1b[#{open}m", "\x1b[#{close}m", new RegExp("\\x1b\\[#{close}m", "g"), "\x1b[#{open}m"

F256 = (open) -> rawInit open, "\x1b[39m", new RegExp("\\x1b\\[39m", "g"), open
B256 = (open) -> rawInit open, "\x1b[49m", new RegExp("\\x1b\\[49m", "g"), open

exports.bold          = rawInit "\x1b[1m" "\x1b[22m", /\x1b\[22m/g, "\x1b[22m\x1b[1m"
exports.dim           = rawInit "\x1b[2m" "\x1b[22m", /\x1b\[22m/g, "\x1b[22m\x1b[2m"
exports.reset         = init 0   0
exports.italic        = init 3   23
exports.underline     = init 4   24
exports.inverse       = init 7   27
exports.hidden        = init 8   28
exports.strikethrough = init 9   29
exports.black         = init 30  39
exports.red           = init 31  39
exports.green         = init 32  39
exports.yellow        = init 33  39
exports.blue          = init 34  39
exports.magenta       = init 35  39
exports.cyan          = init 36  39
exports.white         = init 37  39
exports.gray          = init 90  39

for bg in BG_COLORS
    module.exports[bg] = eval bg
    for bi in [1..8]
        bn = bg+bi
        module.exports[bn] = B256 eval bn

for fg in FG_COLORS
    module.exports[fg] = eval fg
    for i in [1..8]
        module.exports[fg+String(i)] = F256 eval fg+String(i)

if require.main == module

    reset = '\x1b[0m'
    bold  = '\x1b[1m'
                
    for bg in BG_COLORS
        for bi in [1..8]
            s = reset
            bn = bg+bi
            fn = bg.toLowerCase()+bi
            s += module.exports[fn]("#{fn} #{bn} ")
            for fg in FG_COLORS
                fn = fg+"#{9-bi}"
                s += module.exports[bn] module.exports[fn] ' ' + fg + ' '
            log s + reset
            
    log " "
    