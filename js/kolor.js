// koffee 0.45.0

/*
000   000   0000000   000       0000000   00000000 
000  000   000   000  000      000   000  000   000
0000000    000   000  000      000   000  0000000  
000  000   000   000  000      000   000  000   000
000   000   0000000   0000000   0000000   000   000
 */
var B, B1, B2, B256, B3, B4, B5, B6, B7, B8, BG_COLORS, C, C1, C2, C3, C4, C5, C6, C7, C8, F256, FG_COLORS, G, G1, G2, G3, G4, G5, G6, G7, G8, M, M1, M2, M3, M4, M5, M6, M7, M8, R, R1, R2, R3, R4, R5, R6, R7, R8, W, W1, W2, W3, W4, W5, W6, W7, W8, Y, Y1, Y2, Y3, Y4, Y5, Y6, Y7, Y8, b, b1, b2, b3, b4, b5, b6, b7, b8, b_, bg, bi, bn, bold, c, c1, c2, c3, c4, c5, c6, c7, c8, f_, fg, fn, g, g1, g2, g3, g4, g5, g6, g7, g8, i, init, j, k, l, len, len1, len2, len3, m, m1, m2, m3, m4, m5, m6, m7, m8, n, o, p, q, r, r1, r2, r3, r4, r5, r6, r7, r8, rawInit, reset, s, w, w1, w2, w3, w4, w5, w6, w7, w8, y, y1, y2, y3, y4, y5, y6, y7, y8;

f_ = function(r, g, b) {
    return '\x1b[38;5;' + (16 + 36 * r + 6 * g + b) + 'm';
};

b_ = function(r, g, b) {
    return '\x1b[48;5;' + (16 + 36 * r + 6 * g + b) + 'm';
};

r = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && f_(i, 0, 0) || f_(5, i - 5, i - 5);
};

R = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && b_(i, 0, 0) || b_(5, i - 5, i - 5);
};

g = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && f_(0, i, 0) || f_(i - 5, 5, i - 5);
};

G = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && b_(0, i, 0) || b_(i - 5, 5, i - 5);
};

b = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && f_(0, 0, i) || f_(i - 5, i - 5, 5);
};

B = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && b_(0, 0, i) || b_(i - 5, i - 5, 5);
};

y = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && f_(i, i, 0) || f_(5, 5, i - 5);
};

Y = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && b_(i, i, 0) || b_(5, 5, i - 5);
};

m = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && f_(i, 0, i) || f_(5, i - 5, 5);
};

M = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && b_(i, 0, i) || b_(5, i - 5, 5);
};

c = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && f_(0, i, i) || f_(i - 5, 5, 5);
};

C = function(i) {
    if (i == null) {
        i = 4;
    }
    return (i < 6) && b_(0, i, i) || b_(i - 5, 5, 5);
};

w = function(i) {
    if (i == null) {
        i = 4;
    }
    return '\x1b[38;5;' + (232 + i) + 'm';
};

W = function(i) {
    if (i == null) {
        i = 4;
    }
    return '\x1b[48;5;' + (232 + i) + 'm';
};

r1 = r(1);

R1 = R(1);

g1 = g(1);

G1 = G(1);

b1 = b(1);

B1 = B(1);

r2 = r(2);

R2 = R(2);

g2 = g(2);

G2 = G(2);

b2 = b(2);

B2 = B(2);

r3 = r(3);

R3 = R(3);

g3 = g(3);

G3 = G(3);

b3 = b(3);

B3 = B(3);

r4 = r(4);

R4 = R(4);

g4 = g(4);

G4 = G(4);

b4 = b(4);

B4 = B(4);

r5 = r(5);

R5 = R(5);

g5 = g(5);

G5 = G(5);

b5 = b(5);

B5 = B(5);

r6 = r(6);

R6 = R(6);

g6 = g(6);

G6 = G(6);

b6 = b(6);

B6 = B(6);

r7 = r(7);

R7 = R(7);

g7 = g(7);

G7 = G(7);

b7 = b(7);

B7 = B(7);

r8 = r(8);

R8 = R(8);

g8 = g(8);

G8 = G(8);

b8 = b(8);

B8 = B(8);

c1 = c(1);

C1 = C(1);

m1 = m(1);

M1 = M(1);

y1 = y(1);

Y1 = Y(1);

c2 = c(2);

C2 = C(2);

m2 = m(2);

M2 = M(2);

y2 = y(2);

Y2 = Y(2);

c3 = c(3);

C3 = C(3);

m3 = m(3);

M3 = M(3);

y3 = y(3);

Y3 = Y(3);

c4 = c(4);

C4 = C(4);

m4 = m(4);

M4 = M(4);

y4 = y(4);

Y4 = Y(4);

c5 = c(5);

C5 = C(5);

m5 = m(5);

M5 = M(5);

y5 = y(5);

Y5 = Y(5);

c6 = c(6);

C6 = C(6);

m6 = m(6);

M6 = M(6);

y6 = y(6);

Y6 = Y(6);

c7 = c(7);

C7 = C(7);

m7 = m(7);

M7 = M(7);

y7 = y(7);

Y7 = Y(7);

c8 = c(8);

C8 = C(8);

m8 = m(8);

M8 = M(8);

y8 = y(8);

Y8 = Y(8);

w1 = w(0 * 3);

W1 = W(0 * 3 + 2);

w2 = w(1 * 3);

W2 = W(1 * 3 + 2);

w3 = w(2 * 3);

W3 = W(2 * 3 + 2);

w4 = w(3 * 3);

W4 = W(3 * 3 + 2);

w5 = w(4 * 3);

W5 = W(4 * 3 + 2);

w6 = w(5 * 3);

W6 = W(5 * 3 + 2);

w7 = w(6 * 3);

W7 = W(6 * 3 + 2);

w8 = w(7 * 3);

W8 = W(7 * 3 + 2);

FG_COLORS = ['r', 'g', 'b', 'c', 'm', 'y', 'w'];

BG_COLORS = ['R', 'M', 'B', 'Y', 'G', 'C', 'W'];

rawInit = function(open, close, searchRegex, replaceValue) {
    return function(s) {
        return open + (~(s += "").indexOf(close, 4) && s.replace(searchRegex, replaceValue) || s) + close;
    };
};

init = function(open, close) {
    return rawInit("\x1b[" + open + "m", "\x1b[" + close + "m", new RegExp("\\x1b\\[" + close + "m", "g"), "\x1b[" + open + "m");
};

F256 = function(open) {
    return rawInit(open, "\x1b[39m", new RegExp("\\x1b\\[39m", "g"), open);
};

B256 = function(open) {
    return rawInit(open, "\x1b[49m", new RegExp("\\x1b\\[49m", "g"), open);
};

exports.bold = rawInit("\x1b[1m", "\x1b[22m", /\x1b\[22m/g, "\x1b[22m\x1b[1m");

exports.dim = rawInit("\x1b[2m", "\x1b[22m", /\x1b\[22m/g, "\x1b[22m\x1b[2m");

exports.reset = init(0, 0);

exports.italic = init(3, 23);

exports.underline = init(4, 24);

exports.inverse = init(7, 27);

exports.hidden = init(8, 28);

exports.strikethrough = init(9, 29);

exports.black = init(30, 39);

exports.red = init(31, 39);

exports.green = init(32, 39);

exports.yellow = init(33, 39);

exports.blue = init(34, 39);

exports.magenta = init(35, 39);

exports.cyan = init(36, 39);

exports.white = init(37, 39);

exports.gray = init(90, 39);

for (j = 0, len = BG_COLORS.length; j < len; j++) {
    bg = BG_COLORS[j];
    module.exports[bg] = eval(bg);
    for (bi = k = 1; k <= 8; bi = ++k) {
        bn = bg + bi;
        module.exports[bn] = B256(eval(bn));
    }
}

for (l = 0, len1 = FG_COLORS.length; l < len1; l++) {
    fg = FG_COLORS[l];
    module.exports[fg] = eval(fg);
    for (i = n = 1; n <= 8; i = ++n) {
        module.exports[fg + String(i)] = F256(eval(fg + String(i)));
    }
}

if (require.main === module) {
    reset = '\x1b[0m';
    bold = '\x1b[1m';
    for (o = 0, len2 = BG_COLORS.length; o < len2; o++) {
        bg = BG_COLORS[o];
        for (bi = p = 1; p <= 8; bi = ++p) {
            s = reset;
            bn = bg + bi;
            fn = bg.toLowerCase() + bi;
            s += module.exports[fn](fn + " " + bn + " ");
            for (q = 0, len3 = FG_COLORS.length; q < len3; q++) {
                fg = FG_COLORS[q];
                fn = fg + ("" + (9 - bi));
                s += module.exports[bn](module.exports[fn](' ' + fg + ' '));
            }
            console.log(s + reset);
        }
    }
    console.log(" ");
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29sb3IuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBOztBQVFBLEVBQUEsR0FBSyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtXQUFhLFlBQUEsR0FBZSxDQUFDLEVBQUEsR0FBSyxFQUFBLEdBQUcsQ0FBUixHQUFZLENBQUEsR0FBRSxDQUFkLEdBQWtCLENBQW5CLENBQWYsR0FBdUM7QUFBcEQ7O0FBQ0wsRUFBQSxHQUFLLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO1dBQWEsWUFBQSxHQUFlLENBQUMsRUFBQSxHQUFLLEVBQUEsR0FBRyxDQUFSLEdBQVksQ0FBQSxHQUFFLENBQWQsR0FBa0IsQ0FBbkIsQ0FBZixHQUF1QztBQUFwRDs7QUFFTCxDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBSyxDQUFMLEVBQVEsQ0FBQSxHQUFFLENBQVYsRUFBYSxDQUFBLEdBQUUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBSyxDQUFMLEVBQVEsQ0FBQSxHQUFFLENBQVYsRUFBYSxDQUFBLEdBQUUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBRyxDQUFBLEdBQUUsQ0FBTCxFQUFVLENBQVYsRUFBYSxDQUFBLEdBQUUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBRyxDQUFBLEdBQUUsQ0FBTCxFQUFVLENBQVYsRUFBYSxDQUFBLEdBQUUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBRyxDQUFBLEdBQUUsQ0FBTCxFQUFRLENBQUEsR0FBRSxDQUFWLEVBQWUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBRyxDQUFBLEdBQUUsQ0FBTCxFQUFRLENBQUEsR0FBRSxDQUFWLEVBQWUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBSyxDQUFMLEVBQVUsQ0FBVixFQUFhLENBQUEsR0FBRSxDQUFmO0FBQXBDOztBQUNKLENBQUEsR0FBSSxTQUFDLENBQUQ7O1FBQUMsSUFBRTs7V0FBTSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsSUFBWSxFQUFBLENBQUcsQ0FBSCxFQUFNLENBQU4sRUFBUyxDQUFULENBQVosSUFBMkIsRUFBQSxDQUFLLENBQUwsRUFBVSxDQUFWLEVBQWEsQ0FBQSxHQUFFLENBQWY7QUFBcEM7O0FBQ0osQ0FBQSxHQUFJLFNBQUMsQ0FBRDs7UUFBQyxJQUFFOztXQUFNLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxJQUFZLEVBQUEsQ0FBRyxDQUFILEVBQU0sQ0FBTixFQUFTLENBQVQsQ0FBWixJQUEyQixFQUFBLENBQUssQ0FBTCxFQUFRLENBQUEsR0FBRSxDQUFWLEVBQWUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLElBQVksRUFBQSxDQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaLElBQTJCLEVBQUEsQ0FBSyxDQUFMLEVBQVEsQ0FBQSxHQUFFLENBQVYsRUFBZSxDQUFmO0FBQXBDOztBQUNKLENBQUEsR0FBSSxTQUFDLENBQUQ7O1FBQUMsSUFBRTs7V0FBTSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsSUFBWSxFQUFBLENBQUcsQ0FBSCxFQUFNLENBQU4sRUFBUyxDQUFULENBQVosSUFBMkIsRUFBQSxDQUFHLENBQUEsR0FBRSxDQUFMLEVBQVMsQ0FBVCxFQUFlLENBQWY7QUFBcEM7O0FBQ0osQ0FBQSxHQUFJLFNBQUMsQ0FBRDs7UUFBQyxJQUFFOztXQUFNLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxJQUFZLEVBQUEsQ0FBRyxDQUFILEVBQU0sQ0FBTixFQUFTLENBQVQsQ0FBWixJQUEyQixFQUFBLENBQUcsQ0FBQSxHQUFFLENBQUwsRUFBUyxDQUFULEVBQWUsQ0FBZjtBQUFwQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sWUFBQSxHQUFlLENBQUMsR0FBQSxHQUFJLENBQUwsQ0FBZixHQUF5QjtBQUFsQzs7QUFDSixDQUFBLEdBQUksU0FBQyxDQUFEOztRQUFDLElBQUU7O1dBQU0sWUFBQSxHQUFlLENBQUMsR0FBQSxHQUFJLENBQUwsQ0FBZixHQUF5QjtBQUFsQzs7QUFFSixFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFDdkQsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQ3ZELEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUN2RCxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFDdkQsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQ3ZELEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUN2RCxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFDdkQsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBRXZELEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUN2RCxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFDdkQsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQ3ZELEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUN2RCxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFDdkQsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQ3ZELEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUN2RCxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFBSyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUY7O0FBQUssRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFGOztBQUFLLEVBQUEsR0FBSyxDQUFBLENBQUUsQ0FBRjs7QUFFdkQsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFDakIsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFDakIsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFDakIsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFDakIsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFDakIsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFDakIsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFDakIsRUFBQSxHQUFLLENBQUEsQ0FBRSxDQUFBLEdBQUUsQ0FBSjs7QUFBTyxFQUFBLEdBQUssQ0FBQSxDQUFFLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBTjs7QUFFakIsU0FBQSxHQUFZLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEdBQTFCLEVBQStCLEdBQS9COztBQUNaLFNBQUEsR0FBWSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixHQUExQixFQUErQixHQUEvQjs7QUFFWixPQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLFdBQWQsRUFBMkIsWUFBM0I7V0FDTixTQUFDLENBQUQ7ZUFBTyxJQUFBLEdBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQSxJQUFLLEVBQU4sQ0FBUyxDQUFDLE9BQVYsQ0FBa0IsS0FBbEIsRUFBeUIsQ0FBekIsQ0FBRCxJQUFpQyxDQUFDLENBQUMsT0FBRixDQUFVLFdBQVYsRUFBdUIsWUFBdkIsQ0FBakMsSUFBeUUsQ0FBMUUsQ0FBUCxHQUFzRjtJQUE3RjtBQURNOztBQUdWLElBQUEsR0FBTyxTQUFDLElBQUQsRUFBTyxLQUFQO1dBQWlCLE9BQUEsQ0FBUSxPQUFBLEdBQVEsSUFBUixHQUFhLEdBQXJCLEVBQXlCLE9BQUEsR0FBUSxLQUFSLEdBQWMsR0FBdkMsRUFBMkMsSUFBSSxNQUFKLENBQVcsVUFBQSxHQUFXLEtBQVgsR0FBaUIsR0FBNUIsRUFBZ0MsR0FBaEMsQ0FBM0MsRUFBaUYsT0FBQSxHQUFRLElBQVIsR0FBYSxHQUE5RjtBQUFqQjs7QUFFUCxJQUFBLEdBQU8sU0FBQyxJQUFEO1dBQVUsT0FBQSxDQUFRLElBQVIsRUFBYyxVQUFkLEVBQTBCLElBQUksTUFBSixDQUFXLGFBQVgsRUFBMEIsR0FBMUIsQ0FBMUIsRUFBMEQsSUFBMUQ7QUFBVjs7QUFDUCxJQUFBLEdBQU8sU0FBQyxJQUFEO1dBQVUsT0FBQSxDQUFRLElBQVIsRUFBYyxVQUFkLEVBQTBCLElBQUksTUFBSixDQUFXLGFBQVgsRUFBMEIsR0FBMUIsQ0FBMUIsRUFBMEQsSUFBMUQ7QUFBVjs7QUFFUCxPQUFPLENBQUMsSUFBUixHQUF3QixPQUFBLENBQVEsU0FBUixFQUFrQixVQUFsQixFQUE4QixZQUE5QixFQUE0QyxpQkFBNUM7O0FBQ3hCLE9BQU8sQ0FBQyxHQUFSLEdBQXdCLE9BQUEsQ0FBUSxTQUFSLEVBQWtCLFVBQWxCLEVBQThCLFlBQTlCLEVBQTRDLGlCQUE1Qzs7QUFDeEIsT0FBTyxDQUFDLEtBQVIsR0FBd0IsSUFBQSxDQUFLLENBQUwsRUFBUyxDQUFUOztBQUN4QixPQUFPLENBQUMsTUFBUixHQUF3QixJQUFBLENBQUssQ0FBTCxFQUFTLEVBQVQ7O0FBQ3hCLE9BQU8sQ0FBQyxTQUFSLEdBQXdCLElBQUEsQ0FBSyxDQUFMLEVBQVMsRUFBVDs7QUFDeEIsT0FBTyxDQUFDLE9BQVIsR0FBd0IsSUFBQSxDQUFLLENBQUwsRUFBUyxFQUFUOztBQUN4QixPQUFPLENBQUMsTUFBUixHQUF3QixJQUFBLENBQUssQ0FBTCxFQUFTLEVBQVQ7O0FBQ3hCLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLElBQUEsQ0FBSyxDQUFMLEVBQVMsRUFBVDs7QUFDeEIsT0FBTyxDQUFDLEtBQVIsR0FBd0IsSUFBQSxDQUFLLEVBQUwsRUFBUyxFQUFUOztBQUN4QixPQUFPLENBQUMsR0FBUixHQUF3QixJQUFBLENBQUssRUFBTCxFQUFTLEVBQVQ7O0FBQ3hCLE9BQU8sQ0FBQyxLQUFSLEdBQXdCLElBQUEsQ0FBSyxFQUFMLEVBQVMsRUFBVDs7QUFDeEIsT0FBTyxDQUFDLE1BQVIsR0FBd0IsSUFBQSxDQUFLLEVBQUwsRUFBUyxFQUFUOztBQUN4QixPQUFPLENBQUMsSUFBUixHQUF3QixJQUFBLENBQUssRUFBTCxFQUFTLEVBQVQ7O0FBQ3hCLE9BQU8sQ0FBQyxPQUFSLEdBQXdCLElBQUEsQ0FBSyxFQUFMLEVBQVMsRUFBVDs7QUFDeEIsT0FBTyxDQUFDLElBQVIsR0FBd0IsSUFBQSxDQUFLLEVBQUwsRUFBUyxFQUFUOztBQUN4QixPQUFPLENBQUMsS0FBUixHQUF3QixJQUFBLENBQUssRUFBTCxFQUFTLEVBQVQ7O0FBQ3hCLE9BQU8sQ0FBQyxJQUFSLEdBQXdCLElBQUEsQ0FBSyxFQUFMLEVBQVMsRUFBVDs7QUFFeEIsS0FBQSwyQ0FBQTs7SUFDSSxNQUFNLENBQUMsT0FBUSxDQUFBLEVBQUEsQ0FBZixHQUFxQixJQUFBLENBQUssRUFBTDtBQUNyQixTQUFVLDRCQUFWO1FBQ0ksRUFBQSxHQUFLLEVBQUEsR0FBRztRQUNSLE1BQU0sQ0FBQyxPQUFRLENBQUEsRUFBQSxDQUFmLEdBQXFCLElBQUEsQ0FBSyxJQUFBLENBQUssRUFBTCxDQUFMO0FBRnpCO0FBRko7O0FBTUEsS0FBQSw2Q0FBQTs7SUFDSSxNQUFNLENBQUMsT0FBUSxDQUFBLEVBQUEsQ0FBZixHQUFxQixJQUFBLENBQUssRUFBTDtBQUNyQixTQUFTLDBCQUFUO1FBQ0ksTUFBTSxDQUFDLE9BQVEsQ0FBQSxFQUFBLEdBQUcsTUFBQSxDQUFPLENBQVAsQ0FBSCxDQUFmLEdBQStCLElBQUEsQ0FBSyxJQUFBLENBQUssRUFBQSxHQUFHLE1BQUEsQ0FBTyxDQUFQLENBQVIsQ0FBTDtBQURuQztBQUZKOztBQUtBLElBQUcsT0FBTyxDQUFDLElBQVIsS0FBZ0IsTUFBbkI7SUFFSSxLQUFBLEdBQVE7SUFDUixJQUFBLEdBQVE7QUFFUixTQUFBLDZDQUFBOztBQUNJLGFBQVUsNEJBQVY7WUFDSSxDQUFBLEdBQUk7WUFDSixFQUFBLEdBQUssRUFBQSxHQUFHO1lBQ1IsRUFBQSxHQUFLLEVBQUUsQ0FBQyxXQUFILENBQUEsQ0FBQSxHQUFpQjtZQUN0QixDQUFBLElBQUssTUFBTSxDQUFDLE9BQVEsQ0FBQSxFQUFBLENBQWYsQ0FBc0IsRUFBRCxHQUFJLEdBQUosR0FBTyxFQUFQLEdBQVUsR0FBL0I7QUFDTCxpQkFBQSw2Q0FBQTs7Z0JBQ0ksRUFBQSxHQUFLLEVBQUEsR0FBRyxDQUFBLEVBQUEsR0FBRSxDQUFDLENBQUEsR0FBRSxFQUFILENBQUY7Z0JBQ1IsQ0FBQSxJQUFLLE1BQU0sQ0FBQyxPQUFRLENBQUEsRUFBQSxDQUFmLENBQW1CLE1BQU0sQ0FBQyxPQUFRLENBQUEsRUFBQSxDQUFmLENBQW1CLEdBQUEsR0FBTSxFQUFOLEdBQVcsR0FBOUIsQ0FBbkI7QUFGVDtZQUdBLE9BQUEsQ0FBQSxHQUFBLENBQUksQ0FBQSxHQUFJLEtBQVI7QUFSSjtBQURKO0lBV0EsT0FBQSxDQUFBLEdBQUEsQ0FBSSxHQUFKLEVBaEJKIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuMDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgXG4wMDAgIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyMjXG5cbmZfID0gKHIsIGcsIGIpIC0+ICdcXHgxYlszODs1OycgKyAoMTYgKyAzNipyICsgNipnICsgYikgKyAnbSdcbmJfID0gKHIsIGcsIGIpIC0+ICdcXHgxYls0ODs1OycgKyAoMTYgKyAzNipyICsgNipnICsgYikgKyAnbSdcblxuciA9IChpPTQpIC0+IChpIDwgNikgYW5kIGZfKGksIDAsIDApIG9yIGZfKCAgNSwgaS01LCBpLTUpXG5SID0gKGk9NCkgLT4gKGkgPCA2KSBhbmQgYl8oaSwgMCwgMCkgb3IgYl8oICA1LCBpLTUsIGktNSlcbmcgPSAoaT00KSAtPiAoaSA8IDYpIGFuZCBmXygwLCBpLCAwKSBvciBmXyhpLTUsICAgNSwgaS01KVxuRyA9IChpPTQpIC0+IChpIDwgNikgYW5kIGJfKDAsIGksIDApIG9yIGJfKGktNSwgICA1LCBpLTUpXG5iID0gKGk9NCkgLT4gKGkgPCA2KSBhbmQgZl8oMCwgMCwgaSkgb3IgZl8oaS01LCBpLTUsICAgNSlcbkIgPSAoaT00KSAtPiAoaSA8IDYpIGFuZCBiXygwLCAwLCBpKSBvciBiXyhpLTUsIGktNSwgICA1KVxueSA9IChpPTQpIC0+IChpIDwgNikgYW5kIGZfKGksIGksIDApIG9yIGZfKCAgNSwgICA1LCBpLTUpXG5ZID0gKGk9NCkgLT4gKGkgPCA2KSBhbmQgYl8oaSwgaSwgMCkgb3IgYl8oICA1LCAgIDUsIGktNSlcbm0gPSAoaT00KSAtPiAoaSA8IDYpIGFuZCBmXyhpLCAwLCBpKSBvciBmXyggIDUsIGktNSwgICA1KVxuTSA9IChpPTQpIC0+IChpIDwgNikgYW5kIGJfKGksIDAsIGkpIG9yIGJfKCAgNSwgaS01LCAgIDUpXG5jID0gKGk9NCkgLT4gKGkgPCA2KSBhbmQgZl8oMCwgaSwgaSkgb3IgZl8oaS01LCAgNSwgICAgNSlcbkMgPSAoaT00KSAtPiAoaSA8IDYpIGFuZCBiXygwLCBpLCBpKSBvciBiXyhpLTUsICA1LCAgICA1KVxudyA9IChpPTQpIC0+ICdcXHgxYlszODs1OycgKyAoMjMyK2kpICsgJ20nXG5XID0gKGk9NCkgLT4gJ1xceDFiWzQ4OzU7JyArICgyMzIraSkgKyAnbSdcblxucjEgPSByIDE7IFIxID0gUiAxOyBnMSA9IGcgMTsgRzEgPSBHIDE7IGIxID0gYiAxOyBCMSA9IEIgMVxucjIgPSByIDI7IFIyID0gUiAyOyBnMiA9IGcgMjsgRzIgPSBHIDI7IGIyID0gYiAyOyBCMiA9IEIgMlxucjMgPSByIDM7IFIzID0gUiAzOyBnMyA9IGcgMzsgRzMgPSBHIDM7IGIzID0gYiAzOyBCMyA9IEIgM1xucjQgPSByIDQ7IFI0ID0gUiA0OyBnNCA9IGcgNDsgRzQgPSBHIDQ7IGI0ID0gYiA0OyBCNCA9IEIgNFxucjUgPSByIDU7IFI1ID0gUiA1OyBnNSA9IGcgNTsgRzUgPSBHIDU7IGI1ID0gYiA1OyBCNSA9IEIgNVxucjYgPSByIDY7IFI2ID0gUiA2OyBnNiA9IGcgNjsgRzYgPSBHIDY7IGI2ID0gYiA2OyBCNiA9IEIgNlxucjcgPSByIDc7IFI3ID0gUiA3OyBnNyA9IGcgNzsgRzcgPSBHIDc7IGI3ID0gYiA3OyBCNyA9IEIgN1xucjggPSByIDg7IFI4ID0gUiA4OyBnOCA9IGcgODsgRzggPSBHIDg7IGI4ID0gYiA4OyBCOCA9IEIgOFxuXG5jMSA9IGMgMTsgQzEgPSBDIDE7IG0xID0gbSAxOyBNMSA9IE0gMTsgeTEgPSB5IDE7IFkxID0gWSAxXG5jMiA9IGMgMjsgQzIgPSBDIDI7IG0yID0gbSAyOyBNMiA9IE0gMjsgeTIgPSB5IDI7IFkyID0gWSAyXG5jMyA9IGMgMzsgQzMgPSBDIDM7IG0zID0gbSAzOyBNMyA9IE0gMzsgeTMgPSB5IDM7IFkzID0gWSAzXG5jNCA9IGMgNDsgQzQgPSBDIDQ7IG00ID0gbSA0OyBNNCA9IE0gNDsgeTQgPSB5IDQ7IFk0ID0gWSA0XG5jNSA9IGMgNTsgQzUgPSBDIDU7IG01ID0gbSA1OyBNNSA9IE0gNTsgeTUgPSB5IDU7IFk1ID0gWSA1XG5jNiA9IGMgNjsgQzYgPSBDIDY7IG02ID0gbSA2OyBNNiA9IE0gNjsgeTYgPSB5IDY7IFk2ID0gWSA2XG5jNyA9IGMgNzsgQzcgPSBDIDc7IG03ID0gbSA3OyBNNyA9IE0gNzsgeTcgPSB5IDc7IFk3ID0gWSA3XG5jOCA9IGMgODsgQzggPSBDIDg7IG04ID0gbSA4OyBNOCA9IE0gODsgeTggPSB5IDg7IFk4ID0gWSA4XG5cbncxID0gdyAwKjM7IFcxID0gVyAwKjMrMjtcbncyID0gdyAxKjM7IFcyID0gVyAxKjMrMjtcbnczID0gdyAyKjM7IFczID0gVyAyKjMrMjtcbnc0ID0gdyAzKjM7IFc0ID0gVyAzKjMrMjtcbnc1ID0gdyA0KjM7IFc1ID0gVyA0KjMrMjtcbnc2ID0gdyA1KjM7IFc2ID0gVyA1KjMrMjtcbnc3ID0gdyA2KjM7IFc3ID0gVyA2KjMrMjtcbnc4ID0gdyA3KjM7IFc4ID0gVyA3KjMrMjtcblxuRkdfQ09MT1JTID0gWydyJywgJ2cnLCAnYicsICdjJywgJ20nLCAneScsICd3J11cbkJHX0NPTE9SUyA9IFsnUicsICdNJywgJ0InLCAnWScsICdHJywgJ0MnLCAnVyddXG5cbnJhd0luaXQgPSAob3BlbiwgY2xvc2UsIHNlYXJjaFJlZ2V4LCByZXBsYWNlVmFsdWUpIC0+XG4gICAgKHMpIC0+IG9wZW4gKyAofihzICs9IFwiXCIpLmluZGV4T2YoY2xvc2UsIDQpIGFuZCBzLnJlcGxhY2Uoc2VhcmNoUmVnZXgsIHJlcGxhY2VWYWx1ZSkgb3IgcykgKyBjbG9zZVxuXG5pbml0ID0gKG9wZW4sIGNsb3NlKSAtPiByYXdJbml0IFwiXFx4MWJbI3tvcGVufW1cIiwgXCJcXHgxYlsje2Nsb3NlfW1cIiwgbmV3IFJlZ0V4cChcIlxcXFx4MWJcXFxcWyN7Y2xvc2V9bVwiLCBcImdcIiksIFwiXFx4MWJbI3tvcGVufW1cIlxuXG5GMjU2ID0gKG9wZW4pIC0+IHJhd0luaXQgb3BlbiwgXCJcXHgxYlszOW1cIiwgbmV3IFJlZ0V4cChcIlxcXFx4MWJcXFxcWzM5bVwiLCBcImdcIiksIG9wZW5cbkIyNTYgPSAob3BlbikgLT4gcmF3SW5pdCBvcGVuLCBcIlxceDFiWzQ5bVwiLCBuZXcgUmVnRXhwKFwiXFxcXHgxYlxcXFxbNDltXCIsIFwiZ1wiKSwgb3BlblxuXG5leHBvcnRzLmJvbGQgICAgICAgICAgPSByYXdJbml0IFwiXFx4MWJbMW1cIiBcIlxceDFiWzIybVwiLCAvXFx4MWJcXFsyMm0vZywgXCJcXHgxYlsyMm1cXHgxYlsxbVwiXG5leHBvcnRzLmRpbSAgICAgICAgICAgPSByYXdJbml0IFwiXFx4MWJbMm1cIiBcIlxceDFiWzIybVwiLCAvXFx4MWJcXFsyMm0vZywgXCJcXHgxYlsyMm1cXHgxYlsybVwiXG5leHBvcnRzLnJlc2V0ICAgICAgICAgPSBpbml0IDAgICAwXG5leHBvcnRzLml0YWxpYyAgICAgICAgPSBpbml0IDMgICAyM1xuZXhwb3J0cy51bmRlcmxpbmUgICAgID0gaW5pdCA0ICAgMjRcbmV4cG9ydHMuaW52ZXJzZSAgICAgICA9IGluaXQgNyAgIDI3XG5leHBvcnRzLmhpZGRlbiAgICAgICAgPSBpbml0IDggICAyOFxuZXhwb3J0cy5zdHJpa2V0aHJvdWdoID0gaW5pdCA5ICAgMjlcbmV4cG9ydHMuYmxhY2sgICAgICAgICA9IGluaXQgMzAgIDM5XG5leHBvcnRzLnJlZCAgICAgICAgICAgPSBpbml0IDMxICAzOVxuZXhwb3J0cy5ncmVlbiAgICAgICAgID0gaW5pdCAzMiAgMzlcbmV4cG9ydHMueWVsbG93ICAgICAgICA9IGluaXQgMzMgIDM5XG5leHBvcnRzLmJsdWUgICAgICAgICAgPSBpbml0IDM0ICAzOVxuZXhwb3J0cy5tYWdlbnRhICAgICAgID0gaW5pdCAzNSAgMzlcbmV4cG9ydHMuY3lhbiAgICAgICAgICA9IGluaXQgMzYgIDM5XG5leHBvcnRzLndoaXRlICAgICAgICAgPSBpbml0IDM3ICAzOVxuZXhwb3J0cy5ncmF5ICAgICAgICAgID0gaW5pdCA5MCAgMzlcblxuZm9yIGJnIGluIEJHX0NPTE9SU1xuICAgIG1vZHVsZS5leHBvcnRzW2JnXSA9IGV2YWwgYmdcbiAgICBmb3IgYmkgaW4gWzEuLjhdXG4gICAgICAgIGJuID0gYmcrYmlcbiAgICAgICAgbW9kdWxlLmV4cG9ydHNbYm5dID0gQjI1NiBldmFsIGJuXG5cbmZvciBmZyBpbiBGR19DT0xPUlNcbiAgICBtb2R1bGUuZXhwb3J0c1tmZ10gPSBldmFsIGZnXG4gICAgZm9yIGkgaW4gWzEuLjhdXG4gICAgICAgIG1vZHVsZS5leHBvcnRzW2ZnK1N0cmluZyhpKV0gPSBGMjU2IGV2YWwgZmcrU3RyaW5nKGkpXG5cbmlmIHJlcXVpcmUubWFpbiA9PSBtb2R1bGVcblxuICAgIHJlc2V0ID0gJ1xceDFiWzBtJ1xuICAgIGJvbGQgID0gJ1xceDFiWzFtJ1xuICAgICAgICAgICAgICAgIFxuICAgIGZvciBiZyBpbiBCR19DT0xPUlNcbiAgICAgICAgZm9yIGJpIGluIFsxLi44XVxuICAgICAgICAgICAgcyA9IHJlc2V0XG4gICAgICAgICAgICBibiA9IGJnK2JpXG4gICAgICAgICAgICBmbiA9IGJnLnRvTG93ZXJDYXNlKCkrYmlcbiAgICAgICAgICAgIHMgKz0gbW9kdWxlLmV4cG9ydHNbZm5dKFwiI3tmbn0gI3tibn0gXCIpXG4gICAgICAgICAgICBmb3IgZmcgaW4gRkdfQ09MT1JTXG4gICAgICAgICAgICAgICAgZm4gPSBmZytcIiN7OS1iaX1cIlxuICAgICAgICAgICAgICAgIHMgKz0gbW9kdWxlLmV4cG9ydHNbYm5dIG1vZHVsZS5leHBvcnRzW2ZuXSAnICcgKyBmZyArICcgJ1xuICAgICAgICAgICAgbG9nIHMgKyByZXNldFxuICAgICAgICAgICAgXG4gICAgbG9nIFwiIFwiXG4gICAgIl19
//# sourceURL=../coffee/kolor.coffee