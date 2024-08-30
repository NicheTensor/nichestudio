"use client";

import { useState } from "react";
import Image from "next/image";
import { FaAnglesLeft } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import clsx from "clsx";

const PreviousGenerations = ({ storage, isGenerating, setFeature, setSettings, setFirstGen, setStorage }) => {
	const [isReveal, setIsReveal] = useState(true);

	const handleSelect = (key, value) => {
		if (isGenerating) return;
		const feature = key.split("_").at(0);
		setFeature(feature);
		setSettings(value);
		setFirstGen(false);
		setIsReveal(false);
	}

	const removeSetting = (key) => {
		const newStorage = { ...storage };
		delete newStorage[key];
		setStorage(newStorage);
		localStorage.setItem("settings", JSON.stringify(newStorage));
	}

	return (
		<div
			className={clsx(
				"fixed top-1/2 -translate-y-1/2 p-3 bg-white rounded-br-lg shadow transition-all z-50",
				isReveal ? "left-0" : "-left-[232px]",
			)}
		>
			<div className="w-52 min-h-[208px] max-h-[416px] overflow-y-auto flex flex-col gap-3">
				{Object.entries(storage).map(([key, value]) => (
					<button key={key} onClick={() => handleSelect(key, value)}
						className="flex-shrink-0 rounded-lg overflow-hidden relative"
					>
						<Image src={value.generatedImage.at(-1)} alt={key}
							width={208}
							height={208}
							className="object-cover w-full aspect-square" />
						<span onClick={(e) => {
							e.stopPropagation();
							removeSetting(key)
						}}
							className="absolute top-0 right-0 bg-white p-1 rounded-bl-lg cursor-pointer hover:bg-gray-100 transition-all"
						>
							<AiOutlineClose />
						</span>
					</button>
				))}
			</div>
			{Object.entries(storage).length > 0 &&
				<button
					onClick={() => setIsReveal(!isReveal)}
					className={clsx("absolute bg-white rounded-t-2xl py-2 px-4 flex justify-center items-center -z-10", isReveal ? "w-full -top-10 right-1/2 translate-x-1/2" : "top-1/2 -translate-y-1/2  -right-[122px]  rotate-90")}
				>
					<FaAnglesLeft className={clsx("mr-2 transition-all", isReveal ? "" : "rotate-90")} />
					Recent Generation
				</button>
			}
		</div>
	);
};

export default PreviousGenerations;
