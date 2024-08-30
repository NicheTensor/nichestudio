import sharp from "sharp";

export async function POST(request) {
  const data = await request.json();
  const { imageBase64 } = data;

  try {
    const imageBuffer = Buffer.from(imageBase64.split(",")[1], "base64");

    const webpBuffer = await sharp(imageBuffer)
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    const webpBase64 = `data:image/png;base64,${webpBuffer.toString("base64")}`;

    return Response.json({ webpBase64 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "An error occurred while converting the image to WebP" },
      { status: 500 },
    );
  }
}
