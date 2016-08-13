$(function() {
    // $.fn.editable.defaults.mode = 'inline';
    var petFind = 'http://api.petfinder.com/pet.find';
    var key = '?key=781bec9e50bf85caa863d233753cf237';
    var dog = '&animal=dog';
    var location = '&location=';
    var format = '&format=json';

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
        var searchInput = '&breed='+$('#searchBar').val();
        var searchLocation = $('#searchLocation').val();
        if (searchInput === '') {
            alert('Please Enter Search Parameters!');
        } else {
            $.ajax({
                url: petFind + key + dog + location + searchLocation + format +searchInput,
                type: 'get',
                dataType: 'jsonp',
                success: function(data) {
                    displayDogProfiles(data.petfinder.pets.pet);
                    console.log(data.petfinder.pets.pet);
                    $('#searchBar').val('');
                    $('#searchLocation').val('');
                    console.log('get pets');
                    $('#search-results').on('click', '#saveProfile', function() {
                        var profiles = data.petfinder.pets.pet;
                        var name = $(this).attr('name');
                        var breed = $(this).attr('breed');
                        var age = $(this).attr('age');
                        $(this).closest('.profile-info').add();
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
                    $('#search-results').on('click', '#saveBreed', function() {
                        var breed = $(this).attr('breed');
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
                }
            });
        }
    });

    function displayDogProfiles(profiles) {
        var searchInput = $('#searchBar').val();
        for (i = 0; i < profiles.length; i++) {
            let breeds = profiles[i].breeds.breed;
            let mixBreeds = "";
           if (Array.isArray(breeds)) {
               for (let i = 0; i < breeds.length; i++) {
                   mixBreeds += breeds[i].$t + ", ";
               }
           } else {
               mixBreeds = breeds.$t;
           }
                $('#search-results').append('<img src=' + profiles[i].media.photos.photo[i].$t +
                    ' width=250>' + '</img>' + '<p class="profile-info">' + ' name: ' + profiles[i].name.$t +
                    '<br>' + 'breed: ' + mixBreeds + ' <img src="images/check.png" id="saveBreed"' +
                    ' breed= ' + profiles[i].breeds.breed.$t + ' style="width: 20px">' + '<br>' + 'age: ' + profiles[i].age.$t +
                    '<br>' + 'description: ' + profiles[i].description.$t + '<br>' + 'click to save profile ' +
                    '<img src="images/check.png" id="saveProfile"' + ' name= ' + profiles[i].name.$t + ' breed= ' +
                    profiles[i].breeds.breed.$t + ' age= ' + profiles[i].age.$t + ' description= ' + profiles[i].description.$t +
                    ' style="width: 20px">' + '</p>');
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
    $('#local-form').submit(function(e) {
        e.preventDefault();
        var input = $('#search-local').val();
        $.ajax({
            url: 'http://api.petfinder.com/shelter.find?key=781bec9e50bf85caa863d233753cf237&location='+input+'&format=json',
            type: 'get',
            dataType: 'jsonp',
            success: function(data) {
                for (i = 0; i < data.petfinder.shelters.shelter.length; i++) {
                    $('#searchShelters').append(data.petfinder.shelters.shelter[i].name.$t + '<br>');
                }
            },
            contentType: 'application/json',
        });
        $('#search-local').val('');
    });
    // $.ajax({
    //     url: 'http://api.petfinder.com/breed.list?key=781bec9e50bf85caa863d233753cf237&animal=dog&format=json',
    //     type: 'get',
    //     dataType: 'jsonp',
    //     contentType: 'application/json',
    //     success: function(data) {
    //         for (i = 0; i < data.petfinder.breeds.length; i++) {
    //             var breeds = data.petfinder.breeds.breed[i].$t;
    //             console.log(breeds);
    //         }
    //     }
    // });


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
