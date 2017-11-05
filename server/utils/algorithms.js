"use strict";

function Algorithm(size) {

    var data = new Float32Array(size * size);
    data.fill(0.0);

    var self = this;

    var rand = this.getRandom();

    this.getData = function(x, y)
    {
        return y ? data[y * size + x | 0] : data[x];
    }
    this.setData = function(ind, val)
    {
        data[ind | 0] = val;
    }
    this.getSize = function()
    {
        return size;
    }
    this.perlin = function(start_freq, koef)
    {
        var time = Date.now();

        function extrem(freq, ampl)
        {
            function dispersion(rad)
            {
                return 2 * rad * rand.next() - rad;
            }

            var ret = new Array(freq * freq);
            for (var i = 0; i < freq * freq; i++)
            {
                ret[i] = dispersion(ampl);
            }
            return ret;
        }
        function cos_lerp(a, b, t)
        {
            var ft = t * Math.PI;
            var f = (1 - Math.cos(ft)) * 0.5;
            return a * (1 - f) + b * f;
        }

        var ampl = 1;
        var freq = start_freq;

        do
        {
            var buf = extrem(freq, ampl);

            function buf_data(x, y)
            {
                return buf[y * freq + x | 0];
            }
            for (var j = 0; j < size; j++)
            {
                for (var i = 0; i < size; i++)
                {
                    var x = i * freq / size | 0;
                    var y = j * freq / size | 0;
                    var tx = i * freq / size - x;
                    var ty = j * freq / size - y;
                    var x1 = buf_data(x, y);
                    var old_x = x;
                    x++;
                    if (x > freq - 1) x = 0;
                    var x2 = buf_data(x, y);
                    var xx = cos_lerp(x1, x2, tx);

                    y++;
                    if (y > freq - 1) y = 0;
                    var y1 = buf_data(old_x, y);
                    var y2 = buf_data(x, y);
                    var yy = cos_lerp(y1, y2, tx);
                    var h = cos_lerp(xx, yy, ty);

                    data[size * j + i | 0] += h;
                }
            }
            freq *= 2;
            ampl *= koef;
        }
        while (freq < size);

        Console.info("Perlin noise = ", Date.now() - time);
        return self;
    }
    this.normalize = function(a, b)
    {
        var time = Date.now();
        var min = data[0];
        var max = data[0];
        for (var i = 1; i < size * size; i++)
        {
            if (data[i] > max) max = data[i];
            if (data[i] < min) min = data[i];
        }
        var k = (b - a) / (max - min);
        for (var i = 0; i < size * size; i++)
            data[i] = (data[i] - min) * k + a;

        Console.info("Normalize = ", Date.now() - time);
        return self;
    }

    this.getRandom = function (temp) {

        var holdrand = (temp || (Date.now() * Math.random())) & 0xffffffff;

        this.next = function()
        {
            holdrand = (holdrand * 214013 + 2531011) & 0xffffffff;
            var ret = (holdrand >> 16) & 0x7fff;
            return ret / 32767.0;
        }
    }



}