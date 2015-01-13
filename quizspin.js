    window.user = {};
    user.credits = 205;

    window.theme ={};
    theme.gamelogo="/gameassets/quizspin/menubtns/gamelogo.jpg";
    theme.background="/gameassets/quizspin/background.jpg";
    theme.src="/gameassets/quizspin/icons/";
    theme.qmark="qmark.png";
    theme.bonus="bonus.png";
    theme.iconback="/gameassets/quizspin/singleslotBack.jpg";
    theme.icons=["explorer.png","backpack.png","scuba.png","surf.png","mountaineer.png"];
    theme.credits_name="Geocoins";


    window.game = {};
    game.winners = [
        /* Logic = [icon, count, payoff]*/
        [3, 3, 60],
        [3, 2, 30],
        [3, 1, 15],
        [4, 3, 50],
        [4, 2, 25],
        [4, 1, 10],
        [5, 3, 40],
        [5, 2, 20],
        [6, 3, 30],
        [6, 2, 15],
        [7, 3, 20],
        [7, 2, 10]
    ];
    game.spincost = 10;

    var credits = user.credits + 10;
    var won = false;
    var freespins = 0;
    var freespinning = false;
    var freespinTotal = 0;
    var winnings;
    var winners = game.winners;
    var spinsound = document.getElementById('spinner-sound');

    function bindMenu() {
        $('#introBtn').on('click', function () {
            $('.menuBtn').removeClass('activeBtn');
            $('.content-panel').hide();
            $('#intro-panel').fadeIn();
            $('#introBtn').addClass('activeBtn');
        });
        $('#leaderboardBtn').on('click', function () {
            $('.menuBtn').removeClass('activeBtn');
            $('.content-panel').hide();
            $('#leaderboard-panel').fadeIn();
            $('#leaderboardBtn').addClass('activeBtn');
        });
        $('#payoffBtn').on('click', function () {
            $('.menuBtn').removeClass('activeBtn');
            $('.content-panel').hide();
            $('#payoff-panel').fadeIn();
            $('#payoffBtn').addClass('activeBtn');
        });
        $('#profileBtn').on('click', function () {
            $('.menuBtn').removeClass('activeBtn');
            $('.content-panel').hide();
            $('#profile-panel').fadeIn();
            $('#profileBtn').addClass('activeBtn');
        });
    }
    function flickSpinclick() {
        $('#spinclick').fadeIn(100, function () {
            setTimeout(function () {
                $('#spinclick').fadeOut(1000);
            }, 4000);
        });
    }
    function resetHandle() {
        $('#slot-handle').animate({
            left: 0
        }, 5).css({
            'pointer-events': 'auto'
        });
    }
    function freespinIt() {
        $('#slot-handle').animate({
            left: 0
        }, 5);
        freespins -= 1;
        setTimeout(function () {
            $('#slot-handle').trigger('click');
            $('#freespin-count').html(freespins);
        }, 1000);
    }
    function getWinnings(finalNumbers) {
        $.each(finalNumbers, function (index, element) {
            if (parseInt(element) > 7) {
                finalNumbers[index] = parseInt(element) - 3;
            }
        });
        var finalArray = [];
        finalArray[0] = finalNumbers[0];
        finalArray[1] = 1;
        if (finalNumbers[0] == finalNumbers[1]) {
            finalArray[1] = 2;
            if (finalNumbers[0] == finalNumbers[2]) {
                finalArray[1] = 3;
            }
        }
        return checkWinner(finalArray);
    }
    function showFreeSpins(spinCount) {
        $('#answer-menu').fadeOut(function () {
            $('#freespin-count').html(freespins);
            $('#freespin-counter').fadeIn();
        });
    }
    function winnerAnim(creditsValue, winningValue) {
        resetHandle();
        showScore(winningValue);
    }
    function startSlots() {
        $('#slot-handle').animate({
            left: "-585px"
        }, 20);
        $('.slots').removeClass('winner');
        if (!freespinning) {
            $('#scoring').css({
                marginTop: "0px",
                fontSize: "50px",
                opacity: 1
            });
            updateCredits(game.spincost, "debit");
            $('.questioner').attr('src', theme.src + theme.qmark);
        } else {
            $('.questioner').attr('src', theme.src + theme.bonus);
        }
        if ($('#payoffBtn.activeBtn').length == 0) {
            $('#payoffBtn').trigger("click");
        }
    }
    function endSlots(finalNumbers) {
        if (freespinning) {
            setTimeout(function () {
                winnings = getWinnings(finalNumbers);
                freespinTotal += winnings;
                if (winnings > 0) {
                    $('#free-earnings').append(" +" + winnings);
                }
                if (freespins > 0) {
                    freespinIt();
                } else {
                    setTimeout(function () {
                        freespinning = false;
                        resetHandle();
                        endFreeSpins();
                    }, 1000);
                }
            }, 500);
        } else {
            $('#payoffTable').fadeOut();
            endNormal(finalNumbers);
        }
    }
    function winSlots(winCount, winners) {
        won = true;
        $.each(winners, function () {
            this.addClass('winner');
        });
        if (freespinning) {
            freespinTotal += winCount * 25;
            if (winCount > 0) {
                $('#free-earnings').append(" <span style='color:gold'>+" + winCount * 50 + "</span>");
            }
        } else {
            $('#slot-handle').css({
                'pointer-events': 'none'
            });
            getQuestion(winCount);
        }
    }

    function getQuestion(difficulty) {
        var actualDifficulty = "";
        switch((difficulty-1)){
            case 0:
                actualDifficulty="Easy";
                break;
            case 1:
                actualDifficulty="Normal";
                break;
            case 2:
                actualDifficulty="Difficult";
                break;
        }
        var list = _.where(quiz.questions,{difficulty:actualDifficulty});
        var elemlength = list.length;
        var randomnum = Math.floor(Math.random() * elemlength);
        var data = quiz.questions[randomnum];
        setTimeout(function () {
            $('#payoff-panel').fadeOut();
            $('#quiz-panel').fadeIn();
            $('#standard-menu').fadeOut(function () {
                $('#answer-menu').fadeIn();
            });
            $('#quiz-content').fadeIn();
            $('#qquestion').html(data.name);
	    $('#qquestion').css("width","90%");
            $('#qid').html(randomnum);
            $('#optax').html('<div class="answer-bullet" id="bulletA">A</div>' + data.opta);
            $('#optbx').html('<div class="answer-bullet" id="bulletB">B</div>' + data.optb);
            $('#optcx').html('<div class="answer-bullet" id="bulletC">C</div>' + data.optc);
            $('#optdx').html('<div class="answer-bullet" id="bulletD">D</div>' + data.optd);
            $('#learnlink').attr("template-id",data.slide_id)
            //$(".image-for-question").attr("src",data.image_url);
           // $(".question-image").show()
            $('#answerBlock').fadeIn();
        }, 1000);
    }

    function PlaySound(soundobj) {
        var thissound = document.getElementById(soundobj);
        $('#' + soundobj).stop();
        thissound.volume = 1;
        thissound.play();
        $('#' + soundobj).animate({volume: 0.1}, 8000, function () {
            thissound.volume = 1;
        });
    }

    function StopSound(soundobj) {
        var thissound = document.getElementById(soundobj);
        thissound.pause();
        thissound.currentTime = 0;
    }

    function initializeSlots() {
        $('.slots').jSlots({
            number: 3,
            winnerNumber: [1, 2],
            spinner: '#slot-handle',
            easing: 'easeOutSine',
            time: 4000,
            loops: 10,
            onStart: function () {
                PlaySound('cranker');
                setTimeout(function () {
                    PlaySound('spinner-sound');
                }, 400);
                startSlots();
            },
            onEnd: function (finalNumbers) {
                StopSound('spinner-sound');
                endSlots(finalNumbers);
            },
            onWin: function (winCount, winners) {
                winSlots(winCount, winners);
            }
        });
    }

    function processAnswers(answer) {
        data = getAnswer($('#qid').html(), answer);
        var resultMsg = data.split('||')[1];
        var correctAnswer = data.split('||')[2];
        freespins = parseInt(data.split('||')[0]);
        showResult(resultMsg, correctAnswer, freespins);
        setTimeout(function () {
            if (parseInt(freespins) > 0) {
                freespinning = true;
                showFreeSpins(freespins);
                setTimeout(function () {
                    freespinIt();
                }, 1000);
            } else {
                $('#scoring-panel').fadeOut('slow');
                $('#payoff-panel').fadeIn();
                $('#answer-menu').fadeOut(function () {
                    $('#standard-menu').fadeIn();
                    resetHandle();
                });
                won = false;
            }
        }, 3000);
    }

    function bindAnswers() {
        $('.answerBtn').on('click', function () {
            processAnswers($(this).attr("id"));
        });
        $('.answer').on('click', function () {
            processAnswers($(this).attr("id").split("x")[0]);
        });
    }
    function checkWinner(pattern) {
        var winnings = 0;
        $.each(winners, function (index, element) {
            if (pattern[0] == element[0] && pattern[1] == element[1]) {
                winnings = element[2];
            }
        });
        return winnings;
    }
    function endNormal(finalNumbers) {
        winnings = getWinnings(finalNumbers);
        updateCredits(winnings, "credit");
        winnerAnim(credits, winnings);
        setTimeout(function () {
            if (!won) {
                flickSpinclick();
                $('#payoff-panel').fadeIn('fast');
                $('#scoring-panel').fadeOut('slow');
            }
        }, 1000);

    }
    function showResult(resultMsg, correctAnswer, freespinsCount) {
        $('.content-panel').hide();
        $('#scoring-panel').fadeIn();
        $('#scoring').css({marginTop: "-50px"}).html("<div class='scribble'>" + resultMsg + "<br/>The correct answer is: <h3 style='color:gold;margin:0;padding:3px;'>" + correctAnswer + "</h3>You won </div>" + freespinsCount + " <div class='scribble'>free spins </div></div> ").delay(5000).animate({
            marginTop: "-100px",
            fontSize: "120px",
            opacity: 0
        }, function () {
            $('#scoring').html("<h3 style='margin:0;padding:0;color:gold'>Free Spins</h3><div class='small-scribble'> The machine will spin automatically " + freespinsCount + " times for free. Over and above the usual payoff, you will receive 25 " + theme.credits_name + " for each bonus block that appears. <h3>Earnings: <div id='free-earnings'></div></h3></div>").css({
                marginTop: "-50px",
                fontSize: "50px",
                opacity: 1
            })
        });

    }
    function endFreeSpins() {
        setTimeout(function () {
            $('#scoring').html("").css({
                marginTop: "0px",
                fontSize: "50px",
                opacity: 1
            });
            winnerAnim(credits, freespinTotal);
            updateCredits(freespinTotal, "credit");
            setTimeout(function () {
                $('#freespin-counter').fadeOut(function () {
                    $('#standard-menu').fadeIn();
                    $('#scoring-panel').fadeOut('slow');
                    $('#payoff-panel').fadeIn('fast');
                    freespinTotal = 0;
                    won = false;
                });
                flickSpinclick();
            }, 2000);
        }, 500);
    }
    function showScore(winningValue) {
        $('.content-panel').fadeOut('slow');
        $('#scoring-panel').fadeIn('fast');
        $('#scoring').html("<div class='scribble'>You won</div>" + winningValue + "<div class='scribble'>" + theme.credits_name + "</div>").delay(1500).animate({
            marginTop: "-50px",
            fontSize: "120px",
            opacity: 0
        }, function () {
            if (!won) {
                $('#scoring-panel').fadeOut('slow');
                $('#payoff-panel').fadeIn('fast');
            }
            $('#scoring').html("").css({
                marginTop: "0px",
                fontSize: "50px",
                opacity: 1
            })
        });

    }

    function updateCredits(payoff, txn) {
        var cTo = (txn == "debit" ? -1 : 1);
        user.credits = (txn == "debit" ? (user.credits - payoff) : (user.credits + payoff));
        $('#creditsVal').countTo({
            from: parseInt(user.credits) - cTo * parseInt(payoff),
            to: parseInt(user.credits),
            speed: 1000,
            refreshInterval: 10
        });
        $('.leader-credits').html(user.credits);
    }

    function initializeTheme() {
        $('.questioner').attr("src", theme.src + theme.qmark);
        $('#gamelogo').attr("src", theme.gamelogo);
        for (i = 1; i < 6; i++) {
            $('.icon' + i).attr("src", theme.src + theme.icons[i - 1]);
        }
        $('body').css('background-image', "url(" + theme.background + ")");
        $('#creditsLabel').text(theme.credits_name);
        $('.slots li').css('background-image', "url(" + theme.iconback + ")");
    }



    quiz.questions = getQuestionsFromBank();
    initializeTheme();
    initializeSlots();
    bindAnswers();
    bindMenu();
    $('#creditsVal').countTo({
        from: 0,
        to: credits,
        speed: 1000,
        refreshInterval: 10
    });
    flickSpinclick()

