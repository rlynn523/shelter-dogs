$(function() {
    // $.fn.editable.defaults.mode = 'inline';
    var key = '?key=781bec9e50bf85caa863d233753cf237';
    var dog = '&animal=dog';
    var location = '&location=pittsburgh,pa';
    var format = '&format=json';
    var petFind = 'http://api.petfinder.com/pet.find';

    $.ajax({
        url: petFind + key + dog + location + format,
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
            displayDogProfiles(data.petfinder.pets.pet);
            console.log('get pets');
        }
    });

    function displayDogProfiles(profiles) {
        var input = $('#searchBar').val();
        for (i = 0; i < profiles.length; i++) {
            var breed = profiles[i].breeds.breed.$t;
            if (input == breed) {
                console.log('found search term');
                $('#results').append('<p class="profile">' + 'name: ' + profiles[i].name.$t + '<br>' + 'breed: ' +
                    profiles[i].breeds.breed.$t + '<br>' + 'age: ' + profiles[i].age.$t + '<br>' + 'description: ' + profiles[i].description.$t +
                    '<br>' + 'click to save profile ' + '<img src="images/check.png" id="saveProfile" style="width: 20px">' + '</p>');
            }
        }
        $('#results').on('click', '#saveProfile', function() {
            console.log('click check');
            for (i = 0; i < profiles.length; i++) {
                $.ajax({
                    url: 'http://localhost:8080/profiles',
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({
                        name: profiles[i].name.$t,
                        breed: profiles[i].breeds.breed.$t,
                        age: profiles[i].age.$t,
                        description: profiles[i].description.$t
                    }),
                    contentType: 'application/json',
                });
            }
        });
        $('#searchBar').keydown(function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                displayDogProfiles(profiles);
                console.log('enter button');
                $('#searchBar').val('');
            }
        });
        $('#search').submit(function(e) {
            e.preventDefault();
            console.log('submit button');
            var input = $('#searchBar').val();
            if (input === '') {
                alert('Please Search A Breed!');
            } else {
                displayDogProfiles(profiles);
            }
            $('#searchBar').val('');
        });
    }
    // GET request for saved profiles in db
    $.ajax({
        url: 'http://localhost:8080/profiles',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            // displays saved breeds on Saved Breeds
            for (i = 0; i < data.length; i++) {
                var id = data[i]._id;
                $('#savedProfiles').append('<p class="profile">' + 'name: ' + data[i].name + '<br>' + 'breed: ' +
                    data[i].breed + '<br>' + 'age: ' + data[i].age + '<br>' + 'description: ' + data[i].description + '<br>' + 'Delete Profile: ' + '<img src="images/clear.png" id="deleteProfile" style="width: 25px">' + '<br>' + '</p>');
            }
            $('#savedProfiles').on('click', '#deleteProfile', function() {
                $(this).closest('.profile').remove();
                $.ajax({
                    url: 'http://localhost:8080/profiles/' + id,
                    type: 'delete',
                });
            });
        },
    });
});
// /*~~~~~~~~ Saved Breeds ~~~~~~~~*/
//
// function displaySavedBreeds(data) {
//     for (i = 0; i < data.length; i++) {
//         var breed = data[i].name;
//         var id = data[i]._id;
//         $('#savedBreeds').append('<p class="breed">' + '<a href="#" class="savedBreeds" data-type="text" data-pk=' + id + ' data-url="/breeds">' + breed + '</a>' + '<img src="images/clear.png" id="deleteBreed" style="width: 25px">' + '</p>');
//     }
//     // Click to remove breeds from saved list
//     $('#savedBreeds').on('click', '#deleteBreed', function() {
//         $(this).closest('.breed').remove();
//         $.ajax({
//             url: 'http://api.petfinder.com/' + id,
//             type: 'delete',
//         });
//     });
//     $('.savedBreeds').editable({
//         ajaxOptions: {
//             dataType: 'json',
//             contentType: 'application/json',
//         },
//         params: function(params) {
//             return JSON.stringify(params);
//         },
//     });
// }
// // Click submit button to post new breed to database and append to Saved Breeds List
// $('#breeds-form').submit(function(e) {
//     e.preventDefault();
//     var input = $('#save-breeds').val();
//     $.ajax({
//         url: 'http://localhost:8080/breeds',
//         type: 'post',
//         data: JSON.stringify({
//             name: input
//         }),
//         dataType: 'json',
//         contentType: 'application/json',
//     });
//     $('#savedBreeds').append('<p>' + input + '</p>');
//     $('#save-breeds').val('');
// });
// /*~~~~~~~~ Saved Shelters ~~~~~~~~*/
//
// function displaySavedShelters(data) {
//     for (i = 0; i < data.length; i++) {
//         var id = data[i]._id;
//         var shelter = data[i].name;
//         $('#savedShelters').append('<p class="shelter">' + '<a href="#" class="savedShelters" data-type="text" data-pk=' + id + ' data-url="/shelters">' + shelter + '</a>' + '<img src="images/clear.png" id="deleteShelter" style="width: 25px">' + '</p>');
//     }
//     // Click to remove breeds from saved list
//     $('#savedShelters').on('click', '#deleteShelter', function() {
//         $(this).closest('.shelter').remove();
//         $.ajax({
//             url: 'http://localhost:8080/shelters/' + id,
//             type: 'delete',
//         });
//     });
//     $('.savedShelters').editable({
//         ajaxOptions: {
//             dataType: 'json',
//             contentType: 'application/json',
//         },
//         params: function(params) {
//             return JSON.stringify(params);
//         },
//     });
// }
// $('#shelters-form').submit(function(e) {
//     e.preventDefault();
//     var input = $('#save-shelters').val();
//     $.ajax({
//         url: 'http://localhost:8080/shelters',
//         type: 'post',
//         data: JSON.stringify({
//             name: input
//         }),
//         dataType: 'json',
//         contentType: 'application/json',
//     });
//     $('#savedShelters').append('<p>' + input + '</p>');
//     $('#save-shelters').val('');
// });

/*~~~~~~~~ GET Requests ~~~~~~~~*/

// GET request for saved breeds in db
// $.ajax({
//     url: 'http://localhost:8080/breeds',
//     type: 'get',
//     dataType: 'json',
//     success: function(data) {
//         // displays saved breeds on Saved Breeds
//         displaySavedBreeds(data);
//     },
// });
// GET request for saved shelters in db
// $.ajax({
//     url: 'http://localhost:8080/shelters',
//     type: 'get',
//     dataType: 'json',
//     success: function(data) {
//         // displays saved shelters on Saved Shelters
//         displaySavedShelters(data);
//     },
// });
