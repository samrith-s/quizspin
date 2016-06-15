var scorm = pipwerks.SCORM;
var lmsConnected = false;

function initCourse(min, max){
   //scorm.init returns a boolean
   lmsConnected = scorm.init();
   //If the scorm.init function succeeded...
   if(lmsConnected){
      //Now let's get the username from the LMS
      scorm.set('cmi.core.score.min', min);
      scorm.set('cmi.core.score.max', max);
      var isCompleted = (scorm.get('cmi.core.lesson_status') == 'passed');
      if (!isCompleted) {
        scorm.set('cmi.core.lesson_status','failed');
      }      
    } else {
      //... let's alert the user then close the window.
      handleError("Error: Course could not connect with the LMS");
   }
};
initCourse(0, 100);

function setScore(score) {
  scorm.set('cmi.core.score.raw', score);
  scorm.save();
};

function handleError(error) {
  console.error(error);
};

function setComplete(){    
    scorm.set('cmi.core.lesson_status','passed');
    scorm.save();
}

function userTotalQuestion(value){
  scorm.set('cmi.objectives.n.score.raw',value)
  scorm.save()
}

