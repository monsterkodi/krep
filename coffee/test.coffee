###
000   000  00000000   00000000  00000000         000000000  00000000   0000000  000000000  
000  000   000   000  000       000   000           000     000       000          000     
0000000    0000000    0000000   00000000            000     0000000   0000000      000     
000  000   000   000  000       000                 000     000            000     000     
000   000  000   000  00000000  000                 000     00000000  0000000      000     
###

chai   = require 'chai'
kstr   = require 'kstr'
slash  = require 'kslash'
childp = require 'child_process'
fs     = require 'fs-extra'
chai.should()
expect = chai.expect

krep = (args) -> kstr.stripAnsi childp.execSync "#{__dirname}/../bin/krep #{args}", encoding:'utf8'

describe 'krep' ->

    it 'works' -> 

        k = krep "chai"
        k.should.include "test.coffee"
        k.should.include "chai   = require 'chai'"
        
    it 'finds' ->
        
        k = krep "noon"
        k.should.include "test.coffee"
        k.should.include "krep.coffee"
        k.should.include "krep.js"
        k.should.include "package.js"
        k.should.include "package.noon"
        
    it 'filters' ->
        
        k = krep "-c noon"
        k.should.include "test.coffee"
        k.should.include "krep.coffee"
        k.should.not.include "krep.js"
        k.should.not.include "package.js"
        k.should.include "package.noon"

        k = krep "-j noon"
        k.should.not.include "test.coffee"
        k.should.not.include "krep.coffee"
        k.should.include "krep.js"
        k.should.include "package.js"

    it 'replaces' ->
        
        slash.writeText 'test.txt' 'a bBb c d'
        krep "-p test.txt bBb --replace xXx"
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql 'a xXx c d'

        slash.writeText 'test.txt' 'a bBb c d'
        krep "-p test.txt bBb --replace \"\""
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql 'a bBb c d'

        slash.writeText 'test.txt' 'a bBb c d'
        krep "-p test.txt bBb --replace"
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql 'a bBb c d'

        slash.writeText 'test.txt' 'a bBbBbBb c d'
        krep "-p test.txt bBb --replace x"
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql 'a xBx c d'
        
    it 'removes' ->
        
        slash.writeText 'test.txt' 'a bBb c d'
        krep "-p test.txt bBb --remove"
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql 'a  c d'

        slash.writeText 'test.txt' 'a bBbBbBb c d'
        krep "-p test.txt bBb --remove"
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql 'a B c d'

    it 'removes lines' ->
        
        slash.writeText 'test.txt' 'a bBb c d'
        krep "-p test.txt bBb --removelines"
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql ''

        slash.writeText 'test.txt' """
            a bBb c
            c d e
            d bBb
            """
        krep "-p test.txt bBb --removelines"
        r = slash.readText 'test.txt'
        fs.removeSync 'test.txt'
        r.should.eql 'c d e'
        