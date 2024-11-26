const FormData = require("form-data");
const { uploadToS3 } = require("../db/seeds/utils");
const { insertDogPicture } = require("../models/dog-pics-models");

let fetch;
import("node-fetch").then((module) => {
  fetch = module.default;
});

const DEV_USER_ID = 1;

exports.predictBreed = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    const userId = req.user?.id || DEV_USER_ID;

    const imageUrl = await uploadToS3(req.file.buffer, req.file.originalname);

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    const result = await fetch(
      "https://sorei9240-dog-id-api.hf.space/predict",
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          ...formData.getHeaders(),
        },
      }
    );

    if (!result.ok) {
      const error = await result.text();
      throw new Error(error);
    }

    const { predictions } = await result.json();

    const dbResult = await insertDogPicture({
      userId,
      imageUrl,
      predictions: [
        {
          breed: predictions[0].breed,
          confidence: predictions[0].confidence,
        },
        {
          breed: predictions[1].breed,
          confidence: predictions[1].confidence,
        },
        {
          breed: predictions[2].breed,
          confidence: predictions[2].confidence,
        },
      ],
    });

    res.json({
      success: true,
      data: {
        imageUrl,
        predictions: { predictions },
        dbRecord: dbResult,
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: error.message });
  }
};
