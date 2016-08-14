$(function() {
    var petFind = 'http://api.petfinder.com/pet.find';
    var key = '?key=781bec9e50bf85caa863d233753cf237';
    var dog = '&animal=dog';
    var location = '&location=';
    var format = '&format=json';

    function cleanSearch() {
        $('#searchBar').val('');
        $('#searchLocation').val('');
        $('#search-results').empty();
        $('#searchShelters').empty();
    }

    $('.removeSearch').click(function() {
        $('#search-results').empty();
        $('#searchShelters').empty();
    });

    $('#searchBar').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            displayDogProfiles(profiles);
            console.log('enter button pressed');
            $('#searchBar').val('');
            $('#searchLocation').val('');
        }
    });

    $('#search').submit(function(e) {
        e.preventDefault();
        console.log('submit button pressed');
        var searchBar = $('#searchBar').val();
        var searchInput = '&breed=' + $('#searchBar').val();
        var searchLocation = $('#searchLocation').val();
        if (searchBar === '') {
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

    // click the check image to save a breed to your dashboard
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

    // click the check image to save a profile to your dashboard
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
            mixBreeds = mixBreeds.trim();
            $('#search-results').append('<img src=' + profiles[i].media.photos.photo[i].$t +
                ' width=250>' + '</img>' + '<p class="profile-info">' + ' name: ' + profiles[i].name.$t +
                '<br>' + 'breed: ' + mixBreeds + ' <img src="images/check.png" id="saveBreed"' +
                ' data-breed="' + mixBreeds + '" style="width: 20px">' + '<br>' + 'age: ' + profiles[i].age.$t +
                '<br>' + 'description: ' + profiles[i].description.$t + '<br>' + 'click to save profile ' +
                '<img src="images/check.png" id="saveProfile"' + ' data-name="' + profiles[i].name.$t + '" data-breed="' +
                mixBreeds + '" age= ' + profiles[i].age.$t + ' data-description="' + profiles[i].description.$t +
                '" style="width: 20px">' + '</p>');
        }
    }

    // GET request for saved profiles in db
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

                $('#savedProfiles').append('<p class="profile">' + '<a href="#" class="savedProfiles" data-type="text" data-pk=' + id + ' data-url="/profiles">' + '</a>' + 'name: ' + name + '<br>' + 'breed: ' +
                    breed + '<br>' + 'age: ' + data[i].age + '<br>' + 'description: ' + description + '<br>' + 'Delete Profile: ' + '<img src="images/clear.png" id="deleteProfile" style="width: 25px">' + '<br>' + '</p>');
            }
            // removes saved profiles on Saved Dog Profiles
            $('#savedProfiles').on('click', '#deleteProfile', function() {
                $(this).closest('.profile').remove();
                $.ajax({
                    url: 'http://localhost:8080/profiles/' + $(this).siblings('a').attr('data-pk'),
                    type: 'delete',
                });
            });
        }
    });
    /*~~~~~~~~ Saved Breeds ~~~~~~~~*/

    function displaySavedBreeds(data) {
        for (i = 0; i < data.length; i++) {
            var breed = data[i].name.replace(/-/g, " ");
            var id = data[i]._id;
            $('#savedBreeds').append('<p class="breed">' + '<a href="#" class="savedBreeds" data-type="text" data-pk=' + id + ' data-url="/breeds">' + breed + '</a>' + '<img src="images/clear.png" id="deleteBreed" style="width: 25px">' + '</p>');
        }
        // Click to remove breeds from saved list
        $('#savedBreeds').on('click', '#deleteBreed', function() {
            $(this).closest('.breed').remove();
            $.ajax({
                url: 'http://localhost:8080/breeds/' + $(this).siblings('a').attr('data-pk'),
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
            var name = data[i].name;
            var address = data[i].address;
            var email = data[i].email;
            $('#savedShelters').append('<p class="shelter">' +
                '<a href="#" class="savedShelters" data-type="text" data-pk=' + id +
                ' data-url="/shelters">' + name + '<br>' + address + '<br>' + email + '</a>' +
                '<img src="images/clear.png" id="deleteShelter" style="width: 25px">' + '</p>');
        }
        // Click to remove breeds from saved list
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
                        '<br>' + address + '<br>' + email + '<img src="images/check.png" id="saveShelter" name= ' + name + ' address= ' + address + ' email= ' + email +
                        ' style="width: 20px">' + '</p>');
                }
            },
            contentType: 'application/json',
        });
        cleanSearch();
        $('#search-local').val('');
    });
    $('#searchShelters').on('click', '#saveShelter', function() {
        var name = $(this).attr('name');
        var address = $(this).attr('address');
        var email = $(this).attr('email');
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