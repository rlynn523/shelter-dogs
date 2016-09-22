$(function() {
    var petFind = 'https://api.petfinder.com/pet.find';
    var key = '?key=781bec9e50bf85caa863d233753cf237';
    var dog = '&animal=dog';
    var location = '&location=';
    var format = '&format=json';
    var apiUrl = 'https://mysterious-badlands-72714.herokuapp.com';
    // var apiUrl = 'http://localhost:8080';
    String.prototype.trunc = String.prototype.trunc ||
        function(n) {
            return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
        };

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
        url: 'https://api.petfinder.com/breed.list?key=781bec9e50bf85caa863d233753cf237&animal=dog&format=json&callback=?',
        type: 'get',
        dataType: 'jsonp',
        contentType: 'application/json'
    }).done(function(data) {
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
        var searchBar = $('#searchBar').val().trim();
        var searchInput = '&breed=' + $('#searchBar').val().trim();
        var searchLocation = $('#searchLocation').val().trim();
        if (searchBar === '' || searchLocation === '') {
            alert('Please Enter Search Parameters!');
        } else {
            $.ajax({
                url: petFind + key + dog + location + searchLocation + format + searchInput,
                type: 'get',
                dataType: 'jsonp'
            }).done(function(data) {
                if (!($.isEmptyObject(data.petfinder.pets))) {
                    displayDogProfiles(data.petfinder.pets.pet);
                } else {
                    var error = new Error('No results found!');
                    $('#search-results').html('<p style="text-align:center; font-size: 32px">' + error + '</p>');
                }
            }).fail(function() {
                var databaseError = new Error('Database is down! Come back later!');
                $('#search-results').html('<p style="text-align:center; font-size: 32px">' + databaseError + '</p>');
            });
            cleanSearch();
        }
    });

    // Click the check image to save a breed to your dashboard
    $('#search-results').on('click', '#saveBreed', function() {
        var breed = $(this).data('breed').replace(/\s+/g, '-');
        $(this).closest('.profile-info').add();
        $.ajax({
            url: apiUrl + '/breeds',
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
        var age = $(this).data('age');
        var shelter = $(this).data('shelter').replace(/\s+/g, '-');
        var email = $(this).data('email').replace(/\s+/g, '-');
        var description;
        if ($(this).data('description')) {
            description = $(this).data('description').replace(/\s+/g, '-');
        }
        $(this).closest('.profile-info').add();
        $.ajax({
            url: apiUrl + '/profiles',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({
                name: name,
                breed: breed,
                age: age,
                shelter: shelter,
                email: email,
                description: description
            }),
            contentType: 'application/json',
        });
    });

    // Function that takes in data from Petfinder API and appends results below
    function displayDogProfiles(profiles) {
        var searchInput = $('#searchBar').val().trim();
        for (i = 0; i < profiles.length; i++) {
            let breeds = profiles[i].breeds.breed;
            let mixBreeds = "";
            let shelterId = profiles[i].shelterId.$t;
            if (Array.isArray(breeds)) {
                for (let i = 0; i < breeds.length; i++) {
                    mixBreeds += breeds[i].$t + " ";
                }
            } else {
                mixBreeds = breeds.$t;
            }
            getShelters(shelterId, profiles[i], mixBreeds);
        }
    }

    function getShelters(shelterId, profile, mixBreeds) {
        $.ajax({
            url: 'https://api.petfinder.com/shelter.get?key=781bec9e50bf85caa863d233753cf237&id=' + shelterId + '&format=json',
            type: 'get',
            dataType: 'jsonp'
        }).done(function(data) {
            var shelterName = '';
            var email = '';
            if (data.petfinder.shelter) {
                shelterName = (data.petfinder.shelter.name.$t);
                email = (data.petfinder.shelter.email.$t);
            }
            var clone = $('.hidden .card').clone();
            clone = $(clone);
            if (profile.media.photos.photo[0].$t) {
                clone.find('.img').css('background', 'url(' + profile.media.photos.photo[0].$t + ') no-repeat');
            } else {
                clone.find('.img').css('background', 'url("images/big-paw.png") no-repeat');
            }
            clone.find('.img').data('name', profile.name.$t);
            clone.find('.img').data('breed', mixBreeds);
            clone.find('.img').data('age', profile.age.$t);
            if (shelterName) {
                clone.find('.img').data('shelter', shelterName);
            }
            if (email) {
                clone.find('.img').data('email', email);
            }
            if (profile.description.$t) {
                clone.find('.img').data('description', profile.description.$t.trunc(600));
            }
            clone.find('.card-title').html(profile.name.$t);
            clone.find('#breed').html('Breed: ' + mixBreeds + ' <img src="images/check.png" id="saveBreed"' +
                ' data-breed="' + mixBreeds + '" style="width: 20px">');
            clone.find('#age').html('Age: ' + profile.age.$t);
            if (shelterName) {
                clone.find('#shelter').html('Shelter: ' + shelterName);
            }
            if (email) {
                clone.find('#email').html('Email: ' + '<a href="mailto:' + email + '">' + email + '</a>');
            }
            if (profile.description.$t) {
                clone.find('#description').html('Description: ' + profile.description.$t.trunc(600));
            }
            $('#search-results').append(clone);
        });
    }
    // GET request for saved profiles in user database
    $.ajax({
        url: apiUrl + '/profiles',
        type: 'get',
        dataType: 'json'
    }).done(function(data) {
        for (i = 0; i < data.length; i++) {
            var id = data[i]._id;
            var name = data[i].name.replace(/-/g, " ");
            var breed = data[i].breed.replace(/-/g, " ");
            var shelter = data[i].shelter.replace(/-/g, " ");
            var email = data[i].email.replace(/-/g, " ");
            var description = '';
            if (data[i].description) {
                description = data[i].description.replace(/-/g, " ");
            }
            $('#savedProfiles').append('<p class="profile">' + '<a href="#" class="savedProfiles" data-type="text" data-pk=' + id + ' data-url="/profiles">' + '</a>' + '<strong>' + 'Name: ' + '</strong>' + name + '<br>' + '<strong>' + 'Breed: ' + '</strong>' +
                breed + '<br>' + '<strong>' + 'Age: ' + '</strong>' + data[i].age + '<br>' + '<strong>' + 'Shelter: ' + '</strong>' +
                shelter + '<br>' + '<strong>' + 'Email: ' + '</strong>' + '<a href="mailto:' + email + '">' + email + '</a>' + '<br>' + '<strong>' + 'Description: ' +
                '</strong>' + description + '<br>' + '<strong>' + 'Delete Profile: ' + '</strong>' + '<img src="images/clear.png" id="deleteProfile" style="width: 25px">' + '<br>' + '</p>');
        }
        // Removes saved profiles on Saved Dog Profiles in Dashboard
        $('#savedProfiles').on('click', '#deleteProfile', function() {
            $(this).closest('.profile').remove();
            $.ajax({
                url: apiUrl + '/profiles/' + $(this).siblings('a').attr('data-pk'),
                type: 'delete',
            });
        });
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
                url: apiUrl + '/breeds/' + $(this).siblings('a').attr('data-pk'),
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
                ' data-url="/shelters">' + '</a>' + name + '<br>' + address + '<br>' + '<a href="mailto:' + email + '">' + email + '</a>' + '</a>' +
                '<img src="images/clear.png" id="deleteShelter" style="width: 25px">' + '</p>');
        }
        // Click to remove shelters from saved list in the dashboard
        $('#savedShelters').on('click', '#deleteShelter', function() {
            $(this).closest('.shelter').remove();
            $.ajax({
                url: apiUrl + '/shelters/' + $(this).siblings('a').attr('data-pk'),
                type: 'delete',
            });
        });
    }

    /* Function that allows user to input location, and places it within the query
        string of the GET request to the Petfinder API */

    $('#local-form').submit(function(e) {
        e.preventDefault();
        var input = $('#search-local').val().trim();
        $.ajax({
            url: 'https://api.petfinder.com/shelter.find?key=781bec9e50bf85caa863d233753cf237&location=' + input + '&format=json',
            type: 'get',
            dataType: 'jsonp',
            contentType: 'application/json',
        }).done(function(data) {
            if (data.petfinder.shelters) {
                for (i = 0; i < data.petfinder.shelters.shelter.length; i++) {
                    var name = data.petfinder.shelters.shelter[i].name.$t;
                    var address = (data.petfinder.shelters.shelter[i].city.$t + ', ' +
                        data.petfinder.shelters.shelter[i].state.$t + ' ' + data.petfinder.shelters.shelter[i].zip.$t);
                    var email = data.petfinder.shelters.shelter[i].email.$t;
                    $('#searchShelters').append('<div class="col-md-4 col-sm-6 col-xs-12" style="height: 100px">' + '<p class = "shelter-info">' + name +
                        '<br>' + address + '<br>' + '<a href="mailto:' + email + '">' + email + '</a>' + ' <img src="images/check.png" id="saveShelter" data-name="' + name + '" data-address="' + address + '" data-email="' + email +
                        '" style="width: 20px">' + '</p>' + '</div>');
                }
            } else {
                var error = new Error('No results found!');
                $('#searchShelters').html('<p style="text-align:center; font-size: 32px">' + error + '</p>');
            }
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
            url: apiUrl + '/shelters',
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
        url: apiUrl + '/breeds',
        type: 'get',
        dataType: 'json',
    }).done(function(data) {
        // displays saved breeds on Saved Breeds
        displaySavedBreeds(data);
    });

    // GET request for saved shelters in the user database
    $.ajax({
        url: apiUrl + '/shelters',
        type: 'get',
        dataType: 'json'
    }).done(function(data) {
        // displays saved shelters on Saved Shelters
        displaySavedShelters(data);
    });
});
