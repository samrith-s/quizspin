var scorm = pipwerks.SCORM;
var lmsConnected = false;

function initCourse(min, max){
   //scorm.init returns a boolean
   lmsConnected = scorm.init();
   //If the scorm.init function succeeded...
   if(lmsConnected){
      //Now let's get the username from the LMS
      var learnername = scorm.get("cmi.core.student_name");
      scorm.set('cmi.score.min', min);
      scorm.set('cmi.score.max', max);
      //If the name was successfully retrieved...
      if(learnername){  
         //...let's display the username in a page element named "learnername"
         document.getElementById("learnername").innerHTML = learnername; //use the name in the form
      }
   //If the course couldn't connect to the LMS for some reason...
   } else {
      //... let's alert the user then close the window.
      handleError("Error: Course could not connect with the LMS");
   }
};
initCourse(0, 100);

function setScore(score) {
  console.log('score is ',score);
  scorm.set('cmi.core.score.raw', score);
  scorm.save();
};

function handleError(error) {
  console.error(error);
};

function setComplete(){
    scorm.set('cmi.core.lesson_status','completed');
    scorm.save();
}
