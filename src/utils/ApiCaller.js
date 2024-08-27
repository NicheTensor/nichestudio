import {modelConfig} from "../app/data"

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const fetchGoJourney = async (taskId) => {
  const data = {
    "task_id": taskId
  }
  let output = await fetch("/api/gojourney", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  output = await output.json()
  return output
}

function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const handleCrop = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // This enables CORS for images from other domains
    img.src = imageUrl;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const newWidth = Math.floor(width / 2);
      const newHeight = Math.floor(height / 2);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const crops = [
        { x: 0, y: 0, width: newWidth, height: newHeight },
        { x: newWidth, y: 0, width: newWidth, height: newHeight },
        { x: 0, y: newHeight, width: newWidth, height: newHeight },
        { x: newWidth, y: newHeight, width: newWidth, height: newHeight },
      ];

      const croppedImagePromises = crops.map(crop => {
        return new Promise((resolve) => {
          canvas.width = crop.width;
          canvas.height = crop.height;
          ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
          resolve(canvas.toDataURL('image/png'));
        });
      });

      Promise.all(croppedImagePromises)
        .then(croppedImages => resolve(croppedImages))
        .catch(error => reject(error));
    };

    img.onerror = () => {
      reject(new Error('Failed to load the image.'));
    };
  });
};

const generateImages = async (data, setSettings) => {
  const promises = [];
  for (let i = 0; i <= 3; i++) {
    let newData = { ...data }
    if (data["seed"]>=0)
      newData["seed"] = newData["seed"] + i
    else
      newData["seed"] = getRandomInt(0, 1e9);
    promises.push(
      fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      }).then(response => response.json())
        .then(result => {
          let newImage = "/default.avif"
          if ("image" in result && result["image"]!="")
            newImage = `data:image/png;base64,${result?.image}`;
          setSettings(prevSettings => ({
            ...prevSettings,
            generatedImage: [
              ...(prevSettings.generatedImage ?? []),
              newImage,
            ],
          }));
        })
        .catch(error => {
          console.error("Request failed: ", error);
        })
    );
  }
  await Promise.allSettled(promises);

}

const upscaleImage = async (data, setSettings) => {
  let newData = { ...data };
  if (data["seed"] >= 0) newData["seed"] = newData["seed"];
  else newData["seed"] = getRandomInt(0, 1e9);
  await fetch("/api/upscale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  })
    .then((response) => response.json())
    .then((result) => {
      let newImage = "/default.avif";
      if ("image" in result && result["image"] != "")
        newImage = `data:image/png;base64,${result?.image}`;
      setSettings((prevSettings) => ({
        ...prevSettings,
        generatedImage: [...(prevSettings.generatedImage ?? []), newImage],
      }));
    })
    .catch((error) => {
      console.error("Request failed: ", error);
    });
};

export const generatePersonalize = async (settings, setSettings) => {
  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  updateSettings("isGenerating", true);
  updateSettings("generatedImage", [])
  updateSettings("status", "")

  const { prompt, seed, model, image, poseImage, ipScale, controlScale, negativePrompt, useExpansion } = settings;
  const [width, height] = modelConfig[model]["ratio_size"]["1:1"];
  const numInferenceSteps = modelConfig[model]["num_inference_steps"]
  const guidanceScale = modelConfig[model]["guidance_scale"]
  const base64Image = image.base64String.split(",")[1]
  const base64PoseImage = poseImage.base64String.split(",")[1]

  const data = {
    "key": API_TOKEN,
    "prompt": prompt,
    "model_name": capitalizeFirstLetter(model),
    "seed": parseInt(seed),
    "miner_uid": parseInt(-1),
    "pipeline_type": "instantid",
    "conditional_image": base64Image,
    "pipeline_params": {
      "width": width,
      "height": height,
      "num_inference_steps": numInferenceSteps,
      "guidance_scale": guidanceScale,
      "negative_prompt": negativePrompt,
      "controlnet_conditioning_scale": parseFloat(controlScale),
      "ip_adapter_scale": parseFloat(ipScale),
      "kps_conditional_image": base64PoseImage,
      "clip_skip": 2,
      "use_expansion": useExpansion,
    },
  }
  await generateImages(data, setSettings);
  updateSettings("isGenerating", false);
}

export const generateImageToImage = async (settings, setSettings) => {
  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  updateSettings("isGenerating", true);
  updateSettings("generatedImage", [])
  updateSettings("status", "")

  const { prompt, seed, model, image, negativePrompt, promptStrength, useExpansion } = settings;
  const [width, height] = modelConfig[model]["ratio_size"]["1:1"];
  const guidanceScale = modelConfig[model]["guidance_scale"]
  const base64Image = image.base64String.split(",")[1]

  let data = {
    "key": API_TOKEN,
    "prompt": prompt,
    "model_name": capitalizeFirstLetter(model),
    "seed": parseInt(seed),
    "miner_uid": parseInt(-1),
    "pipeline_type": "img2img",
    "conditional_image": base64Image,
    "pipeline_params": {
      "width": width,
      "height": height,
      "num_inference_steps": 20,
      "guidance_scale": guidanceScale,
      "negative_prompt": negativePrompt,
      "ip_adapter_scale": parseFloat(1.0),
      "kps_conditional_image": "",
      "clip_skip": 2,
      "use_expansion": useExpansion,
      "strength": parseFloat(promptStrength)
    },
  }

  await generateImages(data, setSettings);
  updateSettings("isGenerating", false);
}

export const generateImageUpscaling = async (settings, setSettings) => {
  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  updateSettings("isGenerating", true);
  updateSettings("generatedImage", [])
  updateSettings("status", "")

  const { prompt, seed, model, image, useExpansion } = settings;
  const [width, height] = modelConfig[model]["ratio_size"]["1:1"];
  const guidanceScale = modelConfig[model]["guidance_scale"]
  const base64Image = image.base64String.split(",")[1]

  let data = {
    "key": API_TOKEN,
    "prompt": prompt,
    "model_name": 'SUPIR',
    "seed": parseInt(seed),
    "miner_uid": parseInt(-1),
    "pipeline_type": "img2img",
    "conditional_image": base64Image,
    "pipeline_params": {
      "width": width,
      "height": height,
      "num_inference_steps": 20,
      "guidance_scale": guidanceScale,
      "ip_adapter_scale": parseFloat(1.0),
      "kps_conditional_image": "",
      "clip_skip": 2,
      "use_expansion": useExpansion,
    },
  }

  await upscaleImage(data, setSettings);
  updateSettings("isGenerating", false);
}

export const generateTextToImage = async (settings, setSettings) => {
  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  updateSettings("isGenerating", true);
  updateSettings("generatedImage", [])
  updateSettings("status", "")

  const { prompt, seed, model, ratio, negativePrompt, useExpansion } = settings;
  const [width, height] = modelConfig[model]["ratio_size"][ratio.toLowerCase()];
  const numInferenceSteps = modelConfig[model]["num_inference_steps"]
  const guidanceScale = modelConfig[model]["guidance_scale"]

  const data = {
    "key": API_TOKEN,
    "prompt": prompt,
    "model_name": capitalizeFirstLetter(model),
    "seed": parseInt(seed),
    "miner_uid": parseInt(-1),
    "pipeline_type": "txt2img",
    "conditional_image": "",
    "pipeline_params": {
      "width": width,
      "height": height,
      "num_inference_steps": numInferenceSteps,
      "guidance_scale": guidanceScale,
      "negative_prompt": negativePrompt,
      "ip_adapter_scale": parseFloat(1.0),
      "kps_conditional_image": "",
      "clip_skip": 2,
      "use_expansion": useExpansion,
    },
  }

  await generateImages(data, setSettings);
  updateSettings("isGenerating", false);
}

export const generateStickerMaker = async (settings, setSettings) => {
  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  updateSettings("isGenerating", true);
  updateSettings("generatedImage", [])
  updateSettings("status", "")

  const { prompt, seed, useExpansion } = settings;
  const data = {
    "key": API_TOKEN,
    "prompt": prompt,
    "model_name": "StickerMaker",
    "seed": parseInt(seed),
    "miner_uid": parseInt(-1),
    "pipeline_type": "txt2img",
    "pipeline_params": {
      "use_expansion": useExpansion,
    },
  }
  await generateImages(data, setSettings);
  updateSettings("isGenerating", false);
}

export const generateFaceToMany = async (settings, setSettings) => {
  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  updateSettings("isGenerating", true);
  updateSettings("generatedImage", [])
  updateSettings("status", "")


  const { prompt, image, style, seed,useExpansion } = settings;
  const base64Image = image.base64String.split(",")[1]
  const data = {
    "key": API_TOKEN,
    "prompt": prompt,
    "model_name": "FaceToMany",
    "seed": parseInt(seed),
    "miner_uid": parseInt(-1),
    "pipeline_type": "img2img",
    "conditional_image": base64Image,
    "pipeline_params": { 
      "style": capitalizeFirstLetter(style),
      "use_expansion": useExpansion,
    },
  }

  await generateImages(data, setSettings);
  updateSettings("isGenerating", false);
}



export const generateGoJourney = async (settings, setSettings) => {

  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  updateSettings("isGenerating", true);
  updateSettings("generatedImage", [])
  updateSettings("status", "")

  const { prompt, seed } = settings;
  const data = {
    "key": API_TOKEN,
    "prompt": prompt,
    "model_name": "GoJourney",
    "seed": parseInt(seed)>=0?parseInt(seed):getRandomInt(0, 1e9),
  }

  let output = await fetch("/api/generate", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  output = await output.json()
  if ("response_dict" in output)
    output = output["response_dict"]

  const taskId = output["task_id"]
  const taskResponse = await fetchGoJourney(taskId)
  if (taskResponse.status === 'failed' || taskId === undefined) {
    updateSettings("status", "Task failed")
    updateSettings("isGenerating", false);
    return
  }
  while (true) {
    const taskResponse = await fetchGoJourney(taskId);
    if (taskResponse.status === 'finished') {
      updateSettings("status", "Task finished")
      const croppedImages = await handleCrop(taskResponse["task_result"]["image_url"]);
      updateSettings("generatedImage", croppedImages)
      updateSettings("isGenerating", false);
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

export const generateText = async (messages, model) => {
  const data = {
    model,
    messages,
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.95,
  };

  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();

  return result;
};
