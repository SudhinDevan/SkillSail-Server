import blogModel from "../model/blogs.js";
import userModel from "../model/userSchema.js";
import { cloudinary } from "../config/cloudinary.js";

const createBlog = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.inputs || !data.image) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid request body" });
    }
    const {
      inputs: { heading, content, email },
      image,
    } = data;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    if (image) {
      let file;
      file = await cloudinary.uploader.upload(image, {
        folder: "SkillSail",
      });
      const newBlog = new blogModel({
        author: user._id,
        blogHeading: heading,
        content: content,
        thumbnail: file,
      });
      await newBlog.save();
      return res.status(200).json({
        error: false,
        message: "Blog created successfully",
        blog: newBlog,
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const blogListing = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const user = await userModel.findOne({ email: userEmail });
    const blogList = await blogModel.find({ author: user._id });
    res.status(200).json({ message: "blogs fetched successfully", blogList });
  } catch (error) {
    res.json(error);
  }
};

export { createBlog, blogListing };
