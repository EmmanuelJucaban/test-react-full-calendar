require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const { subMonths } = require('date-fns');
const PORT = process.env.NODE_ENV || 3001;

const app = express();


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
}).then(() => {
  console.log('yeee');
}).catch(e => console.log(e));

const eventSchema = new mongoose.Schema({
  title: String,
  start: {
    type: Date,
    default: Date.now(),
  },
  end: {
    type: Date,
    default: Date.now(),
  },
  startTime: {
    type: String,
    default: '',
  },
  endTime: {
    type: String,
    default: '',
  },
});

const Event = mongoose.model('Event', eventSchema);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/events', async (req, res) => {
  const {
    values
  } = req.body;

  const [ startYear, startMonth, startDay, ] = values.startDate.split('-');
  const [ startHour, startMinutes ] = values.startTime.split(':');

  const customFields = [];
  const [ endYear, endMonth, endDay, ] = values.endDate.split('-');
  const [ endHour, endMinutes ] = values.endTime.split(':');

  const start = subMonths(new Date(startYear, startMonth, startDay, startHour, startMinutes), 1);
  const end = subMonths(new Date(endYear, endMonth, endDay, endHour, endMinutes), 1);

  const newEvent = await Event.create({
    title: values.title,
    start,
    end,
    startTime: start,
    endTime: end,
  });

  console.log(newEvent);
  res.json(newEvent);

});

app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
})


app.listen(PORT, () => console.log('Port started on port: ' + PORT));
