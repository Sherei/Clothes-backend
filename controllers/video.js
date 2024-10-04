const Video = require("../model/video");

exports.add_Video = async (req, res) => {  
      try {
      const video = new Video({
        url: req.body.url, 
        user: req.body.user ? req.body.user : null, 
      });
  
      await video.save();
  
      res.send({ message: "Video Added", video });
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  };
  
  //get video by user
  
  exports.get_Video = async (req, res) => {  
    try {
      const user = req.params.user;
  
      const video = await Video.find({ user: user });
  
      if (video) {
        res.status(200).json(video);
        console.log("user:", video);
      } else {
        res.status(404).json({ message: "Video not found for the user" });
      }
    } catch (error) {
      console.log("Err:", error);
      res.status(500).json({ message: "Error retrieving video", error });
    }
  };