var video2canvasDrawer = {
    standard: function(video, ctx) {
        var canvas = ctx.canvas;

        var vw = video.videoWidth,
            vh = video.videoHeight,
            cw = canvas.width,
            ch = canvas.height;
        var vRatio = vw / vh,
            cRatio = cw / ch;

        if (vRatio >= cRatio) {
            // need to crop sides of video
            var croppedVideoWidth = vh * cRatio;
            var croppedVideoX = (vw / 2) - (croppedVideoWidth / 2);
            ctx.drawImage(video, croppedVideoX, 0, croppedVideoWidth, vh, 0, 0, cw, ch);
        } else {
            // need to crop top/bottom of video
            var croppedVideoHeight = vw / cRatio;
            var croppedVideoY = (vh / 2) - (croppedVideoHeight / 2);
            ctx.drawImage(video, 0, croppedVideoY, vw, croppedVideoHeight, 0, 0, cw, ch);
        }
    },
    split4: function(video, ctx) {
        var canvas = ctx.canvas;
        var w = video.videoWidth,
            h = video.videoHeight;
        ctx.drawImage(video, w / 2, h / 2, w / 2, h / 2, 0, 0, canvas.width / 2, canvas.height / 2);
        ctx.drawImage(video, 0, 0, w / 2, h / 2, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
        ctx.drawImage(video, 0, h / 2, w / 2, h / 2, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
        ctx.drawImage(video, w / 2, 0, w / 2, h / 2, 0, canvas.height / 2, canvas.width / 2, canvas.height / 2);
    },
    rotate4: function(video, ctx) {
        var canvas = ctx.canvas;
        var w = video.videoWidth,
            h = video.videoHeight;
        ctx.drawImage(video, 0, 0, w / 2, h / 2, 0, 0, canvas.width / 2, canvas.height / 2);

        ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(video, 0, 0, w / 2, h / 2, 0, -canvas.width, canvas.height / 2, canvas.width / 2);
        ctx.restore();

        ctx.save();
        ctx.rotate(Math.PI);
        ctx.drawImage(video, 0, 0, w / 2, h / 2, -canvas.width, -canvas.height, canvas.width / 2, canvas.height / 2);
        ctx.restore();

        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(video, 0, 0, w / 2, h / 2, -canvas.height, 0, canvas.height / 2, canvas.width / 2);
        ctx.restore();
    },
    hFlip: function(video, ctx) {
        var canvas = ctx.canvas;
        var w = video.videoWidth,
            h = video.videoHeight;
        ctx.drawImage(video, 0, 0, w / 2, h, 0, 0, canvas.width / 2, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w / 2, h, -canvas.width, 0, canvas.width / 2, canvas.height);
        ctx.restore();
    },
    flipAll: function(video, ctx) {
        var canvas = ctx.canvas;
        var w = video.videoWidth,
            h = video.videoHeight;
        ctx.drawImage(video, 0, 0, w / 2, h / 2, 0, 0, canvas.width / 2, canvas.height / 2);

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w / 2, h / 2, -canvas.width, 0, canvas.width / 2, canvas.height / 2);
        ctx.restore();

        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(video, 0, 0, w / 2, h / 2, 0, -canvas.height, canvas.width / 2, canvas.height / 2);
        ctx.restore();

        ctx.save();
        ctx.scale(-1, -1);
        ctx.drawImage(video, 0, 0, w / 2, h / 2, -canvas.width, -canvas.height, canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
};