var scorm = pipwerks.SCORM;
var lmsConnected = false;

function initCourse(min, max){
   //scorm.init returns a boolean
   lmsConnected = scorm.init();
   //If the scorm.init function succeeded...
   if(lmsConnected){
      //Now let's get the username from the LMS
      scorm.set('cmi.score.min', min);
      scorm.set('cmi.score.max', max);
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
