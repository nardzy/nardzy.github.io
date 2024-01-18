window.onload = function() {
    let elem = {};
    let divs = document.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        let div = divs[i];

        elem[div.id] = document.querySelector("#" + div.id);
    }

    elem.loading.style.opacity = 0;

}
