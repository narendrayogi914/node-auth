const Joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(100),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msessage: "Bad Request ", error });
  }
  next();
};
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(100),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msessage: "Bad Request ", error });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};
