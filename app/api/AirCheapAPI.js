import 'whatwg-fetch';

let AirCheapAPI = {
  fetchAirports() {
    //return fetch('https://aircheapapi.pro-react.com/airports')
    return fetch('airports.json')
    .then((response) => response.json());
  },

  fetchTickets(origin, destination) {
    //return fetch(`https://aircheapapi.pro-react.com/tickets?origin=${origin}&destination=${destination}`)
     return fetch(`http://localhost:3000/flight_tickets.json?origin=${origin}&destination=${destination}`)
     //return fetch(`flights.json?origin=${origin}&destination=${destination}`)
    .then((response) => response.json())
      
    .catch((error) => {
      console.warn(error);
     });
  }
};

export default AirCheapAPI;
