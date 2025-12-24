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

let onInput = (e) => {
    noiseOptions.baseFrequency[0] = parseFloat(document.querySelector("#baseFrequency1").value);
    noiseOptions.baseFrequency[1] = parseFloat(document.querySelector("#baseFrequency2").value);
    noiseOptions.type = document.querySelector("#noiseType").value;
    noiseOptions.numOctaves = parseInt(document.querySelector("#octaves").value);
    noiseOptions.seed = parseInt(document.querySelector("#seed").value);
    noiseOptions.stitchTiles = document.querySelector("#stitchTiles").checked ? "stitch" : "noStitch";

    console.log(noiseOptions);
    webView.postMessage({
        type: "setNoiseOptions",
        data: noiseOptions,
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