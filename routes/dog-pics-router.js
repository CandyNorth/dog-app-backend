const dogPicsRouter = require("express").Router();
const multer = require("multer");
const { 
    getDogPics, 
    getDogPicById,
    getDogPicsByUserId 
} = require("../controllers/dog-pics-controllers");
const { predictBreed } = require("../controllers/prediction-controller");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

dogPicsRouter.get("/", getDogPics);
dogPicsRouter.get("/:picture_id", getDogPicById);
dogPicsRouter.get("/user/:user_id", getDogPicsByUserId);
dogPicsRouter.post("/predict", upload.single("file"), predictBreed);

module.exports = dogPicsRouter;
