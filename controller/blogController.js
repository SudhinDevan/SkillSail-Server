import blogModel from "../model/blogs.js";
import userModel from "../model/userSchema.js";
import { cloudinary } from "../config/cloudinary.js";

const createBlog = async (req, res, next) => {
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
    next(err);
  }
};

const blogListing = async (req, res, next) => {
  try {
    const userEmail = req.query.email;
    const user = await userModel.findOne({ email: userEmail });
    const blogList = await blogModel.find({ author: user._id });
    res.status(200).json({ message: "blogs fetched successfully", blogList });
  } catch (err) {
    next(err);
  }
};

const blogDetials = async (req, res, next) => {
  try {
    const blogId = req.query.blogId;
    const blogDetails = await blogModel
      .findOne({ _id: blogId })
      .populate("author");
    return res
      .status(200)
      .json({ message: "blog fetched successfully", blogDetails });
  } catch (err) {
    next(err);
  }
};

const editBlog = async (req, res, next) => {
  try {
    const data = req.body;
    let file;
    if (data.image) {
      file = await cloudinary.uploader.upload(data.image, {
        folder: "SkillSail",
      });
    }
    const blog = await blogModel.findOneAndUpdate(
      { _id: data.inputs.id },
      {
        $set: {
          blogHeading: data.inputs.heading || undefined,
          content: data.inputs.content || undefined,
          thumbnail: file || undefined,
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: "Edited Successfully", blog });
  } catch (err) {
    next(err);
  }
};

const displayBlogs = async (req, res, next) => {
  try {
    const blogs = await blogModel.find();
    return res
      .status(200)
      .json({ message: "blogs fetched successfully", blogs });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const blog = await blogModel.findByIdAndDelete(blogId);
    return res.status(200).json({ message: "Deleted successfully", blog });
  } catch (error) {
    console.log(error);
  }
};

const dashboardBlog = async (req, res, next) => {
  try {
    const blog = await blogModel.find({}).sort({ createdAt: -1 }).limit(2);
    return res.status(200).json({ message: "Blog fetched successfully", blog });
  } catch (err) {
    next(err);
  }
};

export {
  createBlog,
  blogListing,
  blogDetials,
  editBlog,
  displayBlogs,
  dashboardBlog,
  deleteBlog,
};
