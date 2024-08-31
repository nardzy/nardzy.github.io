const initalized = (() => {

    const main = document.querySelector("#main_contents");
    const priv = document.querySelector("#priv_contents");

    if (main === null || priv === null) return false;

    const create = (is_main, radius, direction) => {

        const far = () => {

            const yjsnpi = Math.max(100, radius + 20);

            return [
                yjsnpi * Math.cos(direction) + 50,
                yjsnpi * Math.sin(direction) + 50
            ];
        };

        const close = () => {
            return [
                radius * Math.cos(direction) + 50,
                radius * Math.sin(direction) + 50
            ];
        };

        const content = document.createElement("div");

        content.className = "floaty";

        const pos = is_main ? close() : far();

        content.style.left = `${pos[0]}%`;
        content.style.top = `${pos[1]}%`;

        main.appendChild(content);

        return [content, {
            far: far,
            close: close
        }];

    };

    const main_contents = (() => {

        const list = [];

        {

            const content = create(true, 30, Math.PI * 0.25);

            content[0].innerText = "..nothing";

            list.push(content);

        }

        {

            const content = create(true, 30, 0);

            content[0].innerText = "...later";

            list.push(content);

        }


        return list;

    })();

    const priv_contents = (() => {

        const list = [];

        {

            const content = create(false, 30, -Math.PI * 0.75);

            content[0].innerText = "ファイルのテスト";
            content[0].addEventListener("click", () => {
                window.open("/pub/test0/test.html");
            });

            list.push(content);

        }

        return list;

    })();


    {

        let state = false;
        let changeout = setTimeout(() => {});
    
        const changer = document.querySelector("#changer");
        const changer_text = document.querySelector("#changer_text");

        changer.addEventListener("click", () => {

            for (const content of main_contents) {

                const pos = state ? content[1].close() : content[1].far();

                content[0].style.left = `${pos[0]}%`;
                content[0].style.top = `${pos[1]}%`;

            }

            for (const content of priv_contents) {

                const pos = state ? content[1].far() : content[1].close();

                content[0].style.left = `${pos[0]}%`;
                content[0].style.top = `${pos[1]}%`;

            }

            changer_text.style.transform = `rotate(${state ? 1440 : 0}deg)`;
            changer_text.style.opacity = 0.8;

            clearTimeout(changeout);
            changeout = setTimeout(() => {
                changer_text.innerText = state ? "(裏)" : "置き場";
                changer_text.style.opacity = 1;
            }, 500);
    
            state = !state;
    
        });

    }

    return true;


})();

if (initalized) {

    console.info("hi");

}