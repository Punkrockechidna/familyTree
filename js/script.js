//Adds event listener to the login form
window.onload = function() {
    //get profiles and index
    var profiles = getProfiles();

    // var profileIndex = findProfile(profiles);

    if (location.pathname.includes("index")) {  //If signup page
        const signSub = window.document.getElementById("signUpForm");
        signSub.addEventListener("submit", function(e) {
            e.preventDefault();
            signUpConf(profiles);
        })
        const loginSub = window.document.getElementById("loginForm");
        loginSub.addEventListener("submit", function(e) {
            e.preventDefault();

            loginPress();
        })
    } else if (location.pathname.includes("tree")) { //If home page
        if (sessionStorage.loggedIn !== "true") {
            alert("Need to log in to view page");
            window.location.href = "../html/index.html";
        } else {
            var profileIndex = findProfile(profiles);
            loadProfile();
            const profSave = window.document.getElementById("profileForm");
            profSave.addEventListener("submit", function(e) {
                e.preventDefault();
                saveProfile(profiles, profileIndex);
                //Adds click event to all add member options on tree
                Array.from("addMember").forEach(function(element) {
                    element.addEventListener('click', myFunction());
                });
            });
            var addMemberClick = document.getElementsByClassName("addMember");
            for (var i = 0; i < addMemberClick.length; i++) {
                addMemberClick[i].addEventListener('click', newFamilyProfile, false);
            }
            var ownerClick = document.getElementById("me");
            ownerClick.addEventListener('click', ownerActive, false);
        }
    }
}
// $('btn').click( function(e) {
//     $('.collapse').collapse('hide');
// });
function ownerActive() {
    $('.collapse').collapse('hide');
    // alert("clicked");
    window.sessionStorage.activeRelation = "me";
    $(".ownerProf").attr("hidden", false);
    loadProfile();
    $("#profileFieldSet").attr("disabled", true);
    $("#editButton").attr("hidden", false);
    $("#saveButton").attr("hidden", true);
}
function newFamilyProfile() {
    //sets active relation type
    window.sessionStorage.activeRelation = $(this).parent().parent().attr('id');
    //collapses all drop downs
    $('.collapse').collapse('hide');
    //Hides fields not used and shows save button    
    document.getElementById("profileForm").reset();
    $("#profileFieldSet").removeAttr("disabled");
    $(".ownerProf").attr("hidden", true);
    $("#editButton").attr("hidden", true);
    $("#saveButton").attr("hidden", false);
    //Shows relation at top
    $("#memberName").text(window.sessionStorage.activeRelation);

}
//Tree page scripts
function editProfile() {
    // document.getElementById("myProfileForm").disabled = false;
    $("#profileFieldSet").removeAttr("disabled");
    $("#saveButton").attr("hidden", false);
    $("#email").attr("disabled", true);
}
function saveProfile(profiles, profIndex) {
    var user = {
        email: $("#email").val(),
        id: profiles[profIndex].id,
        gender: $("#gender").val(),
        dob: $("#dOB").val(),
        firstName: $("#fName").val(),
        lastName: $("#lName").val(),
        password: $("#password").val(),
    };
    var confPass = $("#confPassword").val();
    if (confPass === user.password) {

        profiles[profIndex].firstName = user.firstName ? user.firstName : profiles[profIndex].firstName;
        profiles[profIndex].lastName = user.lastName ? user.lastName : profiles[profIndex].lastName;
        //  profiles[profIndex].email = user.email ? user.email :  profiles[profIndex].email;
        profiles[profIndex].gender = user.gender ? user.gender : profiles[profIndex].gender;
        profiles[profIndex].dob = user.dob ? user.dob : profiles[profIndex].dob;
        profiles[profIndex].password = user.password ? user.password : profiles[profIndex].password;
        //load profiles and then save them again
        localStorage.setItem("treeProfiles", JSON.stringify(profiles));
        alert("Saved!");
        loadProfile();
    } else {
        alert("Passwords must match exactly");
    }
}


function getProfiles() {//Returns profiles in local storage
    profiles = JSON.parse(window.localStorage.getItem("treeProfiles"));
    return profiles;
}
function findProfile(profiles) { //finds index of logged in profile
    if (profiles) {
        if (!sessionStorage.loggedIn) {
            for (let i = 0; i < profiles.length; i++) {
                if (profiles[i].email === document.forms["loginForm"]["logEmail"].value) {
                    sessionStorage.focusID = "00";
                    return i;
                }
            }
        }
        else {
            for (let i = 0; i < profiles.length; i++) {
                if (profiles[i].id === sessionStorage.focusID) {

                    return i;
                }
            }
        }
    } else {
        alert("No profiles exist yet, lucky you to be the first");
        signUpPress();

    }
}
var loadProfile = function() { //load profile currently logged in
    if (sessionStorage.activeRelation === "me") {
        var profiles = getProfiles();
        var profileIndex = findProfile(profiles);
        var profile = {
            firstName: profiles[profileIndex].firstName,
            lastName: profiles[profileIndex].lastName,
            email: profiles[profileIndex].email,
            dob: profiles[profileIndex].dob,
            gender: profiles[profileIndex].gender,
            password: profiles[profileIndex].password
        };

        let famName = profile.firstName + " " + profile.lastName;
        $("#memberName").text(famName);
        $("#fName").val(profile.firstName);
        $("#lName").val(profile.lastName);
        $("#email").val(profile.email);
        $("#gender").val(profile.gender);
        $("#dOB").val(profile.dob);
        $("#password").val(profile.password);
        // if(window.sessionStorage.focusID !== "00"){
        //     $(".ownerProf").attr("hidden",true);
        // }
    }
}
// Sign Up page functions

function signUpConf(profiles) {//Save information for the sign up to profiles
    emailStr = document.forms["signUpForm"]["signEmail"].value;
    var profile = {
        email: emailStr.toLowerCase(),
        id: "00",
        gender: "",
        dob: document.forms["signUpForm"]["dob"].value,
        password: document.forms["signUpForm"]["passwordS"].value,
        firstName: "",
        lastName: "",
        id: "00"
    };
    var confirmPassword = document.forms["signUpForm"]["confPassword"].value
    var profileExist = false;
    // Check password
    if (profile.password != confirmPassword) {
        alert("Password must be the same as Confirmation Password.");
    } else {
        if (!profiles) {
            profiles = [];
        }
        for (let i = 0; i < profiles.length; i++) {
            if (profile.email == profiles[i].email) {
                profileExist = true;
                break;
            }
        }
        if (profileExist === false) {
            // Store profile

            emailStr = document.forms["signUpForm"]["signEmail"].value;
            profiles.push(profile);
            localStorage.setItem("treeProfiles", JSON.stringify(profiles));
            sessionStorage.setItem("email", emailStr.toLowerCase());
            window.sessionStorage.focusID = "00";
            window.sessionStorage.loggedIn = true;
            window.location.href = "treePage.html";
        } else {
            alert("profile already exists!");
        }
        // return false;
    }
}
function hideSignUp() { //Hides the signUp section and shows the login section
    x = document.getElementById("signUpSect");
    x.style.visibility = "hidden"
    loginSect = document.getElementById("loginSect");
    loginSect.style.visibility = "visible";
}
//Login page functions

function signUpPress() { //Hides the login section and reveals the sign up section
    x = document.getElementById("signUpSect");
    x.style.visibility = "visible"
    loginSect = document.getElementById("loginSect");
    loginSect.style.visibility = "hidden";
}
function loginPress() {//Checks to see if already logged in,and if profile exists

    if (profiles) {
        var profileIndex = findProfile(profiles);
        sessionStorage.email = document.forms["loginForm"]["logEmail"].value;
    }
    if (profileIndex !== undefined && sessionStorage.loggedIn !== "true") {
        login(profiles[profileIndex]);
    } else if (profileIndex !== undefined && sessionStorage.loggedIn === "true") {
        alert("Already looged in");
        window.location.href = "../html/treePage.html";
    } else {
        alert("Username does not exist");
        signUpPress();
    }
}
var login = function(profiles) {//Checks if the username matches a known profile and password matches
    var user = {
        email: document.forms["loginForm"]["logEmail"].value,
        password: document.forms["loginForm"]["passwordL"].value
    }
    if (profiles.password == user.password) {
        window.sessionStorage.loggedIn = true;
        window.sessionStorage.email = user.email;
        window.sessionStorage.focusID = "00";
        //Popup that the user is valid
        alert("Valid User");
        window.location.href = "../html/treePage.html";
    } else {
        alert("Invalid Password");
    }
}




//path idea for family members     profiles.familyMember=[{parent:[{first:"lauri",last:"kaplan",dob:"10/29/1965",dod:"N?A"}]}]