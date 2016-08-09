$(function() {
    // $.fn.editable.defaults.mode = 'inline';

    function displayDogProfiles(data) {
        var dogs;
        for (i = 0; i < data.length; i++) {
            dogs = data[i];
            var input = $('#searchBar').val();
            $('#savedProfiles').append('<p>' + 'name: ' + dogs.name + '<br>' + 'breed: ' +
                dogs.breed + '<br>' + 'age: ' + dogs.age + '<br>' + 'sex: ' + dogs.sex +
                '<br>' + 'shelter: ' + dogs.shelter + '</p>');
            if (input == dogs.breed) {
                $('#results').html('<p class="profile">' + 'name: ' + dogs.name + '<br>' + 'breed: ' +
                    dogs.breed + '<br>' + 'age: ' + dogs.age + '<br>' + 'sex: ' + dogs.sex +
                    '<br>' + 'shelter: ' + dogs.shelter + '<br>' + 'click to save profile ' + '<img src="images/check.png" id="saveProfile" style="width: 20px">' + '</p>');
            }
        }
        $('#results').on('click', '#saveProfile', function() {
            $(this).closest('.profile').add();
            $.ajax({
                url: 'http://localhost:8080/profiles',
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
            });
        });
        $('#searchBar').keydown(function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                displayDogProfiles(data);
                $('#searchBar').val('');
            }
        });
        $('#search').submit(function(e) {
            e.preventDefault();
            displayDogProfiles(data);
            $('#searchBar').val('');
        });
    }

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
    // GET request for saved profiles in db
    $.ajax({
        url: 'http://localhost:8080/profiles',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            // displays saved shelters on Saved Dog Profiles
            displayDogProfiles(data);
        },
    });
});
