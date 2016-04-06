var quiz;

config.quiz = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        {name: "statement-area", states: [
            {name: "default", representation: ""}
        ]},
        {name: "options", states: [
            {name: "default", representation: ""}
        ]},
        {name: "knowmore", states: [
            {name: "default", representation: "<img /><span>Know More</span>"}
        ]}
    ]
};

function initQuiz() {
    quiz = new Environment("quiz");
    loadConfig(quiz);
    loadQuestionBank();
}

function loadQuestionBank() {
    for (var i in questionbank.questions) {
        var q = questionbank.questions[i];
        var opts = ["a", "b", "c", "d"];
        var optsz = ["", "correct", "points"];
        var options = [];
        var optiones = {};
        for (var i = 0; i < opts.length; i++) {
            var temp1 = "opt" + opts[i] + optsz[0];
            var temp2 = "opt" + opts[i] + optsz[1];
            var temp3 = "opt" + opts[i] + optsz[2];
            optiones.option = i + 1;
            optiones.name = q[temp1];
            optiones.correct = q[temp2];
            optiones.points = q[temp3];
            options.push(optiones);
            optiones = {}
        }
        new Question(q.statement, q.image, q.weight, q.topic, options, q.help, q.slide_id, q.id);
    }
    return true;
}


var Question = Fiber.extend(function () {
    return {
        init: function (name, image, weight, topic, options, help) {
            this.name = name;
            this.image = image;
            this.weight = weight || 1;
            this.topic = topic;
            this.options = options;
            this.help = help;
            Question.all.push(this);
            log.add('Question: ' + name + ' created')
        },
        checkAnswer: function (id, option) {
            var thisAnswer = $.grep(this.options, function (a) {
                return ( a == option );
            })[0];
            return {optionId: id, correct: thisAnswer.correct, weight: this.weight, points: thisAnswer.points, help: this.help}
        }
    }
});

Question.all = [];

Question.getByWeight = function (weight) {
    var questions = $.grep(Question.all, function (a) {
        return ( a.weight == weight );
    });
    return questions[randBetween(0, questions.length - 1)]
};

Question.getAllByWeight = function(weight) {
    var questions = $.grep(Question.all, function(a) {
        return (a.weight == weight);
    });
    console.log(questions);
    return questions;
}

/**
 * Returns a number of questions(specified by the count argument) from each topic
 */
Question.getTopicWiseRandomQuestions = function(count) {
  var topicCounts = {};
  var allQuestions = [];
  shuffle(Question.all).forEach(function(question) {
    if (!question || !question.topic) {
      return;
    }
    var topic = question.topic;
    if (!topicCounts[topic] && count >= 1) {
      topicCounts[topic] = 1;
      allQuestions.push(question);
    }
    else if(topicCounts[topic] < count) {
      //add the question to the topic lookup only if there's more than count questions of the topic
      topicCounts[topic]++;
      allQuestions.push(question);
    }
  });
  return allQuestions;
}

Question.showQuizPanel = function (obj, question) {
    $('#statement-area').html(question.name);
    $('#options').empty().append("<ul></ul>");
    if(question.image != null){
        $('#question-image').empty().html("<img src='" + question.image + "' />");
    }
    for (var i in question.options) {
        $('#options ul').append('<li class="option-block" id="option-block-' + i + '">' + question.options[i].name + '</li>');
    }
    $('.option-block').unbind('click').on('click', function () {
        $this = $(this);
        $(question).trigger("answered", [question.checkAnswer($this.attr('id'),question.options[parseInt($this.attr("id").split("option-block-")[1])])]);
    });
};


