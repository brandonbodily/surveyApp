// controller.js:
angular.module('SurveyApp').controller('MainController', ['$scope', 'Service', function ($scope, Service) {

  //$scope.messages = [];

  $scope.surveys = [];


  $scope.options = [
    {
      in: '',
      votes: 0
    },
    {
      in: '',
      votes: 0
    }];

  $scope.questionsVotedOn = [];
  $scope.previousAnswer = "NONE";

    $scope.addOption = function() {
      var dataObj = {in:'', votes:0};
      $scope.options.push(dataObj);
    };

    $scope.createSurvey = function () {
      var survey = {};
      survey.question = $scope.question;
      survey.options = $scope.options;
      $scope.surveys.push(survey);
      $scope.sendMessage();
    };


    $scope.optionClicked = function (options, option, question) {
      // find if a survey is already answered and what the answer was to decriment pervious voted value
      var surveyAlreadyAnswered = false;
      var previousVotedOption = null;
      console.log(question);
      for (q in $scope.questionsVotedOn) {
        if ($scope.questionsVotedOn[q] == question) {
          console.log("Question Already Answered");
          surveyAlreadyAnswered = true;
          console.log("previous voted answer: ",$scope.previousAnswer);
        }
      }


      

      for (i in options) {
        if (options[i].in != option) {
          //console.log("NOT SELECTED:",options[i].in);
          document.getElementById(options[i].in).setAttribute("style", $scope.notActivecss);
        }
      }
      //console.log("options:",options);
      //console.log("option:",option);
      document.getElementById(option).setAttribute("style", $scope.activecss);
      //add vote to server
      for (s in $scope.surveys) 
      {
        if ($scope.surveys[s].options == options)
        {
          for (j in $scope.surveys[s].options) {
            if (surveyAlreadyAnswered == true) {
              if ($scope.surveys[s].options[j].in == $scope.previousAnswer) {
                $scope.surveys[s].options[j].votes--;
              }
            }
            if (option == $scope.surveys[s].options[j].in) {
                $scope.surveys[s].options[j].votes++;
              }
          }
        }
      }
      // see what local user votes and switch accordingly
      //if (surveyAlreadyAnswered == false) {
      //  $scope.votedSurvey.push(options);
      //  $scope.votedAnswer.push(option);
      //}
      $scope.previousAnswer = option;
      if (surveyAlreadyAnswered == false)
      {
        $scope.questionsVotedOn.push(question);
      }
      // update server
      $scope.sendMessage();
    }


  Service.onMessage(function (newSurveys) {
    $scope.surveys = JSON.parse(newSurveys);
    $scope.$apply();
  });

  $scope.sendMessage = function () {
    //update servers
    Service.sendMessage(JSON.stringify($scope.surveys));
  };


    $scope.activecss = "display:inline-block; margin: 10px; padding: 8px;border-radius: 2px;background: #3cb0fd;background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);background-image: -o-linear-gradient(top, #3cb0fd, #3498db);background-image: linear-gradient(bottom, #3cb0fd, #3498db);text-decoration: none;border: 4px solid #006981;text-decoration: none;border: 4px solid #006981;"
    $scope.notActivecss = "display:inline-block;\
    margin: 10px;\
    padding: 8px;\
    border: 2px solid #FFF;\
    border-radius: 5px;\
    background: #1d88a1;\
    background-image: -webkit-linear-gradient(top, #3498db, #2980b9);\
    background-image: -moz-linear-gradient(top, #3498db, #2980b9);\
    background-image: -ms-linear-gradient(top, #3498db, #2980b9);\
    background-image: -o-linear-gradient(top, #3498db, #2980b9);\
    background-image: linear-gradient(to bottom, #3498db, #2980b9);"


}]);

