const express = require("express");
const router = express.Router();
const CollectionController = require("../controllers/collection");


router.post("/collection", CollectionController.AddCollection);

router.get("/collection", CollectionController.getCollection);

router.delete("/deleteCollection", CollectionController.deleteCollection);

router.get("/collection_edit", CollectionController.editCollection);

router.put("/updateCollectionStatus", CollectionController.UpdateCollection);

router.put("/collection_update", CollectionController.CollectionUpdate);

router.get("/collection/ActiveStatus", CollectionController.getActiveStatus);


module.exports = router;