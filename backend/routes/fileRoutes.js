// routes/fileRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/:bucket/:id", async (req, res) => {
  try {
    const { bucket, id } = req.params;
    const db = mongoose.connection.db;
    const bucketStream = new mongoose.mongo.GridFSBucket(db, {
      bucketName: bucket,
    });

    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = bucketStream.openDownloadStream(_id);

    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.contentType || "application/octet-stream");
    });
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).send("Error retrieving file");
  }
});

module.exports = router;
