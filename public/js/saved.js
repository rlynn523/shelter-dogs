var mockBreeds = {
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

var mockShelters = {
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
    displaySavedBreeds(mockBreeds);
    displaySavedShelters(mockShelters);
});
