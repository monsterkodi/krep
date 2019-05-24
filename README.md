## krep

Search for text in files. Similar to `grep` or `ag` but way more colorful 😋
    
```coffeescript

npm install -g krep

krep string    # search recursively in the current directory for 'string' in coffee, js, json and noon files
    
krep string .. # same as above, but in the parent directory

krep .. string # dito

krep -h        # for more options
```

### kolor

A merge of [colorette](https://github.com/jorgebucaran/colorette) and [ansi-256-colors](https://github.com/jbnicolai/ansi-256-colors)

It exports a bunch of functions that wrap a string in 256 color ansi codes.

`r g b c m y w` + [1..8] for foreground colors 
`R G B C M Y W` + [1..8] for background colors
    
```coffeescript
log kolor.y8 'bright yellow' + kolor.R1 'on dark red'
```
