$(function() {
    // $.fn.editable.defaults.mode = 'inline';
    var petFind = 'http://api.petfinder.com/pet.find';
    var key = '?key=781bec9e50bf85caa863d233753cf237';
    var dog = '&animal=dog';
    var location = '&location=';
    var format = '&format=json';

    function displayDogProfiles(profiles) {
        var searchInput = $('#searchBar').val();
        for (i = 0; i < profiles.length; i++) {
            console.log(searchLocation);
            var breed = profiles[i].breeds.breed.$t;
            var dataId = profiles[i].id.$t;
            if (searchInput == breed) {
                console.log('found search term');
                $('#results').append('<p class="profile">' + 'name: ' + profiles[i].name.$t + '<br>' + 'breed: ' +
                    profiles[i].breeds.breed.$t + ' <img src="images/check.png" id="saveBreed"' + ' breed= ' + profiles[i].breeds.breed.$t + ' style="width: 20px">' + '<br>' + 'age: ' + profiles[i].age.$t + '<br>' + 'description: ' + profiles[i].description.$t +
                    '<br>' + 'click to save profile ' + '<img src="images/check.png" id="saveProfile"' + ' name= ' + profiles[i].name.$t + ' breed= ' + profiles[i].breeds.breed.$t + ' age= ' + profiles[i].age.$t + ' description= ' + profiles[i].description.$t + ' style="width: 20px">' + '</p>');
            }
        }
    }
    $('#searchBar').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            displayDogProfiles(profiles);
            console.log('enter button pressed');
            $('#searchBar').val('');
        }
    });

    $('#search').submit(function(e) {
        e.preventDefault();
        console.log('submit button pressed');
        var searchInput = $('#searchBar').val();
        var searchLocation = $('#searchLocation').val();
        console.log(typeof(searchLocation));
        console.log(searchLocation);
        if (searchInput === '') {
            alert('Please Search A Breed!');
        } else {
            $.ajax({
                url: petFind + key + dog + location + searchLocation + format,
                type: 'get',
                dataType: 'jsonp',
                beforeSend: function(jqXHR, settings) { console.log(settings.url); },
                success: function(data) {
                    displayDogProfiles(data.petfinder.pets.pet);
                    console.log('get pets');
                    $('#results').on('click', '#saveProfile', function() {
                        var profiles = data.petfinder.pets.pet;
                        var name = $(this).attr('name');
                        var breed = $(this).attr('breed');
                        var age = $(this).attr('age');
                        $(this).closest('.profile').add();
                        $.ajax({
                            url: 'http://localhost:8080/profiles',
                            type: 'post',
                            dataType: 'json',
                            data: JSON.stringify({
                                name: name,
                                breed: breed,
                                age: age
                            }),
                            contentType: 'application/json',
                        });
                    });
                    $('#results').on('click', '#saveBreed', function() {
                        var breed = $(this).attr('breed');
                        $(this).closest('.profile').add();
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
                }
            });
            displayDogProfiles(profiles);
        }
        $('#searchBar').val('');
    });
    // GET request for saved profiles in db
    $.ajax({
        url: 'http://localhost:8080/profiles',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            for (i = 0; i < data.length; i++) {
                var id = data[i]._id;
                $('#savedProfiles').append('<p class="profile">' + 'name: ' + data[i].name + '<br>' + 'breed: ' +
                    data[i].breed + '<br>' + 'age: ' + data[i].age + '<br>' + 'Delete Profile: ' + '<img src="images/clear.png" id="deleteProfile" style="width: 25px">' + '<br>' + '</p>');
            }
            // removes saved profiles on Saved Dog Profiles
            $('#savedProfiles').on('click', '#deleteProfile', function() {
                $(this).closest('.profile').remove();
                $.ajax({
                    url: 'http://localhost:8080/profiles/' + id,
                    type: 'delete',
                });
                console.log('deleted profile');
            });
        }
    });
    /*~~~~~~~~ Saved Breeds ~~~~~~~~*/

    function displaySavedBreeds(data) {
        for (i = 0; i < data.length; i++) {
            var breed = data[i].name;
            var id = data[i]._id;
            $('#savedBreeds').append('<p class="breed">' + '<a href="#" class="savedBreeds" data-type="text" data-pk=' + id + ' data-url="/breeds">' + breed + '</a>' + '<img src="images/clear.png" id="deleteBreed" style="width: 25px">' + '</p>');
        }
        // Click to remove breeds from saved list
        $('#savedBreeds').on('click', '#deleteBreed', function() {
            $(this).closest('.breed').remove();
            $.ajax({
                url: 'http://localhost:8080/breeds/' + id,
                type: 'delete',
            });
            console.log('deleted breed');
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
    // Click submit button to post new breed to database and append to Saved Breeds List
    $('#breeds-form').submit(function(e) {
        e.preventDefault();
        var input = $('#save-breeds').val();
        $.ajax({
            url: 'http://localhost:8080/breeds',
            type: 'post',
            data: JSON.stringify({
                name: input
            }),
            dataType: 'json',
            contentType: 'application/json',
        });
        $('#savedBreeds').append('<p>' + input + '</p>');
        $('#save-breeds').val('');
    });
    /*~~~~~~~~ Saved Shelters ~~~~~~~~*/

    function displaySavedShelters(data) {
        for (i = 0; i < data.length; i++) {
            var id = data[i]._id;
            var shelter = data[i].name;
            $('#savedShelters').append('<p class="shelter">' + '<a href="#" class="savedShelters" data-type="text" data-pk=' + id + ' data-url="/shelters">' + shelter + '</a>' + '<img src="images/clear.png" id="deleteShelter" style="width: 25px">' + '</p>');
        }
        // Click to remove breeds from saved list
        $('#savedShelters').on('click', '#deleteShelter', function() {
            $(this).closest('.shelter').remove();
            $.ajax({
                url: 'http://localhost:8080/shelters/' + id,
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
    $('#shelters-form').submit(function(e) {
        e.preventDefault();
        var input = $('#save-shelters').val();
        $.ajax({
            url: 'http://localhost:8080/shelters',
            type: 'post',
            data: JSON.stringify({
                name: input
            }),
            dataType: 'json',
            contentType: 'application/json',
        });
        $('#savedShelters').append('<p>' + input + '</p>');
        $('#save-shelters').val('');
    });

    /*~~~~~~~~ GET Requests ~~~~~~~~*/

    // GET request for saved breeds in db
    $.ajax({
        url: 'http://localhost:8080/breeds',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            // displays saved breeds on Saved Breeds
            displaySavedBreeds(data);
        },
    });
    // GET request for saved shelters in db
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
