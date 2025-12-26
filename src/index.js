const { app, core, imaging, constants, action } = require("photoshop");

let webView = document.querySelector("#webview");
console.log(webView);

let noiseOptions = {
    baseFrequency: [0.01, 0.01],
    type: "fractalNoise",
    numOctaves: 10,
    seed: 1,
    stitchTiles: "stitch"
};

let docWidth = 1024;
let docHeight = 1024;

let filter = {
    invert: false,
    desaturate: false,
};

function onInput() {
    noiseOptions.baseFrequency[0] = parseFloat(document.querySelector("#baseFrequency1").value) / 1000;
    noiseOptions.baseFrequency[1] = parseFloat(document.querySelector("#baseFrequency2").value) / 1000;
    noiseOptions.type = document.querySelector("#noiseType").value;
    noiseOptions.numOctaves = parseInt(document.querySelector("#octaves").value);
    noiseOptions.seed = parseInt(document.querySelector("#seed").value);
    noiseOptions.stitchTiles = document.querySelector("#stitchTiles").checked ? "stitch" : "noStitch";

    console.log(noiseOptions);
    webView.postMessage({
        type: "setNoiseOptions",
        data: noiseOptions,
    });

    filter.invert = document.querySelector("#invert").checked;
    filter.desaturate = document.querySelector("#desaturate").checked;
    webView.postMessage({
        type: "setFilter",
        data: filter,
    });
    
    docWidth = parseInt(document.querySelector("#docWidth").value);
    docHeight = parseInt(document.querySelector("#docHeight").value);
    webView.postMessage({
        type: "updateDimensions",
        data: {
            width: docWidth,
            height: docHeight,
        },
    });
};

for (var input of document.querySelectorAll("input")) {
    input.addEventListener("input", onInput);
}

document.querySelector("select").addEventListener("change", onInput);

document.querySelector("#exportButton").addEventListener("click", () => {
    webView.postMessage({
        type: "requestExportLayer",
    });
});

window.addEventListener("message", (e) => {
    if (e.data.type === "exportLayer") {
        let view = Uint8Array.from(e.data.data);

        core.executeAsModal(async () => {
            let imageData = await imaging.createImageDataFromBuffer(view, {
                width: docWidth,
                height: docHeight,
                components: 4,
                colorSpace: "RGB",
            });
            
            let noiseLayer = await app.activeDocument.layers.add();
            await imaging.putPixels({
                layerID: noiseLayer.id,
                imageData: imageData,
            });
            noiseLayer.name = "Fractal Noise";
        }).catch(err => core.showAlert(err));
    }
});

// allow arrow key controls for number inputs
for (let input of document.querySelectorAll("input[type='number']")) {
    input.addEventListener("keydown", (e) => {
        let step = parseFloat(e.target.step);
        if (e.key === "ArrowUp") {
            e.preventDefault();
            e.target.value = parseFloat(e.target.value) + step;
            if (e.target.max && parseFloat(e.target.value) > parseFloat(e.target.max)) {
                e.target.value = e.target.max;
            }
            e.target.dispatchEvent(new Event("input"));
            e.target.dispatchEvent(new Event("change"));
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            e.target.value = parseFloat(e.target.value) - step;
            if (e.target.min && parseFloat(e.target.value) < parseFloat(e.target.min)) {
                e.target.value = e.target.min;
            }
            e.target.dispatchEvent(new Event("input"));
            e.target.dispatchEvent(new Event("change"));
        }
    });
}