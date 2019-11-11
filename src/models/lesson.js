const moongose = require('mongoose');

const LessonSchema = new moongose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  recomended: {
    type: Array,
    required: true
  }
});

const Lesson = moongose.model('Lesson', LessonSchema);

module.exports = Lesson;
