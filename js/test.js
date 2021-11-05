// koffee 1.14.0

/*
000   000  00000000   00000000  00000000         000000000  00000000   0000000  000000000  
000  000   000   000  000       000   000           000     000       000          000     
0000000    0000000    0000000   00000000            000     0000000   0000000      000     
000  000   000   000  000       000                 000     000            000     000     
000   000  000   000  00000000  000                 000     00000000  0000000      000
 */
var chai, childp, expect, fs, krep, kstr, slash;

chai = require('chai');

kstr = require('kstr');

slash = require('kslash');

childp = require('child_process');

fs = require('fs-extra');

chai.should();

expect = chai.expect;

krep = function(args) {
    return kstr.stripAnsi(childp.execSync(__dirname + "/../bin/krep " + args, {
        encoding: 'utf8'
    }));
};

describe('krep', function() {
    it('works', function() {
        var k;
        k = krep("chai");
        k.should.include("test.coffee");
        return k.should.include("chai   = require 'chai'");
    });
    it('finds', function() {
        var k;
        k = krep("noon");
        k.should.include("test.coffee");
        k.should.include("krep.coffee");
        k.should.include("krep.js");
        k.should.include("package.js");
        return k.should.include("package.noon");
    });
    it('filters', function() {
        var k;
        k = krep("-c noon");
        k.should.include("test.coffee");
        k.should.include("krep.coffee");
        k.should.not.include("krep.js");
        k.should.not.include("package.js");
        k.should.include("package.noon");
        k = krep("-j noon");
        k.should.not.include("test.coffee");
        k.should.not.include("krep.coffee");
        k.should.include("krep.js");
        return k.should.include("package.js");
    });
    it('replaces', function() {
        var r;
        slash.writeText('test.txt', 'a bBb c d');
        krep("-p test.txt bBb --replace xXx");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        r.should.eql('a xXx c d');
        slash.writeText('test.txt', 'a bBb c d');
        krep("-p test.txt bBb --replace \"\"");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        r.should.eql('a bBb c d');
        slash.writeText('test.txt', 'a bBb c d');
        krep("-p test.txt bBb --replace");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        r.should.eql('a bBb c d');
        slash.writeText('test.txt', 'a bBbBbBb c d');
        krep("-p test.txt bBb --replace x");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        return r.should.eql('a xBx c d');
    });
    it('removes', function() {
        var r;
        slash.writeText('test.txt', 'a bBb c d');
        krep("-p test.txt bBb --remove");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        r.should.eql('a  c d');
        slash.writeText('test.txt', 'a bBbBbBb c d');
        krep("-p test.txt bBb --remove");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        return r.should.eql('a B c d');
    });
    return it('removes lines', function() {
        var r;
        slash.writeText('test.txt', 'a bBb c d');
        krep("-p test.txt bBb --removelines");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        r.should.eql('');
        slash.writeText('test.txt', "a bBb c\nc d e\nd bBb");
        krep("-p test.txt bBb --removelines");
        r = slash.readText('test.txt');
        fs.removeSync('test.txt');
        return r.should.eql('c d e');
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbInRlc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLElBQUEsR0FBUyxPQUFBLENBQVEsTUFBUjs7QUFDVCxJQUFBLEdBQVMsT0FBQSxDQUFRLE1BQVI7O0FBQ1QsS0FBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztBQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7QUFDVCxFQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBQ1QsSUFBSSxDQUFDLE1BQUwsQ0FBQTs7QUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDOztBQUVkLElBQUEsR0FBTyxTQUFDLElBQUQ7V0FBVSxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQU0sQ0FBQyxRQUFQLENBQW1CLFNBQUQsR0FBVyxlQUFYLEdBQTBCLElBQTVDLEVBQW9EO1FBQUEsUUFBQSxFQUFTLE1BQVQ7S0FBcEQsQ0FBZjtBQUFWOztBQUVQLFFBQUEsQ0FBUyxNQUFULEVBQWdCLFNBQUE7SUFFWixFQUFBLENBQUcsT0FBSCxFQUFXLFNBQUE7QUFFUCxZQUFBO1FBQUEsQ0FBQSxHQUFJLElBQUEsQ0FBSyxNQUFMO1FBQ0osQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFULENBQWlCLGFBQWpCO2VBQ0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFULENBQWlCLHlCQUFqQjtJQUpPLENBQVg7SUFNQSxFQUFBLENBQUcsT0FBSCxFQUFXLFNBQUE7QUFFUCxZQUFBO1FBQUEsQ0FBQSxHQUFJLElBQUEsQ0FBSyxNQUFMO1FBQ0osQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFULENBQWlCLGFBQWpCO1FBQ0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFULENBQWlCLGFBQWpCO1FBQ0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFULENBQWlCLFNBQWpCO1FBQ0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFULENB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QU4sQ0FBZ0IsVUFBaEIsRUFBMkIsV0FBM0I7UUFDQSxJQUFBLENBQUssK0JBQUw7UUFDQSxDQUFBLEdBQUksS0FBSyxDQUFDLFFBQU4sQ0FBZSxVQUFmO1FBQ0osRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkO1FBQ0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFULENBQWEsRUFBYjtRQUVBLEtBQUssQ0FBQyxTQUFOLENBQWdCLFVBQWhCLEVBQTJCLHVCQUEzQjtRQUtBLElBQUEsQ0FBSywrQkFBTDtRQUNBLENBQUEsR0FBSSxLQUFLLENBQUMsUUFBTixDQUFlLFVBQWY7UUFDSixFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQ7ZUFDQSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQVQsQ0FBYSxPQUFiO0lBaEJlLENBQW5CO0FBeEVZLENBQWhCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwICAgICAgICAgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgXG4wMDAgIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgXG4wMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgIDAwMCAgICAgXG4wMDAgIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgICAgICAgICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwMDAwMCAgICAgIDAwMCAgICAgXG4jIyNcblxuY2hhaSAgID0gcmVxdWlyZSAnY2hhaSdcbmtzdHIgICA9IHJlcXVpcmUgJ2tzdHInXG5zbGFzaCAgPSByZXF1aXJlICdrc2xhc2gnXG5jaGlsZHAgPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuZnMgICAgID0gcmVxdWlyZSAnZnMtZXh0cmEnXG5jaGFpLnNob3VsZCgpXG5leHBlY3QgPSBjaGFpLmV4cGVjdFxuXG5rcmVwID0gKGFyZ3MpIC0+IGtzdHIuc3RyaXBBbnNpIGNoaWxkcC5leGVjU3luYyBcIiN7X19kaXJuYW1lfS8uLi9iaW4va3JlcCAje2FyZ3N9XCIsIGVuY29kaW5nOid1dGY4J1xuXG5kZXNjcmliZSAna3JlcCcgLT5cblxuICAgIGl0ICd3b3JrcycgLT4gXG5cbiAgICAgICAgayA9IGtyZXAgXCJjaGFpXCJcbiAgICAgICAgay5zaG91bGQuaW5jbHVkZSBcInRlc3QuY29mZmVlXCJcbiAgICAgICAgay5zaG91bGQuaW5jbHVkZSBcImNoYWkgICA9IHJlcXVpcmUgJ2NoYWknXCJcbiAgICAgICAgXG4gICAgaXQgJ2ZpbmRzJyAtPlxuICAgICAgICBcbiAgICAgICAgayA9IGtyZXAgXCJub29uXCJcbiAgICAgICAgay5zaG91bGQuaW5jbHVkZSBcInRlc3QuY29mZmVlXCJcbiAgICAgICAgay5zaG91bGQuaW5jbHVkZSBcImtyZXAuY29mZmVlXCJcbiAgICAgICAgay5zaG91bGQuaW5jbHVkZSBcImtyZXAuanNcIlxuICAgICAgICBrLnNob3VsZC5pbmNsdWRlIFwicGFja2FnZS5qc1wiXG4gICAgICAgIGsuc2hvdWxkLmluY2x1ZGUgXCJwYWNrYWdlLm5vb25cIlxuICAgICAgICBcbiAgICBpdCAnZmlsdGVycycgLT5cbiAgICAgICAgXG4gICAgICAgIGsgPSBrcmVwIFwiLWMgbm9vblwiXG4gICAgICAgIGsuc2hvdWxkLmluY2x1ZGUgXCJ0ZXN0LmNvZmZlZVwiXG4gICAgICAgIGsuc2hvdWxkLmluY2x1ZGUgXCJrcmVwLmNvZmZlZVwiXG4gICAgICAgIGsuc2hvdWxkLm5vdC5pbmNsdWRlIFwia3JlcC5qc1wiXG4gICAgICAgIGsuc2hvdWxkLm5vdC5pbmNsdWRlIFwicGFja2FnZS5qc1wiXG4gICAgICAgIGsuc2hvdWxkLmluY2x1ZGUgXCJwYWNrYWdlLm5vb25cIlxuXG4gICAgICAgIGsgPSBrcmVwIFwiLWogbm9vblwiXG4gICAgICAgIGsuc2hvdWxkLm5vdC5pbmNsdWRlIFwidGVzdC5jb2ZmZWVcIlxuICAgICAgICBrLnNob3VsZC5ub3QuaW5jbHVkZSBcImtyZXAuY29mZmVlXCJcbiAgICAgICAgay5zaG91bGQuaW5jbHVkZSBcImtyZXAuanNcIlxuICAgICAgICBrLnNob3VsZC5pbmNsdWRlIFwicGFja2FnZS5qc1wiXG5cbiAgICBpdCAncmVwbGFjZXMnIC0+XG4gICAgICAgIFxuICAgICAgICBzbGFzaC53cml0ZVRleHQgJ3Rlc3QudHh0JyAnYSBiQmIgYyBkJ1xuICAgICAgICBrcmVwIFwiLXAgdGVzdC50eHQgYkJiIC0tcmVwbGFjZSB4WHhcIlxuICAgICAgICByID0gc2xhc2gucmVhZFRleHQgJ3Rlc3QudHh0J1xuICAgICAgICBmcy5yZW1vdmVTeW5jICd0ZXN0LnR4dCdcbiAgICAgICAgci5zaG91bGQuZXFsICdhIHhYeCBjIGQnXG5cbiAgICAgICAgc2xhc2gud3JpdGVUZXh0ICd0ZXN0LnR4dCcgJ2EgYkJiIGMgZCdcbiAgICAgICAga3JlcCBcIi1wIHRlc3QudHh0IGJCYiAtLXJlcGxhY2UgXFxcIlxcXCJcIlxuICAgICAgICByID0gc2xhc2gucmVhZFRleHQgJ3Rlc3QudHh0J1xuICAgICAgICBmcy5yZW1vdmVTeW5jICd0ZXN0LnR4dCdcbiAgICAgICAgci5zaG91bGQuZXFsICdhIGJCYiBjIGQnXG5cbiAgICAgICAgc2xhc2gud3JpdGVUZXh0ICd0ZXN0LnR4dCcgJ2EgYkJiIGMgZCdcbiAgICAgICAga3JlcCBcIi1wIHRlc3QudHh0IGJCYiAtLXJlcGxhY2VcIlxuICAgICAgICByID0gc2xhc2gucmVhZFRleHQgJ3Rlc3QudHh0J1xuICAgICAgICBmcy5yZW1vdmVTeW5jICd0ZXN0LnR4dCdcbiAgICAgICAgci5zaG91bGQuZXFsICdhIGJCYiBjIGQnXG5cbiAgICAgICAgc2xhc2gud3JpdGVUZXh0ICd0ZXN0LnR4dCcgJ2EgYkJiQmJCYiBjIGQnXG4gICAgICAgIGtyZXAgXCItcCB0ZXN0LnR4dCBiQmIgLS1yZXBsYWNlIHhcIlxuICAgICAgICByID0gc2xhc2gucmVhZFRleHQgJ3Rlc3QudHh0J1xuICAgICAgICBmcy5yZW1vdmVTeW5jICd0ZXN0LnR4dCdcbiAgICAgICAgci5zaG91bGQuZXFsICdhIHhCeCBjIGQnXG4gICAgICAgIFxuICAgIGl0ICdyZW1vdmVzJyAtPlxuICAgICAgICBcbiAgICAgICAgc2xhc2gud3JpdGVUZXh0ICd0ZXN0LnR4dCcgJ2EgYkJiIGMgZCdcbiAgICAgICAga3JlcCBcIi1wIHRlc3QudHh0IGJCYiAtLXJlbW92ZVwiXG4gICAgICAgIHIgPSBzbGFzaC5yZWFkVGV4dCAndGVzdC50eHQnXG4gICAgICAgIGZzLnJlbW92ZVN5bmMgJ3Rlc3QudHh0J1xuICAgICAgICByLnNob3VsZC5lcWwgJ2EgIGMgZCdcblxuICAgICAgICBzbGFzaC53cml0ZVRleHQgJ3Rlc3QudHh0JyAnYSBiQmJCYkJiIGMgZCdcbiAgICAgICAga3JlcCBcIi1wIHRlc3QudHh0IGJCYiAtLXJlbW92ZVwiXG4gICAgICAgIHIgPSBzbGFzaC5yZWFkVGV4dCAndGVzdC50eHQnXG4gICAgICAgIGZzLnJlbW92ZVN5bmMgJ3Rlc3QudHh0J1xuICAgICAgICByLnNob3VsZC5lcWwgJ2EgQiBjIGQnXG5cbiAgICBpdCAncmVtb3ZlcyBsaW5lcycgLT5cbiAgICAgICAgXG4gICAgICAgIHNsYXNoLndyaXRlVGV4dCAndGVzdC50eHQnICdhIGJCYiBjIGQnXG4gICAgICAgIGtyZXAgXCItcCB0ZXN0LnR4dCBiQmIgLS1yZW1vdmVsaW5lc1wiXG4gICAgICAgIHIgPSBzbGFzaC5yZWFkVGV4dCAndGVzdC50eHQnXG4gICAgICAgIGZzLnJlbW92ZVN5bmMgJ3Rlc3QudHh0J1xuICAgICAgICByLnNob3VsZC5lcWwgJydcblxuICAgICAgICBzbGFzaC53cml0ZVRleHQgJ3Rlc3QudHh0JyBcIlwiXCJcbiAgICAgICAgICAgIGEgYkJiIGNcbiAgICAgICAgICAgIGMgZCBlXG4gICAgICAgICAgICBkIGJCYlxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIGtyZXAgXCItcCB0ZXN0LnR4dCBiQmIgLS1yZW1vdmVsaW5lc1wiXG4gICAgICAgIHIgPSBzbGFzaC5yZWFkVGV4dCAndGVzdC50eHQnXG4gICAgICAgIGZzLnJlbW92ZVN5bmMgJ3Rlc3QudHh0J1xuICAgICAgICByLnNob3VsZC5lcWwgJ2MgZCBlJ1xuICAgICAgICAiXX0=
//# sourceURL=../coffee/test.coffee