const router = require("express").Router();const tokenController = require("../controllers/tokenController");

router.post("/token", [], tokenController.createToken);
router.get("/getCardData/", tokenController.getCardData);

module.exports = router;
