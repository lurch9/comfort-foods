global.google = {
  maps: {
    places: {
      AutocompleteService: function () {
        return {
          getPlacePredictions: jest.fn(),
        };
      },
      Autocomplete: function () {
        return {
          addListener: jest.fn(),
          getPlace: jest.fn().mockReturnValue({
            formatted_address: '123 Main St, Anytown, USA',
            geometry: {
              location: {
                lat: jest.fn().mockReturnValue(40.748817),
                lng: jest.fn().mockReturnValue(-73.985428),
              },
            },
          }),
        };
      },
      SearchBox: function () {
        return {
          addListener: jest.fn(),
          getPlaces: jest.fn().mockReturnValue([
            {
              formatted_address: '123 Main St, Anytown, USA',
              geometry: {
                location: {
                  lat: jest.fn().mockReturnValue(40.748817),
                  lng: jest.fn().mockReturnValue(-73.985428),
                },
              },
            },
          ]),
        };
      },
    },
    Geocoder: function () {
      return {
        geocode: jest.fn(),
      };
    },
    event: {
      addListener: jest.fn(),
      removeListener: jest.fn(), // Add removeListener to mock
    },
  },
};

