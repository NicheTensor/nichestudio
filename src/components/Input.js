"use client"
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { Select, SelectItem, Card, CardBody, Textarea, Accordion, AccordionItem, Slider, Button, Checkbox } from "@nextui-org/react";
import { ratios, styles, modelsT2I, models } from "../app/data";
import { AiOutlineClose } from "react-icons/ai";
import { generateFaceToMany, generateGoJourney, generateStickerMaker, generateTextToImage, generatePersonalize, generateImageToImage, generateImageUpscaling } from "@/utils/ApiCaller";

const DEFAULT_IMAGE = "/default.avif";
const MAX_STORAGE = 5;

const Advanced = ({ uid, secretKey, seed, updateSettings, checkHeight }) => {

  const activeCheckHeight = ()=>{
    setTimeout(() => {
      checkHeight();
    }, 100);
  }

  return (
    <Accordion >
      <AccordionItem onPress={activeCheckHeight} key="1" aria-label="Advanced"  title={<span className="text-sm">Advanced</span>}>
        <div className="flex flex-col gap-4">
          <Textarea
            label="Specify an UID"
            placeholder="Enter specify an UID"
            value={uid}
            onChange={(event) => updateSettings("uid", event.target.value)}
          />
          <Textarea
            label="Secret key"
            placeholder="Enter secret key"
            value={secretKey}
            onChange={(event) => updateSettings("secretKey", event.target.value)}
          />
          <Textarea
            label="Seed"
            placeholder="Enter seed"
            value={seed}
            onChange={(event) => updateSettings("seed", event.target.value)}
          />
        </div>
      </AccordionItem>
    </Accordion>
  )
}


const Slide = ({ scale, title, attribute, updateSettings }) => {
  const handleChange = (value) => {
    updateSettings(attribute, value)
  };
  return (
    <Slider
      label={title}
      size="sm"
      color="foreground"
      step={0.1}
      maxValue={1}
      minValue={0}
      value={scale}
      className="max-w-md"
      onChange={handleChange}
    />
  )
}

const ImageUpload = ({ image, title, attribute, updateSettings }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, []);

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    updateSettings(attribute, null);
    fileInputRef.current.value = '';
  };

  const processFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // The result attribute contains the data URL, which is base64 encoded
        const base64String = event.target.result;
        const fileSize = (file.size / 1024).toFixed(2);
        updateSettings(attribute, { base64String: base64String, name: file.name, size: fileSize })
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-md w-full">
        <div className="text-sm mb-1">{title}</div>
        <Card
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-dashed border-2 border-gray-300 text-center"
        >
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-4xl cursor-pointer" onClick={triggerFileSelect}>+</div>
            <p className="mt-2">Drag and drop file here</p>
            <p className="text-gray-500 mt-1">Limit 200MB per file (JPG, PNG, JPEG)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
        </Card>
        {
          image &&
          <div className="relative w-full h-full mt-2">
            <Image src={image.base64String} width={0} height={0} className="w-full h-full object-cover rounded-2xl" alt="Uploaded image" />
            <button onClick={removeFile} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
              <AiOutlineClose size={20} />
            </button>
          </div>
        }
      </div>
    </div>
  );
}

const Style = ({ style, updateSettings }) => {
  return (
    <Select
      label="Style"
      placeholder="Select a style"
      selectedKeys={[style]}
      style={{ backgroundColor: "white" }}
      onSelectionChange={(keys) => { if (keys.currentKey) updateSettings("style", keys.currentKey) }}
    >
      {styles.map((st) => (
        <SelectItem key={st.key} className="text-primary">
          {st.label}
        </SelectItem>
      ))}
    </Select>
  )
}

const Prompt = ({ prompt, updateSettings }) => {

  const handleChange = (event) => {
    updateSettings("prompt", event.target.value);
  };

  return (
    <Textarea
      label="Prompt"
      placeholder="Enter your prompt"
      value={prompt}
      onChange={handleChange}
    />
  )
}

const NegativePrompt = ({ negativePrompt, updateSettings }) => {

  const handleChange = (event) => {
    updateSettings("negativePrompt", event.target.value);
  };

  return (
    <Textarea
      label="Negative Prompt"
      placeholder="Enter your negative prompt"
      value={negativePrompt}
      onChange={handleChange}
    />
  )
}

const Models = ({ models, model, updateSettings }) => {
  return (
    <Select
      label="Model"
      placeholder="Select a model"
      selectedKeys={[model]}
      style={{ backgroundColor: "white" }}
      onSelectionChange={(keys) => { if (keys.currentKey) updateSettings("model", keys.currentKey) }}
    >
      {models.map((md) => (
        <SelectItem key={md.key} className="text-primary">
          {md.label}
        </SelectItem>
      ))}
    </Select>
  )
}

const Ratios = ({ ratio, isGenerating, updateSettings, setFirstGen }) => {
  return (
    <Select
      label="Ratio"
      isDisabled={isGenerating}
      placeholder="Select a ratio"
      selectedKeys={[ratio]}
      style={{ backgroundColor: "white" }}
    >
      {ratios.map((rt) => (
        <SelectItem key={rt.key} className="text-primary" onClick={() => {
          if (rt.key)
            updateSettings("ratio", rt.key)
          setFirstGen(true)
          updateSettings("generatedImage", [])
        }}>
          {rt.label}
        </SelectItem>
      ))}
    </Select>
  )
}

const PromptEnhancement = ({ useExpansion, updateSettings }) => {
  return (
    <Checkbox isSelected={useExpansion} onChange={(e) => updateSettings("useExpansion", e.target.checked)} size="sm">Prompt Enhancement</Checkbox>
  )
}

export default function Input({ feature, settings, setSettings, setFirstGen, setStorage, checkHeight }) {
  const { model, ratio, negativePrompt, uid, secretKey, seed, poseImage, image, ipScale, promptStrength, controlScale, style, isGenerating, status, prompt, useExpansion } = settings;
  const [error, setError] = useState("")

  useEffect(() => {
    if (!settings.isGenerating && settings.generatedImage.length > 0) {
      saveNewSettingToLocalStorage(settings);
    }
  }, [settings.isGenerating]);

  useEffect(() => {
    if (feature === "textToImage" && model === "goJourney") {
      // Reset to GoJourney specific settings
      setSettings(prevSettings => ({
        ...prevSettings,
        ratio: "",
        negativePrompt: "",
        useExpansion: true,
        prompt: "an image of izuku midoriya wearing a dark green t - shirt and baseball cap being served by a robot maid with large technics arms, by Range Murata, Katsuhiro Otomo, Yoshitaka Amano, and Artgerm. 3D shadowing effect, 8K resolution. --ar 4:5 --v 6"
      }));
    }
  }, [model, feature]);

  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };


  const check = () => {
    setError("")
    if (!prompt) {
      setError("Please fill in Prompt field")
      return false
    }
    if (feature == "faceToMany" || feature == "imageToImage") {
      if (!image) {
        setError("Please upload an image")
        return false
      }
    }

    if (feature == "personalize") {
      if (!image) {
        setError("Please upload an image that contains face")
        return false
      }
      if (!poseImage) {
        setError("Please upload an image that contains pose")
        return false
      }
    }

    return true
  }

  const generate = async () => {
    if (!check())
      return
    setFirstGen(false)
    switch (feature) {
      case "faceToMany":
        generateFaceToMany(settings, setSettings)
        break;
      case "stickerMaker":
        generateStickerMaker(settings, setSettings)
        break;
      case "textToImage":
        if (model === "goJourney") {
          generateGoJourney(settings, setSettings)
        } else {
          generateTextToImage(settings, setSettings)
        }
        break;
      case "personalize":
        generatePersonalize(settings, setSettings)
        break;
      case "imageToImage":
        generateImageToImage(settings, setSettings)
        break;
      case "imageUpscaling":
        generateImageUpscaling(settings, setSettings)
        break;
    }
  }

  useEffect(() => {
    setError("")
  }, [feature])

  const saveNewSettingToLocalStorage = async (setting) => {
    const settings = getLocalStorageSettings();
    const newKey = `${feature}_${Date.now()}`;

    const processedImages = await Promise.all(
      setting.generatedImage.map(async (img) => {
        if (img === DEFAULT_IMAGE) return img;

        const webpBase64 = await convertImage(img);
        return webpBase64;
      }),
    );

    const base64InputImage = setting.image?.base64String
      ? await convertImage(setting.image.base64String)
      : undefined;
    settings[newKey] = {
      ...setting,
      image: { ...setting.image, base64String: base64InputImage },
      generatedImage: processedImages,
    };

    if (Object.keys(settings).length > MAX_STORAGE) {
      const lowestTime = Object.keys(settings).reduce((prev, current) => {
        const value = current.split("_").at(-1);
        return prev - value > 0 ? value : prev;
      }, 10e12);

      const oldestKey = Object.keys(settings).find((item) =>
        item.includes(lowestTime),
      );
      delete settings[oldestKey];
    }

    setStorage(settings);
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  const convertImage = async (base64Image) => {
    const response = await fetch('/api/webp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Image }),
    });
    const data = await response.json();
    return data.webpBase64;
  };

  const getLocalStorageSettings = () => JSON.parse(localStorage.getItem("settings")) || {};

  return (

    <Card >
      <CardBody >
        <div className="flex flex-col gap-4">
          {
            feature == "textToImage" && <Models models={modelsT2I} model={model} updateSettings={updateSettings} />
          }
          {
            ["personalize", "imageToImage"].includes(feature) && <Models models={models} model={model} updateSettings={updateSettings} />
          }
          <Prompt prompt={prompt} updateSettings={updateSettings} />
          {(feature === "textToImage" && model === "goJourney") && (
            <div className="text-sm text-gray-500 px-2">
              <p className="font-medium mb-2">Available GoJourney Parameters:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <table className="w-full">
                  <tbody className="space-y-1">
                    <tr>
                      <td className="font-medium pr-2">--ar</td>
                      <td>Aspect ratio (e.g., --ar 16:9)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--v</td>
                      <td>Version 1-6, default is latest (e.g., --v 6)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--q</td>
                      <td>Quality 1-5, default is 1 (e.g., --q 2)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--chaos</td>
                      <td>Randomness 0-100 (e.g., --chaos 50)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--stylize</td>
                      <td>Artistic influence 0-1000 (e.g., --stylize 500)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--weird</td>
                      <td>Unconventional results 0-3000 (e.g., --weird 750)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--seed</td>
                      <td>Fixed randomness (e.g., --seed 12345)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--no</td>
                      <td>Excludes elements (e.g., --no trees)</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--tile</td>
                      <td>Creates seamless patterns</td>
                    </tr>
                    <tr>
                      <td className="font-medium pr-2">--hd</td>
                      <td>High detail mode (v5 and earlier)</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-3 text-xs italic">Add these parameters at the end of your prompt to refine the output.</p>
              </div>
            </div>
          )}
          {(feature === "textToImage" && model !== "goJourney") && (
            <>
              <PromptEnhancement useExpansion={useExpansion} updateSettings={updateSettings} />
              <Ratios ratio={ratio} isGenerating={isGenerating} updateSettings={updateSettings} setFirstGen={setFirstGen} />
              <NegativePrompt negativePrompt={negativePrompt} updateSettings={updateSettings} />
            </>
          )}
          {feature == "faceToMany" &&
            <>
              <Style style={style} updateSettings={updateSettings} />
              <ImageUpload image={image} title="Upload an image" attribute="image" updateSettings={updateSettings} />
            </>
          }
          {["imageToImage", "imageUpscaling"].includes(feature) &&
            <>
              <ImageUpload image={image} title="Upload an image" attribute="image" updateSettings={updateSettings} />
              {"imageToImage" === feature && <Slide scale={promptStrength} title="Strength of prompt" attribute="promptStrength" updateSettings={updateSettings} />}
            </>
          }
          {feature == "personalize" &&
            <>
              <ImageUpload image={image} title="Upload your image that contains face" attribute="image" updateSettings={updateSettings} />
              <ImageUpload image={poseImage} title="Upload your image that contains pose" attribute="poseImage" updateSettings={updateSettings} />
              <Slide scale={ipScale} title="IP Adapter Scale" attribute="ipScale" updateSettings={updateSettings} />
              <Slide scale={controlScale} title="ControlNet Scale" attribute="controlScale" updateSettings={updateSettings} />
              <NegativePrompt negativePrompt={negativePrompt} updateSettings={updateSettings} />
            </>
          }
          {
            (feature === "imageToImage") &&
            <NegativePrompt negativePrompt={negativePrompt} updateSettings={updateSettings} />
          }
          {/* <Advanced uid={uid} secretKey={secretKey} seed={seed} updateSettings={updateSettings} checkHeight={checkHeight}/> */}
          <Button className="transition duration-150 ease-in-out text-white" style={{background: "rgba(0, 26, 255, 1)", borderRadius:"20px"}} isDisabled={isGenerating} onClick={generate}>
            Generate
          </Button>
          {
            error &&
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          }
          {
            status === "Task failed" &&
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>An error occurred while processing your request. Please check your input.</span>
            </div>
          }
        </div>
      </CardBody>
    </Card>

  )
}
