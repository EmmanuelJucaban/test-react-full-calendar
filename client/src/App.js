import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function App() {
  const [ events, setEvents ] = useState([]);
  const [ title, setTitle ] = useState('');
  const [ startTime, setStartTime ] = useState('');
  const [ endTime, setEndTime ] = useState('');
  const [ startDate, setStartDate ] = useState('');
  const [ endDate, setEndDate ] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/events');
      setEvents(data);
    })();
  }, []);
  return (
    <div className="App">
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        value={startTime}
        type='time'
        onChange={(e) => setStartTime(e.target.value)}
      />
      <TextField
        value={endTime}
        type='time'
        onChange={(e) => setEndTime(e.target.value)}
      />

      <TextField
        value={startDate}
        type='date'
        onChange={(e) => setStartDate(e.target.value)}
      />
      <TextField
        value={endDate}
        type='date'
        onChange={(e) => setEndDate(e.target.value)}
      />

      <Button
        onClick={async () => {
          const { data } = await axios.post('/api/events', {
            values: {
              title,
              startTime,
              endTime,
              startDate,
              endDate,
            }
          });
          console.log(data);
        }}
      >Submit date</Button>

      <FullCalendar
        // height='auto'
        timezone='local'
        contentHeight={600}
        events={events || []}
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, ]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView='dayGridMonth'
      />
    </div>
  );
}

export default App;
