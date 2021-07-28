require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const { subMonths } = require('date-fns');
const PORT = process.env.PORT || 3001;

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
    type: Date,
    default: Date.now(),
  },
  endTime: {
    type: Date,
    default: Date.now(),
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

  const [ endYear, endMonth, endDay, ] = values.endDate.split('-');
  const [ endHour, endMinutes ] = values.endTime.split(':');

  const start = subMonths(new Date(startYear, startMonth, startDay, startHour, startMinutes), 1);
  const end = subMonths(new Date(endYear, endMonth, endDay, endHour, endMinutes), 1);


  // Local
  // [0] 2021-07-29T00:00:00.000Z
  //   [0] 2021-07-29T01:00:00.000Z
  console.log(start);
  console.log(end);
  const newEvent = await Event.create({
    title: values.title,
    start,
    end,
    startTime: start,
    endTime: end,
  });
// Local
// {
//     start: 2021-07-29T00:00:00.000Z,
//       end: 2021-07-29T01:00:00.000Z,
//       startTime: 2021-07-29T00:00:00.000Z,
//       endTime: 2021-07-29T01:00:00.000Z,
//       _id: 6101ba42de0d47e76501d08f,
//       title: 'Test the moment',
//       __v: 0
//     }
  console.log(newEvent);
  res.json(newEvent);

});

app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
})


app.listen(PORT, () => console.log('Port started on port: ' + PORT));
