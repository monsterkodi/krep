// monsterkodi/kode 0.250.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var childp, fs, krep, kstr, r, slash

kstr = require('kstr')
slash = require('kslash')
childp = require('child_process')
fs = slash.fs

krep = function (args)
{
    return kstr.stripAnsi(childp.execSync(`${__dirname}/../bin/krep ${args}`,{encoding:'utf8'}))
}
module.exports["krep"] = function ()
{
    section("works", function ()
    {
        compare(krep("slash"),function (a)
        {
            return _k_.in("test.kode",a) && _k_.in("slash  = require 'kslash'",a)
        })
    })
    section("finds", function ()
    {
        compare(krep("noon"),function (a)
        {
            return _k_.in(" ▸ kode/test.kode \n",a) && _k_.in(" ▸ kode/krep.kode \n",a) && _k_.in(" ▸ js/krep.js \n",a) && _k_.in(" ▸ ./package.json \n",a) && _k_.in(" ▸ ./package.noon \n",a)
        })
    })
    section("filters", function ()
    {
        compare(krep("-k noon"),function (a)
        {
            return _k_.in(" ▸ kode/test.kode \n",a) && _k_.in(" ▸ kode/krep.kode \n",a) && !(_k_.in(` ▸ js/krep.js ${'\n'}`,a)) && !(_k_.in(` ▸ ./package.json ${'\n'}`,a)) && !(_k_.in(` ▸ ./package.noon ${'\n'}`,a))
        })
        compare(krep("-j noon"),function (a)
        {
            return !(_k_.in(` ▸ kode/test.kode ${'\n'}`,a)) && !(_k_.in(` ▸ kode/krep.kode ${'\n'}`,a)) && _k_.in(" ▸ js/krep.js \n",a) && _k_.in(" ▸ js/test.js \n",a)
        })
    })
    section("replaces", function ()
    {
        slash.writeText('test.txt','a bBb c d')
        krep("-p test.txt bBb --replace xXx")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'a xXx c d')
        slash.writeText('test.txt','a bBb c d')
        krep("-p test.txt bBb --replace \"\"")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'a bBb c d')
        slash.writeText('test.txt','a bBb c d')
        krep("-p test.txt bBb --replace")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'a bBb c d')
        slash.writeText('test.txt','a bBbBbBb c d')
        krep("-p test.txt bBb --replace x")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'a xBx c d')
    })
    section("removes", function ()
    {
        slash.writeText('test.txt','a bBb c d')
        krep("-p test.txt bBb --remove")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'a  c d')
        slash.writeText('test.txt','a bBbBbBb c d')
        krep("-p test.txt bBb --remove")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'a B c d')
    })
    section("removes lines", function ()
    {
        slash.writeText('test.txt','a bBb c d')
        krep("-p test.txt bBb --removelines")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'')
        slash.writeText('test.txt',`a bBb c
c d e
d bBb`)
        krep("-p test.txt bBb --removelines")
        r = slash.readText('test.txt')
        fs.removeSync('test.txt')
        compare(r,'c d e')
    })
}
module.exports["krep"]._section_ = true
module.exports._test_ = true
module.exports
