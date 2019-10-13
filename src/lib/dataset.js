import Helpers from './helpers';

class Dataset {};

Dataset.data = Helpers.flightStats(JSON.parse(localStorage.data || '[]'));
Dataset.dependents = [];
Dataset.running = Dataset.data.length && !Dataset.data[Dataset.data.length - 1].end;

Dataset.clear = _ => {
  Dataset.data = [];
  update();
}

Dataset.update = (i, d) => {
  d.elapsed = (d.end.time - d.start.time) / 1000;
  d.dist = Helpers.getDistance(d.start.coord, d.end.coord);
  d.speed = 3600 * d.dist / d.elapsed;
  console.log(d.elapsed);
  Dataset.data[i] = d;
  update();
}

Dataset.remove = i => {
  Dataset.data.splice(i,1);
  update();
}

Dataset.export = _ => {
  if(Dataset.running) return;
  const url = encodeURI("data:text/csv;charset=utf-8,"
  + "Start Time,End Time,Time Elapsed,Start Longitude,Start Latitude,End Longitude,End Latitude\n"
  + Dataset.data.map(({start, end, elapsed}) => [start.time, end.time, elapsed, ...(start.coord || ["",""]), ...(end.coord||["",""])].join(',')).join('\n'))
  let download = document.createElement("a");
  download.setAttribute('href', url);
  download.setAttribute('download', 'flight-data.csv');
  download.click();
}

Dataset.import = e => {
  if(Dataset.running) return;
  var reader = new FileReader();
  reader.onload = function(event) {
    Dataset.data = event.target.result.split('\n').map(s => s.split(','));
    Dataset.data.shift();
    Dataset.data = Helpers.flightStats(Dataset.data.map(d => ({
      start: {
        time: parseInt(d[0]) || "",
        coord: [parseFloat(d[3]) || "", parseFloat(d[4]) || ""]
      },
      end: {
        time: parseInt(d[1]) || "",
        coord: [parseFloat(d[5]) || "", parseFloat(d[6]) || ""]
      },
      elapsed: parseInt(d[2]) || ""
    })));
    update();
  }
  reader.readAsText(e.target.files[0])
}

Dataset.pushStart = async _ => {
  Dataset.running = true;
  Dataset.data.push({start: await newData()});
  update();
}

Dataset.pushEnd = async _ => {
  let obj = Object.assign(
    Dataset.data[Dataset.data.length - 1],
    { end: await newData() }
  );
  obj.elapsed = (obj.end.time - obj.start.time) / 1000;
  obj.dist = Helpers.getDistance(obj.start.coord, obj.end.coord);
  obj.speed = 3600 * obj.dist / obj.elapsed;

  Dataset.data[Dataset.data.length - 1] = obj;
  Dataset.running = false;
  update();
}

Dataset.toggleUnitSystem = _ => {
  Helpers.toggleUnitSystem();
  Dataset.data = Helpers.flightStats(Dataset.data);
  update();
}

Dataset.incrementOffset = delta => {
  if(Math.abs(Helpers.UTCOffset + delta) > 12) return;
  Helpers.UTCOffset += delta;
  localStorage.UTCOffset = Helpers.UTCOffset;
  update();
}

Dataset.register = ref => { Dataset.dependents.push(ref); ref.setState({data: Dataset.data}); }

const newData = _ => new Promise((resolve, reject) => {
  let obj = { time: Date.now() }
  if (!navigator.onLine) resolve(Object.assign(obj, { coord: undefined }));
  navigator.geolocation.getCurrentPosition(
    res => resolve(Object.assign(obj, {
      coord: [res.coords.longitude, res.coords.latitude]
    })),
    err => resolve(Object.assign(obj, { coord: undefined }))
  )
})

const update = _ => {
  Dataset.dependents.forEach(dep => dep.setState({data: Dataset.data}))
  localStorage.data = JSON.stringify(Dataset.data);
}

export default Dataset;
