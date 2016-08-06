var mockDogProfiles = {
    'dogProfiles': [{
        'id': '1',
        'name': 'rango',
        'breed': 'cattle dog',
        'age': 'young',
        'sex': 'male',
        'shelter': 'pitt pets'
    }, {
        'id': '2',
        'name': 'jackson',
        'breed': 'bernese mountain dog',
        'age': 'young',
        'sex': 'male',
        'shelter': 'apollo dogs'
    }, {
        'id': '3',
        'name': 'molly',
        'breed': 'black lab',
        'age': 'old',
        'sex': 'female',
        'shelter': 'SPCA'
    }]
};
var mockSavedBreeds = {
    'dogBreeds': [
        {
            'breed': 'cattle dog'
        },
        {
            'breed': 'black lab'
        },
        {
            'breed': 'corgi'
        },
    ]
};

var mockSavedShelters = {
    'dogShelters': [
        {
            'name': 'Resuce Pups'
        },
        {
            'name': 'Pitt Pups'
        },
        {
            'name': 'Rover Rescue'
        },
    ]
};

function displayDogProfiles(data) {
    for (i = 0; i < data.dogProfiles.length; i++) {
        var dogs = data.dogProfiles[i];
        var input = $('#searchBar').val();
        if (input == dogs.breed) {
            $('#results').append('<p>' + dogs.name + ' ' + dogs.breed + ' ' + dogs.shelter + '</p>');
        }
    }
}

$(function() {
    $('#searchBar').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            displayDogProfiles(mockDogProfiles);
            $('#searchBar').val('');
        }
    });
    $('#search').submit(function(e) {
        e.preventDefault();
        displayDogProfiles(mockDogProfiles);
        $('#searchBar').val('');
    });
});

function displaySavedBreeds(data) {
    for(i=0; i<data.dogBreeds.length; i++){
        var breed = data.dogBreeds[i].breed;
        $('#savedBreeds').append('<p>' + breed + '</p>');
    }
}

function displaySavedShelters(data) {
    for(i=0; i<data.dogShelters.length; i++){
        var shelter = data.dogShelters[i].name;
        $('#savedShelters').append('<p>' + shelter + '</p>');
    }
}

$(function() {
    displayDogProfiles(mockDogProfiles);
    displaySavedBreeds(mockSavedBreeds);
    displaySavedShelters(mockSavedShelters);
});
