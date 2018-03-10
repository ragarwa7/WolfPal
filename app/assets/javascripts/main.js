/*
* The structure of chat bot is reference form "tscok"
* code( http://jsfiddle.net/tscok/0jyu98L2/ )
*/

var Chat = function() {
    //var dataSearch = new DataSearch();
    var messages = {};
    var topic = "";//input switch
    var subject = ""; //execute on "other" topic
    var profile = {};
    var dataSearch = {};
    var recommend = {};

    /* var request = new XMLHttpRequest();
     request.open("GET", "data/profile.json", false);
     request.send(null);
     var yourDataStr = JSON.stringify(request.responseText)*/


    function loadJSON() {

        var xobj = new XMLHttpRequest();
        //xobj.overrideMimeType("application/json");
        xobj.open('GET', 'assets/profile.json'); // Replace 'my_data' with the path to your file
        //alert(xobj.onreadystatechange);
        xobj.responseType = 'json';
        xobj.send();
        xobj.onreadystatechange = (profile = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                profile = xobj.response;
                //alert('hey: ' + profile.ugg.question);
                return profile;
                //callback(xobj.responseText);
            }
        });
        //fetch('assets/profile.json').then(function(response){
        //  alert(response);
        //  profile = JSON.parse(response);
        //  alert(profile.ugg.question);
        //});

        //var jsondata = JSON.parse(profile);
        //alert('profile: ' + profile);
    }

    function outputButton(text, id, delay){
        var delay = delay || 0;
        var b = document.createElement('BUTTON');
        b.appendChild(document.createTextNode(text));
        b.className = 'button';
        b.setAttribute("id", id);
        b.setAttribute("onClick", "Chat.pressedButton(this.id)");
        setTimeout(function(){
            messages.appendChild(b);
            var objDiv = document.getElementById("chatText");
            objDiv.scrollTop = objDiv.scrollHeight;
        },delay);
    }

    function pressedButton(id){
        //alert("Button pressed: " + document.getElementById(id).innerHTML);
        document.getElementsByName("input")[0].setAttribute("contenteditable", "true");
        topic = id;
        switch(topic){
            case "suggest_course":
                getAoI();
                break;
            case "course_detail":
                getCourse();
                break;
        }
    }

    function output(text, bot, delay) {
        var bot = bot || false;
        var delay = delay || 0;
        var message = document.createElement('div');
        message.className = bot ? 'message bot' : 'message';
        message.innerHTML = text;

        //animate
        setTimeout(function(){
            messages.appendChild(message);
            var objDiv = document.getElementById("chatText");
            objDiv.scrollTop = objDiv.scrollHeight;
        }, delay);
    }

    function input(evt) {
        switch (evt.which) {
            case 13:
                evt.preventDefault();
                output(evt.target.innerHTML, false);
                handleInput(evt.target.innerHTML);
                evt.target.innerHTML = '';
                break;
        }
    }

    function handleInput(input) {
        input = input.toLowerCase();
        console.log(input);
        switch(topic){
            case "ugg":
                if ( input>=0 && input<=5)
                    profile.ugg.answer = input;
                else
                    output("Number must between 0 and 5.", true);
                break;
            case "project":
                if (input>=0 && input<=5) {
                    profile.project.answer = input;
                    recommend.setProfile(profile.interest.answer, profile.ugg.answer, profile.project.answer);
                }
                else
                    output("Number must between 0 and 5.", true);
                break;
            case "suggest_course":
                suggestion(input);
                break;
            case "course_detail":
                console.log(input);
                input = input.charAt(0).toUpperCase() + input.slice(1);
                console.log(input);
                var str = input;
                while(str.indexOf(' ') >=0){
                    var i = str.indexOf(' ');
                    str = str.charAt(i+1).toUpperCase() + str.slice(i+2);
                    input = input.substring(0, i+1) + str;
                }
                console.log(input);
                detail(input);
                break;
        }
        talk();
    }

    function talk() {
        if (profile.ugg.answer === ""){
            topic = "ugg";
            requiredUgg();
        }
        else if (profile.project.answer === ""){
            topic = "project";
            requiredPro();
        }
        else {
            topic = "other";
            setTimeout(function(){
                other();
            }, 1000);
        }
    }

    function other() {
        //output("Type \"suggest + subject\" for suggest courses based on the subject, " +
        //    "or type \"course_name\" to get course detail.", true, 500);
        //    sleep(1000);
        //}
        document.getElementsByName("input")[0].setAttribute("contenteditable", "false");
        output("Pick one category below in which you need help", 500);
        outputButton("Suggest Course", "suggest_course",500);
        outputButton("Course Detail", "course_detail",500);
    }

    function requiredInt() {
        var question = profile.interest.question;
        output(question, true, 500);
    }

    function requiredUgg() {
        var question = profile.ugg.question;
        output(question, true, 500);
    }

    function requiredPro() {
        var question = profile.project.question;
        output(question, true, 500);
    }

    function getSubject(input){
        //let subject = "";
        if (input.includes("data science"))
            subject = "data science";
        else if (input.includes("software engineering"))
            subject = "software engineering";
        else if (input.includes("algorithm"))
            subject = "algorithm";
        else if (input.includes("application"))
            subject = "application";
        else if (input.includes("system"))
            subject = "system";
        else if (input.includes("software security"))
            subject = "software security";
    }

    function suggestion(input) {
        getSubject(input);

        if (subject !== "") {
            //output("The courses related to " + subject + " is: " , true);
            //output( dataSearch.makeCourseList_name(subject) , true);
            //setTimeout(function(){
            output("Top 4 recommendations for you is: ", true, 500);
            let print = recommend.makeRecommend(subject);
            for (let p of print) {
                output(p, true, 550);
            }
            //}, 500);
        }
        else
            output("Sorry, can't find courses related to this subject.", true, 500);
    }

    function detail(input) {
        var courseId = dataSearch.getCourseId(input);
        var courseAverage = (courseId === -1) ? -1 : dataSearch.getCourseAverage(courseId);
        var string = "Average grade of " + input + " as per last years data is " + courseAverage;
        output( string , true, 500);
    }

    function getCourse(){
        output("Can you tell me the course name?", true, 500);
    }

    function getAoI(){
        output("Can you tell me your area of interest?", true, 500);
    }

    function sleep(ms){
        var start_time = new Date().getTime();
        while((new Date().getTime() - start_time) < ms);
    }

    function init() {
        output('Hey pal, I can help you with course selection, if you tell me a bit about yourself.', true);
        messages = document.querySelector('.messages');
        //alert("messages: " + messages);
        setTimeout(function(){
          loadJSON();
          setTimeout(function(){
            recommend = new Recommend();
            dataSearch = new DataSearch();
          }, 250);
          //alert('main:r: ' + recommend);
          //alert("profile later: " + profile);
          setTimeout(function(){
            //alert('main:d: ' + dataSearch);
            talk();
          }, 2000);
        }, 0);
        //talk();

    }

    return {
        init: init,
        input: input,
        pressedButton: pressedButton
    }

}();

function myfun(){
  setTimeout(function(){
      Chat.init();
      //alert('myfun done');
  },500);
}

myfun();
