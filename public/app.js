$(function() {
    var petFind = 'http://api.petfinder.com/pet.find';
    var key = '?key=781bec9e50bf85caa863d233753cf237';
    var dog = '&animal=dog';
    var location = '&location=';
    var format = '&format=json';

    // Function that removes previous search results
    function cleanSearch() {
        $('#searchBar').val('');
        $('#searchLocation').val('');
        $('#search-results').empty();
        $('#searchShelters').empty();
    }

    /* Retrieves entire list of dog breeds to accordion, user can then make a
    selection to search. */
    $.ajax({
        url: 'http://api.petfinder.com/breed.list?key=781bec9e50bf85caa863d233753cf237&animal=dog&format=json&callback=?',
        type: 'get',
        dataType: 'jsonp',
        contentType: 'application/json',
        success: function(data) {
            for (i = 0; i < data.petfinder.breeds.breed.length; i++) {
                $('#breedList').append('<p class=searchableBreed>' + data.petfinder.breeds.breed[i].$t +
                    '<img src="images/check.png" id="searchBreed"' + ' data-breed="' + data.petfinder.breeds.breed[i].$t +
                    '" style="width: 20px">' + '</p>');
            }
            // User can select a breed from the list and it will fill in the input field
            $('#breedList').on('click', '#searchBreed', function() {
                var breed = $(this).data('breed');
                $('#searchBar').val(breed);
            });
        }
    });

    // User presses enter to start search and results append below
    $('#searchBar').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            displayDogProfiles(profiles);
            $('#searchBar').val('');
            $('#searchLocation').val('');
        }
    });
    // User pushes the submit button and results append below
    $('#search').submit(function(e) {
        e.preventDefault();
        var searchBar = $('#searchBar').val();
        var searchInput = '&breed=' + $('#searchBar').val();
        var searchLocation = $('#searchLocation').val();
        if (searchBar === '' || searchLocation === '') {
            alert('Please Enter Search Parameters!');
        } else {
            $.ajax({
                url: petFind + key + dog + location + searchLocation + format + searchInput,
                type: 'get',
                dataType: 'jsonp',
                success: function(data) {
                    displayDogProfiles(data.petfinder.pets.pet);
                }
            });
            cleanSearch();
        }
    });

    // Click the check image to save a breed to your dashboard
    $('#search-results').on('click', '#saveBreed', function() {
        var breed = $(this).data('breed').replace(/\s+/g, '-');
        $(this).closest('.profile-info').add();
        $.ajax({
            url: 'http://localhost:8080/breeds',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({
                name: breed,
            }),
            contentType: 'application/json',
        });
    });

    // Click the check image to save a profile to your dashboard
    $('#search-results').on('click', '#saveProfile', function() {
        var name = $(this).data('name').replace(/\s+/g, '-');
        var breed = $(this).data('breed').replace(/\s+/g, '-');
        var description = $(this).data('description').replace(/\s+/g, '-');
        var age = $(this).attr('age');
        $(this).closest('.profile-info').add();
        $.ajax({
            url: 'http://localhost:8080/profiles',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({
                name: name,
                breed: breed,
                age: age,
                description: description
            }),
            contentType: 'application/json',
        });
    });

    // Function that takes in data from Petfinder API and appends results below
    function displayDogProfiles(profiles) {
        var searchInput = $('#searchBar').val();
        for (i = 0; i < profiles.length; i++) {
            let breeds = profiles[i].breeds.breed;
            let mixBreeds = "";     
            if (Array.isArray(breeds)) {        
                for (let i = 0; i < breeds.length; i++) {          
                    mixBreeds += breeds[i].$t + " ";        
                }      
            } else {        
                mixBreeds = breeds.$t;      
            }
            $('#search-results').append('<img src=' + profiles[i].media.photos.photo[i].$t +
                ' width=250>' + '</img>' + '<p class="profile-info">' + '<strong>' + ' Name: ' + '</strong>' + profiles[i].name.$t +
                '<br>' + '<strong>' + 'Breed: ' + '</strong>' + mixBreeds + ' <img src="images/check.png" id="saveBreed"' +
                ' data-breed="' + mixBreeds + '" style="width: 20px">' + '<br>' + '<strong>' + 'Age: ' + '</strong>' + profiles[i].age.$t +
                '<br>' + '<strong>' + 'Description: ' + '</strong>' + profiles[i].description.$t + '<br>' + '<strong>' + 'Click To Save Profile ' + '</strong>' +
                '<img src="images/check.png" id="saveProfile"' + ' data-name="' + profiles[i].name.$t + '" data-breed="' +
                mixBreeds + '" age= ' + profiles[i].age.$t + ' data-description="' + profiles[i].description.$t +
                '" style="width: 20px">' + '</p>');
        }
    }

    // GET request for saved profiles in user database
    $.ajax({
        url: 'http://localhost:8080/profiles',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            for (i = 0; i < data.length; i++) {
                var id = data[i]._id;
                var description = data[i].description.replace(/-/g, " ");
                var name = data[i].name.replace(/-/g, " ");
                var breed = data[i].breed.replace(/-/g, " ");

                $('#savedProfiles').append('<p class="profile">' + '<a href="#" class="savedProfiles" data-type="text" data-pk=' + id + ' data-url="/profiles">' + '</a>' + '<strong>' + 'Name: ' + '</strong>' + name + '<br>' + '<strong>' + 'Breed: ' + '</strong>' +
                    breed + '<br>' + '<strong>' + 'Age: ' + '</strong>' + data[i].age + '<br>' + '<strong>' + 'Description: ' + '</strong>' + description + '<br>' + '<strong>' + 'Delete Profile: ' + '</strong>' + '<img src="images/clear.png" id="deleteProfile" style="width: 25px">' + '<br>' + '</p>');
            }
            // Removes saved profiles on Saved Dog Profiles in Dashboard
            $('#savedProfiles').on('click', '#deleteProfile', function() {
                $(this).closest('.profile').remove();
                $.ajax({
                    url: 'http://localhost:8080/profiles/' + $(this).siblings('a').attr('data-pk'),
                    type: 'delete',
                });
            });
        }
    });

    // Function that displays saved breeds in the user database to the dashboard
    function displaySavedBreeds(data) {
        for (i = 0; i < data.length; i++) {
            var breed = data[i].name.replace(/-/g, " ");
            var id = data[i]._id;
            $('#savedBreeds').append('<p class="breed">' + '<a href="#" class="savedBreeds" data-type="text" data-pk=' + id + ' data-url="/breeds">' + breed + '</a>' + '<img src="images/clear.png" id="deleteBreed" style="width: 25px">' + '</p>');
        }
        // Click the 'X' image to remove breeds from saved list
        $('#savedBreeds').on('click', '#deleteBreed', function() {
            $(this).closest('.breed').remove();
            $.ajax({
                url: 'http://localhost:8080/breeds/' + $(this).siblings('a').attr('data-pk'),
                type: 'delete',
            });
        });
        $('.savedBreeds').editable({
            ajaxOptions: {
                dataType: 'json',
                contentType: 'application/json',
            },
            params: function(params) {
                return JSON.stringify(params);
            },
        });
    }

    // Function that displays saved shelters in the user database to the dashboard
    function displaySavedShelters(data) {
        for (i = 0; i < data.length; i++) {
            var id = data[i]._id;
            var name = data[i].name.replace(/-/g, " ");
            var address = data[i].address.replace(/-/g, " ");
            var email = data[i].email.replace(/-/g, " ");
            $('#savedShelters').append('<p class="shelter">' +
                '<a href="#" class="savedShelters" data-type="text" data-pk=' + id +
                ' data-url="/shelters">' + name + '<br>' + address + '<br>' + email + '</a>' +
                '<img src="images/clear.png" id="deleteShelter" style="width: 25px">' + '</p>');
        }
        // Click to remove shelters from saved list in the dashboard
        $('#savedShelters').on('click', '#deleteShelter', function() {
            $(this).closest('.shelter').remove();
            $.ajax({
                url: 'http://localhost:8080/shelters/' + $(this).siblings('a').attr('data-pk'),
                type: 'delete',
            });
        });
        $('.savedShelters').editable({
            ajaxOptions: {
                dataType: 'json',
                contentType: 'application/json',
            },
            params: function(params) {
                return JSON.stringify(params);
            },
        });
    }

    /* Function that allows user to input location, and places it within the query
        string of the GET request to the Petfinder API */

    $('#local-form').submit(function(e) {
        e.preventDefault();
        var input = $('#search-local').val();
        $.ajax({
            url: 'http://api.petfinder.com/shelter.find?key=781bec9e50bf85caa863d233753cf237&location=' + input + '&format=json',
            type: 'get',
            dataType: 'jsonp',
            success: function(data) {
                for (i = 0; i < data.petfinder.shelters.shelter.length; i++) {
                    var name = data.petfinder.shelters.shelter[i].name.$t;
                    var address = (data.petfinder.shelters.shelter[i].city.$t + ', ' +
                        data.petfinder.shelters.shelter[i].state.$t + ' ' + data.petfinder.shelters.shelter[i].zip.$t);
                    var email = data.petfinder.shelters.shelter[i].email.$t;
                    $('#searchShelters').append('<p class = "shelter-info">' + name +
                        '<br>' + address + '<br>' + email + '<img src="images/check.png" id="saveShelter" data-name="' + name + '" data-address="' + address + '" data-email="' + email +
                        '" style="width: 20px">' + '</p>');
                }
            },
            contentType: 'application/json',
        });
        cleanSearch();
        $('#search-local').val('');
    });
    // User can click the check image to save a shelter profile to the database
    $('#searchShelters').on('click', '#saveShelter', function() {
        var name = $(this).data('name').replace(/\s+/g, '-');
        var address = $(this).data('address').replace(/\s+/g, '-');
        var email = $(this).data('email').replace(/\s+/g, '-');
        $(this).closest('.shelter-info').add();
        $.ajax({
            url: 'http://localhost:8080/shelters',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({
                name: name,
                address: address,
                email: email
            }),
            contentType: 'application/json',
        });
    });

    // GET request for saved breeds in user database
    $.ajax({
        url: 'http://localhost:8080/breeds',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            // displays saved breeds on Saved Breeds
            displaySavedBreeds(data);
        },
    });

    // GET request for saved shelters in the user database
    $.ajax({
        url: 'http://localhost:8080/shelters',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            // displays saved shelters on Saved Shelters
            displaySavedShelters(data);
        },
    });
});
