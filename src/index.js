let webView = document.querySelector("#webview");
console.log(webView);

let noiseOptions = {
    baseFrequency: [0.01, 0.01],
    type: "fractalNoise",
    numOctaves: 10,
    seed: 1,
    stitchTiles: "stitch"
};

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