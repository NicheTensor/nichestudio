export const features = [
  { key: "textToImage", label: "Text To Image" },
  { key: "faceToMany", label: "FaceToMany" },
  { key: "stickerMaker", label: "StickerMaker" },
  { key: "personalize", label: "Personalize" },
  { key: "imageToImage", label: "Image To Image" },
  { key: "goJourney", label: "GoJourney" },
  { key: "chatCompletions", label: "Chat Completions" },
];

export const styles = [
  { key: "3D", label: "3D" },
  { key: "video Game", label: "Video Game" },
  { key: "emoji", label: "Emoji" },
  { key: "pixels", label: "Pixels" },
  { key: "clay", label: "Clay" },
  { key: "toy", label: "Toy" },
];

export const modelsT2I = [
  { key: "animeV3", label: "AnimeV3" },
  { key: "realitiesEdgeXL", label: "RealitiesEdgeXL" },
  { key: "dreamShaperXL", label: "DreamShaperXL" },
  { key: "juggernautXL", label: "JuggernautXL" },
];

export const models = [
  { key: "dreamShaperXL", label: "DreamShaperXL" }
];

export const ratios = [
  { key: "1:1", label: "1:1" },
  { key: "3:2", label: "3:2" },
  { key: "2:3", label: "2:3" },
  { key: "4:3", label: "4:3" },
  { key: "3:4", label: "3:4" },
  { key: "16:9", label: "16:9" },
  { key: "9:16", label: "9:16" },
];

export const goJourney = {
  model: "",
  ratio: "",
  negativePrompt: "",
  uid: "-1",
  secretKey: "",
  seed: "-1",
  poseImage: "",
  image: null,
  generatedImage: [],
  status: "",
  ipScale: null,
  controlScale: null,
  style: "",
  isGenerating: false,
  promptStrength: null,
  useExpansion: true,
  prompt: "an image of izuku midoriya wearing a dark green t - shirt and baseball cap being served by a robot maid with large technics arms, by Range Murata, Katsuhiro Otomo, Yoshitaka Amano, and Artgerm. 3D shadowing effect, 8K resolution. --ar 4:5 --v 6"
};

export const faceToMany = {
  model: "",
  ratio: "",
  negativePrompt: "",
  uid: "-1",
  secretKey: "",
  seed: "-1",
  poseImage: "",
  image: null,
  generatedImage: [],
  status: "",
  ipScale: null,
  controlScale: null,
  style: "3D",
  isGenerating: false,
  promptStrength: null,
  useExpansion: true,
  prompt: "a person"
};

export const stickerMaker = {
  model: "",
  ratio: "",
  negativePrompt: "",
  uid: "-1",
  secretKey: "",
  seed: "-1",
  poseImage: "",
  image: null,
  generatedImage: [],
  status: "",
  ipScale: null,
  controlScale: null,
  style: "",
  isGenerating: false,
  promptStrength: null,
  useExpansion: true,
  prompt: "dolphin swimming in the red ocean"
}

export const textToImage = {
  model: "animeV3",
  ratio: "1:1",
  negativePrompt: "low quality, blurry, pixelated, noisy, low resolution, defocused, out of focus, overexposed, bad image, nsfw",
  uid: "-1",
  secretKey: "",
  seed: "-1",
  poseImage: "",
  image: null,
  generatedImage: [],
  status: "",
  ipScale: null,
  controlScale: null,
  style: "",
  isGenerating: false,
  promptStrength: null,
  useExpansion: true,
  prompt: "cinematic still of a shiba inu, fluffy neck, wearing a suit of ornate metal armor"
}

export const personalize = {
  model: "dreamShaperXL",
  ratio: "",
  negativePrompt: "low quality, blurry, pixelated, noisy, low resolution, defocused, out of focus, overexposed, bad image, nsfw",
  uid: "-1",
  secretKey: "",
  seed: "-1",
  poseImage: "",
  image: null,
  generatedImage: [],
  status: "",
  ipScale: 0.8,
  controlScale: 0.8,
  style: "",
  isGenerating: false,
  promptStrength: null,
  useExpansion: true,
  prompt: "Studio Ghibli, soft colors, whimsical style, hand-drawn, highly detailed"
}

export const imageToImage = {
  model: "dreamShaperXL",
  ratio: "",
  negativePrompt: "low quality, blurry, pixelated, noisy, low resolution, defocused, out of focus, overexposed, bad image, nsfw",
  uid: "-1",
  secretKey: "",
  seed: "-1",
  poseImage: "",
  image: null,
  generatedImage: [],
  status: "",
  ipScale: null,
  controlScale: null,
  style: "",
  isGenerating: false,
  promptStrength: 0.8,
  useExpansion: true,
  prompt: "cinematic still of a shiba inu, fluffy neck, wearing a suit of ornate metal armor"
}

export const sdRatioToSize = {
  "1:1": [512, 512],
  "3:2": [768, 512],
  "2:3": [512, 768],
  "4:3": [768, 576],
  "3:4": [576, 768],
  "16:9": [912, 512],
  "9:16": [512, 912],
}

export const sdxlRatioToSize = {
  "1:1": [1024, 1024],
  "3:2": [1152, 768],
  "2:3": [768, 1152],
  "4:3": [1216, 832],
  "3:4": [832, 1216],
  "16:9": [1360, 768],
  "9:16": [768, 1360],
}

export const modelConfig = {
  "animeV3": {
      "num_inference_steps": 25,
      "guidance_scale": 7,
      "clip_skip": 2,
      "ratio_size": sdxlRatioToSize
  },
  "realitiesEdgeXL": {
      "num_inference_steps": 7,
      "guidance_scale": 1,
      "clip_skip": 2,
      "ratio_size": sdxlRatioToSize,
  },
  "dreamShaperXL": {
      "num_inference_steps": 8,
      "guidance_scale": 2,
      "ratio_size": sdxlRatioToSize
  },
  "juggernautXL": {
      "num_inference_steps": 25,
      "guidance_scale": 7,
      "ratio_size": sdxlRatioToSize
  },
}

export const chatModels = ["Gemma7b", "Llama3_70b"];
