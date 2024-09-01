(() => {

    {

        const lang = (() => {

            const language = window.navigator.language.split("-")[0];
    
            const lang_map = new Map([
                ["ja", {
                    title: "ループ再生",
                    loop: "ループ再生",
                    frame_count: "フレームレート:"
                }],
                ["en", {
                    title: "Video Loop",
                    loop: "Video Loop",
                    frame_count: "FPS:"
                }]
            ]);
    
            if (lang_map.has(language)) {
    
                return lang_map.get(language);
    
            }
    
            return lang_map.get("en");
    
        })();
    
        document.title = lang.title;

        const loop = document.querySelector("#lang_loop");
        const frame_count = document.querySelector("#lang_frame_count");

        loop.innerText = lang.loop;
        frame_count.innerText = lang.frame_count;

    }

    let last_video_frame = 0;
    let frame_now = 0;
    let frame_time = 0;
    let anim = null;

    let inspection_count = 0;

    const inspection_rate = 20;
    const frame_inspection = new Map();

    const file = document.querySelector("#input_vid");
    const video = document.querySelector("#load_vid");
    const vid_frame_rate = document.querySelector("#frame_rate_vid");

    const vid_loop = () => {

        const playback = video.getVideoPlaybackQuality();

        if (playback.totalVideoFrames !== last_video_frame) {

            last_video_frame = playback.totalVideoFrames;
            frame_now = performance.now() - frame_time;
            frame_time = performance.now();

            {

                const frame_rate = 1000 / frame_now;

                if (frame_inspection.has(frame_rate) === false) {
                    frame_inspection.set(frame_rate, 1);
                } else {
    
                    const count = frame_inspection.get(frame_rate);
    
                    inspection_count++;
    
                    frame_inspection.set(frame_rate, count + 1);
    
                }

            }

            if (inspection_count > inspection_rate) {
                inspection_count = 0;

                const most_frame = (() => {

                    let most_rate = 0;
                    let most_count = 0;

                    for (const [rate, count] of frame_inspection.entries()) {

                        if (most_count < count) {
                            most_count = count;
                            most_rate = rate;
                        }

                    }

                    return most_rate;

                })();

                vid_frame_rate.innerText = most_frame.toFixed(5);

                frame_inspection.clear();
            }

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

        video.src = URL.createObjectURL(file.files[0]);

        anim = requestAnimationFrame(vid_loop);

    });

})();