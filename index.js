const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

//
// Status Management
//
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

//
// Loading All Trips
//
const loadTrips = () => {
  reportStatus('One sec! Loading trips...');

  // const tripList = $('#trip-list');
  const tripList = $('#trip-table');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<tr><td>${trip.name}</tr></td>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
 };

//
// Loading Single Trip
//
const loadTrip = () => {
  reportStatus('Finding that trip...');

  const singleTrip = $('#single-trip');
  singleTrip.empty();

  axios.get(URL + '1')
    .then((response) => {
      reportStatus(`Successfully loaded trip data`);
      let trip = response.data;
      singleTrip.append(`<li>Name: ${trip.name}</li>`);
      singleTrip.append(`<li>Continent: ${trip.continent}</li>`);
      console.log('Doing a thing');
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
 };

//
// Reserving Trips
//

const FORM_FIELDS = ['name', 'email', 'trip_id'];
const inputField = name => $(`#reserve-trip input[name="${name}"]`);

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });

  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

 const reserveTrip = (event) => {
   event.preventDefault();

   const tripData = readFormData();
   console.log(tripData);

   reportStatus('Reserving trip...');

   //url will be different and need to interpolate the trip ID that was selected
   let reserveURL = 'https://ada-backtrek-api.herokuapp.com/trips/250/reservations'

   axios.post(URL + tripData[trip_id] + '\/reservations', tripData)
   // axios.post(reserveURL, tripData)
     .then((response) => {
       reportStatus(`Successfully reserved a trip with ID ${response.data.id}!`);
       console.log('Posting a trip');
       clearForm();
     })
     .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};

$(document).ready(() => {
  $('#load-all-trips').click(loadTrips);
  $('#reserve-trip').submit(reserveTrip);
  //need event for loading single trip on click of ul link from trip-table
});
