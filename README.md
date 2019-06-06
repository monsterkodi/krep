![krep](bin/krep.png)

Search for text in files. Similar to `grep` or `ag` but *way* more **colorful** 😋

![shot](bin/shot.png)

![usage](bin/usage.png)

```sh
npm install -g krep

krep string    # search recursively in the current directory for 'string'
    
krep string .. # same as above, but in the parent directory

krep .. string # dito

krep file      # prints the whole file

krep -h        # for more options
```
