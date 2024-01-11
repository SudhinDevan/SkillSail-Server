import Razorpay from "razorpay";
import crypto from "crypto";
import paymentSchema from "../model/payment.js";
import courses from "../model/courses.js";
import dotenv from "dotenv";
import userSchema from "../model/userSchema.js";
dotenv.config();

let instance = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

export async function paymentOrder(req, res, next) {
  try {
    const { price } = req.body;
    var options = {
      amount: price * 100, // amount in the smallest currency unit
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.log(err);
        res.json({ err: true, message: "server error" });
      } else {
        res.json({ err: false, order });
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { response, userId, courseId } = req.body;

    let body = response.razorpay_order_id + "|" + response.razorpay_payment_id;

    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === response.razorpay_signature) {
      const course = await courses.findById(courseId);
      const purchase = await paymentSchema.create({
        transactionId: response,
        user: userId,
        course: courseId,
        tutor: course.tutor,
        price: course.price,
      });
      await userSchema.findByIdAndUpdate(
        userId,
        { $addToSet: { appliedCourses: courseId } },
        { new: true }
      );
      await courses.findByIdAndUpdate(
        courseId,
        { $addToSet: { students: userId } },
        { new: true }
      );
      return res.json({
        err: false,
        purchase,
      });
    } else {
      return res.json({
        err: true,
        message: "payment verification failed",
      });
    }
  } catch (err) {
    next(err);
  }
}
