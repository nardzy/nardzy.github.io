(() => {

    const lang = (() => {

        const language = window.navigator.language.split("-")[0];

        const lang_map = new Map([
            ["ja", {
                title: "ループ再生",
                loop: "ループ再生 - Canvas2d"
            }],
            ["en", {
                title: "Video Loop",
                loop: "Video Loop - Canvas2d"
            }]
        ]);

        if (lang_map.has(language)) {

            return lang_map.get(language);

        }

        return lang_map.get("en");

    })();

    document.title = lang.title;

    {

        const loop = document.querySelector("#lang_loop");

        loop.innerText = lang.loop;

    }

    let current_frame = 0;
    let anim = null;

    const frame = new Map();

    let video = null;

    const file = document.querySelector("#input_vid");
    const ignore_last_frame = document.querySelector("#input_ignr");
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    const vid_loop = () => {

        if (video.ended) {

            const value = Number(ignore_last_frame.value);

            current_frame %= frame.size - (Number.isNaN(value) ? 0 : value);
            current_frame += 1;

            if (frame.has(current_frame)) {
                ctx.drawImage(frame.get(current_frame), 0, 0);
            }

        } else if (video.currentTime !== 0) {

            current_frame += 1;

            const canvasv = document.createElement("canvas");
            const ctxv = canvasv.getContext("2d");

            canvasv.width = canvas.width;
            canvasv.height = canvas.height;

            ctxv.drawImage(video, 0, 0);
            ctx.drawImage(video, 0, 0);
    
            frame.set(current_frame, canvasv);

        }

        anim = requestAnimationFrame(vid_loop);

    };

    file.addEventListener("change", () => {

        if (file.files[0] === undefined) {

            if (anim !== null) {
                cancelAnimationFrame(anim);
                anim = null;
            }

            return;

        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        video = document.createElement("video");

        video.src = URL.createObjectURL(file.files[0]);

        video.addEventListener("loadeddata", () => {

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            video.play();

        });

        video.addEventListener("playing", () => {

            current_frame = 0;

            frame.clear();
            anim = requestAnimationFrame(vid_loop);

        });

    });

})();