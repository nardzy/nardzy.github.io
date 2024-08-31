(() => {

    const file = document.querySelector("#input_vid");
    const video = document.querySelector("#load_vid");

    file.addEventListener("change", () => {

        video.src = URL.createObjectURL(file.files[0]);

    });

})();