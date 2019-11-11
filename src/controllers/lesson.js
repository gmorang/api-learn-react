const Lesson = require('../models/lesson');

const router = (module.exports = require('express').Router());

router.route('/').post(async (req, res, next) => {
  try {
    const props = req.body;
    const { title } = props;

    if (await Lesson.findOne({ title }))
      return res.status(400).send({ error: 'Class alredy exists' });

    const lesson = await Lesson.create(props);

    return res.json({ lesson });
  } catch (err) {
    next(err);
  }
});

router.route('/').get(async (req, res, next) => {
  try {
    const docs = await Lesson.find().populate({
      path: 'lesson'
    });

    return res.json(docs);
  } catch (err) {
    next(err);
  }
});
