﻿// var app = angular.module('Twitter', [ 'ui.router', 'datatables']);
var app = angular.module("chatbot", ['ui.router']);
var expire;
var warning;

 app.filter('unsafe', function ($sce) {
      return function (val) {
            return $sce.trustAsHtml(val);
      };
});
app.controller('fiscal-bot', function ($scope, $http, $state, CONSTANTS, $timeout,$location,$filter,$window) {
      $scope.url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/";
      console.log("URL:"+$scope.url);
      if($scope.url === undefined || $scope.url === ""){
            $scope.url = CONSTANTS.appEnv.apiUrl;
      }
     
      $(".regression-success-msg").removeClass("alert-success");

      // Conversation Service variables
      String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
      }
      $scope.currentUser = "";////sessionStorage['USER_NAME']
      $scope.displayName = "";//sessionStorage['LOGGEDIN_USER'];
      $scope.botOrgName = 'fiscal';//sessionStorage['ORG_NAME'];
      $scope.showDomain = 'false';//sessionStorage['SHOW_DOMAIN'];
      $scope.showAnswerId = 'false';//sessionStorage['SHOW_ANSWERID'];
      $scope.resolutionCount = 5;//parseInt(sessionStorage['RESOLUTIONCOUNT'], 10);
      $scope.rankerConfidenceThreshold = 0;//parseFloat(sessionStorage['rankerConfidenceThreshold']);

      $scope.workspaceId = "";
      $scope.username = '';
      $scope.password = '';
      $scope.isTyping = false;
      $scope.isTimeout = false;
      $scope.isFormDisplayed = false;
      $scope.selectedEnv = "";
      $scope.conversation = [];
      $scope.sessionexpire = [];
      $scope.contextVariables;
      $scope.entities = [];
      $scope.intents = [];
      $scope.listContextVariables = {};
      $scope.selType = "impl"
      $scope.responseContext = {};
      $scope.requestContext = {};
      $scope.recordData = [];
      $scope.xlsCount = 0;
      $scope.context = {};
      $scope.feedbackSelected = '';
      $scope.isComment = false;
      $scope.userSelectedType = "";
      $scope.questionAsked = "";
      $scope.noAnsFound = false;
      $scope.isNotFoundMsgShown = false;
      $scope.contextInput = {
            name: '',
            value: ''
      }

      $scope.contextVars = {};
      $scope.customerMessage = "";
      // Boolean variables
      $scope.isRecording = false;
      $scope.isLoading = true;
      $scope.showDownloadLink = false;
      $scope.isRegressionComplete = false;
      $scope.messageRepeatFlag = false;
      $scope.fd = false;
      $scope.impl = false;
      $scope.radioDivCount = 0;
      $scope.feedbackDivCount = 0;
      $scope.comTypeCount = 0;
      $scope.conversationRecord = [];
      $scope.timerInterval = null;
      $scope.askForAnythingElse = false;
      $scope.noArr = ['no', 'No', 'na', 'Na', 'NA', 'N', 'n'];
      $scope.yesArr = ['yes', 'YES', 'Yes', 'Y', 'y', 'yp', 'yeah', 'ya'];
      $scope.conversationContextImpl = {
            "common": {},
            "specific": {},
            "shared": {}
      }

      $scope.repeatContext = {};

      $scope.serviceCredentials = {
            serviceUserName: "",
            servicePassword: "",
            envName: "",
            regressionPath: ""
      }

      $scope.regressionDetails = {
            regressionPath: ""
      }

      $scope.rnr_resolution = "";

      $scope.question = "";

      $scope.rnrAnswerIndex = 0;
      $scope.rnrNoFeedback = 0;
      $scope.replacedText = "";
      $scope.linkPosition = 0;
      $scope.nextSpacePosition = 0;
      $scope.answerList = [];
      $scope.toMail =CONSTANTS.constantVariables.TO_EMAILID;
      $scope.mailSubject = CONSTANTS.constantVariables.EMAIL_SUBJECT;
      $scope.mailBody = "\n"
      $scope.mailBody = $scope.mailBody + CONSTANTS.constantVariables.EMAIL_HEADER.concat("\n");
      $scope.showMail = CONSTANTS.constantVariables.SHOW_EMAIL;
      var feedbackFormResponse = function (feedback) {
            return feedback;
      }


      /**
       * Function for starting recording of chat messages for selected workspace.
       */
      $scope.startRecording = function () {
            if ($scope.isRecording) {
                  $scope.isRecording = false;
                  $scope.showDownloadLink = true;
            } else {
                  $scope.isRecording = true;
            }
      };

      /**
       * Function for making a post call to Conversation for subsequent chat messages.
       */
      $scope.converse = function () {
            console.log("from amar");
            $scope.isFormDisplayed = false;
            $scope.sessionexpire = [];
            if ($scope.askForAnythingElse) {
				  $scope.askForAnythingElse = false;
                  if ($scope.noArr.indexOf($scope.customerMessage.toLowerCase()) > -1) {
                        //$scope.askForAnythingElse = false;
                        $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.customerMessage.toString().concat("\n"));

                        $scope.conversation.push({
                              "from": "customer",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": $scope.customerMessage,
                              "liclass": "right",
                              "small": "",
                              "strong": "pull-right",
                              "spanicon": "pull-right",
                              "chaticon": "userImage",
                              "agent": "User",
                              "time": new Date()
                        });
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+"Thanks for contacting us. Have a good day".concat("\n"));
                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Thanks for contacting us. Have a good day.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        //refresh();
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $timeout(function () {
                              $("#userMessage").focus();
                        });
                        $scope.customerMessage = "";
                        return;
                  }
                  if ($scope.yesArr.indexOf($scope.customerMessage.toLowerCase()) > -1) {
                        $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.customerMessage.toString().concat("\n"));
                        //$scope.askForAnythingElse = false;
                        $scope.conversation.push({
                              "from": "customer",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": $scope.customerMessage,
                              "liclass": "right",
                              "small": "",
                              "strong": "pull-right",
                              "spanicon": "pull-right",
                              "chaticon": "userImage",
                              "agent": "User",
                              "time": new Date()
                        });
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Please tell me your query.".concat("\n"));

                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Please tell me your query.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        //refresh();
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $timeout(function () {
                              $("#userMessage").focus();
                        });
                        $scope.customerMessage = "";
                        return;
                  }
            }

            if ($('#yes-no-slider').length > 0) {
                  $("#yes-no-slider").bootstrapToggle('destroy')
                  $("#yes-no-slider").remove();
            }
            //$("#"+$scope.feedback).children().prop('disabled',true);
            $("#" + $scope.feedback).children(":nth-child(2)").prop('disabled', true).addClass('disableThumbsUp');
            $("#" + $scope.feedback).children(":nth-child(3)").prop('disabled', true).addClass('disableThumbsDown');
            $("#" + $scope.radioId1).children().prop('disabled', true);
            $("#" + $scope.radioId2).children().prop('disabled', true);
            $("#improve" + $scope.comTypeCount).children().prop('disabled', true);
            $("#others" + $scope.comTypeCount).children().prop('disabled', true);
            $("#notFound" + $scope.comTypeCount).children().prop('disabled', true);
            $("#userComments").remove();
            $("#userMessage").val('');
            if ($scope.isComment == true || $scope.noAnsFound == true) {
                  $scope.isTyping = true;
                  var tempMessage = $scope.customerMessage;
                  if ($scope.noAnsFound == true) {
                        $scope.answerID = 0;
                        tempMessage = null;
                        $scope.userSelectedType = "NO_ANSWER";
                  }
                  $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.customerMessage.toString().concat("\n"));
                  $scope.conversation.push({
                        "from": "customer",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": $scope.customerMessage,
                        "liclass": "right",
                        "small": "",
                        "strong": "pull-right",
                        "spanicon": "pull-right",
                        "chaticon": "userImage",
                        "agent": "User",
                        "time": new Date()
                  });
                  $scope.isComment = false;
                  var body = {
                        question: $scope.questionAsked,
                        answerId: $scope.answerID,
                        text: tempMessage,
                        commentType: $scope.userSelectedType
                  };
                  var authHeader = {
                        headers: {
                              // 'authorization':"Basic " + btoa(sessionStorage['USER_NAME'] + ":" + sessionStorage['PASSWORD'])
                              'authorization': "Basic " + btoa(""+ ":" + "")
                        }
                  };
                  console.log("--comments--" + CONSTANTS.appConfig.globalUrl + CONSTANTS.endPoints.COMMENTS);
                  $http.post(CONSTANTS.appConfig.globalUrl + CONSTANTS.endPoints.COMMENTS, body, authHeader)
                        .success(function (data, status) {
                              if ($scope.noAnsFound == false) {
                                    $scope.customerMessage = 'No';
                                    $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.customerMessage.toString().concat("\n"));

                                    $scope.conversation.push({
                                          "from": "watson",
                                          "noShrinkReq": "true",
                                          "shrinkPosition": "false",
                                          "text": 'Your comments are successfully saved.',
                                          "liclass": "left",
                                          "small": "pull-right",
                                          "strong": "",
                                          "spanicon": "pull-left",
                                          "chaticon": "botImage",
                                          "agent": "Bot",
                                          "time": new Date()
                                    });
                              }
                              $scope.isTyping = false;
                              var objDiv = document.getElementById("inner-chat-window");
                              objDiv.scrollTop = objDiv.scrollHeight;
                              var chatDiv = $('#inner-chat-window');
                              var height = chatDiv[0].scrollHeight;
                              $('#inner-chat-window').animate({ scrollTop: height + 200 });
                              $timeout(function () {
                                    $("#userMessage").focus();
                              });
                              //$scope.customerMessage="";
                              $scope.noAnsFound = false;
                              //$scope.customerMessage = 'No';
                              $scope.rnrCallForResolution($scope.customerMessage);

                        });
                  return;

            }

            if ($scope.customerMessage == "") {
                  $scope.isTyping = true;
                  $scope.isTimeout = false;
                  $scope.mailBody =   $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Hi! I\’m a Virtual Agent and I\'m here to help you with questions on FI$Cal Procurement.\nHow can I help you today?".concat("\n"));
                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Hi! I\’m a Virtual Agent and I\'m here to help you with questions on FI$Cal Procurement. How can I help you today?',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });

                  warn = $timeout(function () {
                        $scope.isTyping = true;
                        $scope.sessionexpire.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Your session is about to expire due to inactivity. Please type in a question if you would like to keep the session active.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date(),
                              "timeoutVal": "false"
                        });
                        $scope.isTyping = false;
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  }, CONSTANTS.constantVariables.WARNINGTIME);

                  expire = $timeout(function () {
                        $scope.isTyping = true;
                        $scope.sessionexpire.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Your session is expired. Please close the window and reopen via the Virtual Agent link in FI$Cal to re-initiate a new session.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date(),
                              "timeoutVal": "true"
                        });

                        $scope.isTyping = false;
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $scope.isTimeout = true;
                        $("#" + $scope.feedback).children(":nth-child(2)").prop('disabled', true).addClass('disableThumbsUp');
                        $("#" + $scope.feedback).children(":nth-child(3)").prop('disabled', true).addClass('disableThumbsDown');
                        $('#yes-no-slider').bootstrapToggle('disable');
                  }, CONSTANTS.constantVariables.TIMEOUT);


                  $scope.isTyping = false;
                  //$scope.$apply();
            } else {
                  $timeout.cancel(warn);
                  $timeout.cancel(expire);
                  $scope.isTimeout = false;
                  warn = $timeout(function () {
                        $scope.isTyping = true;
                        $scope.sessionexpire.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Your session is about to expire due to inactivity. Please type in a question if you would like to keep the session active.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        $scope.isTyping = false;
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        //$scope.isTimeout = true;

                  }, CONSTANTS.constantVariables.WARNINGTIME);

                  expire = $timeout(function () {
                        $scope.isTyping = true;
                        $scope.sessionexpire.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Your session is expired. Please close the window and reopen via the Virtual Agent link in FI$Cal to re-initiate a new session.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });

                        $scope.isTyping = false;
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $scope.isTimeout = true;
                        $("#" + $scope.feedback).children(":nth-child(2)").prop('disabled', true).addClass('disableThumbsUp');
                        $("#" + $scope.feedback).children(":nth-child(3)").prop('disabled', true).addClass('disableThumbsDown');
                        $('#yes-no-slider').bootstrapToggle('disable');
                  }, CONSTANTS.constantVariables.TIMEOUT);
                  $scope.tempMessage = $scope.customerMessage;
                  $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.customerMessage.toString().concat("\n"));
            
                  $scope.conversation.push({
                        "from": "customer",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": $scope.customerMessage,
                        "liclass": "right",
                        "small": "customer-time",
                        "strong": "pull-right",
                        "spanicon": "pull-right",
                        "chaticon": "userImage",
                        "agent": "User",
                        "time": new Date()
                  });
                  $scope.customerMessage = $scope.tempMessage;
                  if ($scope.customerMessage == 'Yes') {
                        $scope.radioId1 = "yes" + $scope.radioDivCount;
                        $scope.radioId2 = "no" + $scope.radioDivCount;
                        $scope.askForAnythingElse = true;
                        var test = '<div style="float: left;"><div style="margin-bottom: 8px;font-weight: 700;float:left; margin-right: 10px;">Is there anything else I can help you with?</div></div>';
                        //<div style="margin-left: -20px;" class="radio radio-success radio-inline" id="'+$scope.radioId1+'">   <input type="radio" id="inlineRadio1" value="continueChat"    name="radioInline" > <label for="inlineRadio1">Yes </label>      </div>      <div class="radio radio-success radio-inline" style="margin-left: -70px;padding-left: 0;" id="'+$scope.radioId2+'">            <input type="radio" id="inlineRadio2" value="endChat" name="radioInline" > <label for="inlineRadio2" > No </label>    </div></div>';

                        $scope.shrinkVal = 200;
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Is there anything else I can help you with?".concat("\n"));

                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": test,
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        $scope.isTyping = false;
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $timeout(function () {
                              $("#userMessage").focus();
                              $('#yes-no-slider').bootstrapToggle('enable');
                              $(".toggle-handle").css("transform", "rotate(180deg)");
                        });
                        $scope.customerMessage = "";
                        $scope.radioDivCount++;
                        $timeout.cancel(warn);
                        $timeout.cancel(expire);
                        $scope.isTimeout = false;
                        warn = $timeout(function () {
                              $scope.isTyping = true;
                              $scope.sessionexpire.push({
                                    "from": "watson",
                                    "noShrinkReq": "true",
                                    "shrinkPosition": "false",
                                    "text": 'Your session is about to expire due to inactivity. Please type in a question if you would like to keep the session active.',
                                    "liclass": "left",
                                    "small": "pull-right",
                                    "strong": "",
                                    "spanicon": "pull-left",
                                    "chaticon": "botImage",
                                    "agent": "Bot",
                                    "time": new Date()
                              });
                              $scope.isTyping = false;
                              var objDiv = document.getElementById("inner-chat-window");
                              objDiv.scrollTop = objDiv.scrollHeight;
                              var chatDiv = $('#inner-chat-window');
                              var height = chatDiv[0].scrollHeight;
                              $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        }, CONSTANTS.constantVariables.WARNINGTIME);

                        expire = $timeout(function () {
                              $scope.isTyping = true;
                              $scope.sessionexpire.push({
                                    "from": "watson",
                                    "noShrinkReq": "true",
                                    "shrinkPosition": "false",
                                    "text": 'Your session is expired. Please close the window and reopen via the Virtual Agent link in FI$Cal to re-initiate a new session.',
                                    "liclass": "left",
                                    "small": "pull-right",
                                    "strong": "",
                                    "spanicon": "pull-left",
                                    "chaticon": "botImage",
                                    "agent": "Bot",
                                    "time": new Date()
                              });

                              $scope.isTyping = false;
                              var objDiv = document.getElementById("inner-chat-window");
                              objDiv.scrollTop = objDiv.scrollHeight;
                              var chatDiv = $('#inner-chat-window');
                              var height = chatDiv[0].scrollHeight;
                              $('#inner-chat-window').animate({ scrollTop: height + 200 });
                              $scope.isTimeout = true;
                              $("#" + $scope.feedback).children(":nth-child(2)").prop('disabled', true).addClass('disableThumbsUp');
                              $("#" + $scope.feedback).children(":nth-child(3)").prop('disabled', true).addClass('disableThumbsDown');
                              $('#yes-no-slider').bootstrapToggle('disable');
                        }, CONSTANTS.constantVariables.TIMEOUT);
                        return;
                  }
                  if ($scope.customerMessage == 'Rephrase question') {
 
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+CONSTANTS.constantVariables.REPHRASE_EMAIL.concat("\n"));

                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": CONSTANTS.constantVariables.REPHRASE_CHATBOT,
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        var objDiv = document.getElementById("inner-chat-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $timeout(function () {
                              $("#userMessage").focus();
                        });
                        $scope.customerMessage = "";
                        //$scope.$apply();
                        return;
                  }
                  $scope.rnrCallForResolution($scope.customerMessage);
            }

            var objDiv = document.getElementById("inner-chat-window");
            objDiv.scrollTop = objDiv.scrollHeight;
            var chatDiv = $('#inner-chat-window');
            var height = chatDiv[0].scrollHeight;
            $('#inner-chat-window').animate({ scrollTop: height + 200 });
            $timeout(function () {
                  $("#userMessage").focus();
            });
      };


      /**
       * Function for sending chat message to Watson service.
       */
      $scope.submit = function (event) {
            if (event.type == "submit")
                  $scope.converse();
      };


      /**
       * Function for clearing conversation and emptying all required scope variables. 
       */
      $scope.clearConversation = function () {
            $scope.radioDivCount = 0;
            $scope.feedbackDivCount = 0;
            $scope.comTypeCount = 0;
            $scope.customerMessage = "";
            $scope.conversation = [];
            $scope.context = {}
            $scope.contextVariables = {};
            $scope.conversationContextImpl = {
                  "common": {},
                  "specific": {},
                  "shared": {}
            };
            $scope.contextVars = {};
            $scope.entities = [];
            $scope.intents = [];
            $scope.conversationRecord = [];
            $scope.isRecording = false;
            $scope.recordData = [];
            $scope.xlsCount = 0;
            $scope.messageRepeatFlag = false;
            $scope.isTyping = false;
            $scope.feedbackSelected = '';
            $scope.isComment = false;
            $scope.userSelectedType = "";
            $scope.questionAsked = "";
            $scope.noAnsFound = false;
            $scope.isNotFoundMsgShown = false;
            $scope.answerList = [];
            $scope.isFormDisplayed = false;
            $scope.converse();
      };

      /**
       * Function for calling 'converse' REST service
       */
      $scope.postMessage = function () {
            /*var selectedWorkspaceId = "";
            if (typeof $scope.workspaceId == 'object' && $scope.workspaceId.length == 1) {
                selectedWorkspaceId = $scope.workspaceId[0].workspaceId;
            } else if (typeof $scope.workspaceId == 'object' && $scope.workspaceId.length > 1) {
                $(".regression-success-msg").text("Please select one workspace");
                $(".regression-success-msg").slideDown("slow").delay(5000).fadeOut('slow');
            }*/
            var context = $scope.conversationContextImpl;
            context["loggedInUser"] = $scope.currentUser;
            /*if (!$scope.messageRepeatFlag) {
                context = $scope.selType == "fd" ? $scope.contextVars : $scope.conversationContextImpl;
                $scope.repeatContext = context;
            } else {
                context = $scope.repeatContext;
            }*/
            $scope.requestContext = context;
            var header = {
                  headers: {
                        'Content-Type': 'application/json',
                        'charset': 'UTF-8'
                  }
            };
            // REST Call
            $scope.isTyping = true;
            $http.post('./rest/conversation/converse', JSON.stringify({
                  //"workspace": selectedWorkspaceId,
                  "customerMessage": $scope.customerMessage,
                  "context": context
            }), header)
                  .success(function (data) {
                        var tempMessage = $scope.customerMessage;
                        var tempReqContext = $scope.requestContext;
                        if (data.output.text[0]) {
                              var command = data.context.common.command;
                              var arrResolution = [];
                              if ((command != undefined && command.length > 0) &&
                                    (command.toLowerCase() == CONSTANTS.command.show_top_resolution_and_feedback_form.toLowerCase())) {
                                    data.output.text[0] = data.output.text[0].replace('%s', $scope.rnr_resolution);
                                    arrResolution = data.output.text[0].split('<br/><br/>');
                                    data.output.text[0] = arrResolution[0];
                              }

                              var CurrentDate = new Date();
                              $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+data.output.text.toString().concat("\n"));

                              $scope.conversation.push({
                                    "from": "watson",
                                    "text": data.output.text,
                                    "liclass": "left",
                                    "small": "pull-right",
                                    "strong": "",
                                    "spanicon": "pull-left",
                                    "chaticon": "botImage",
                                    "agent": "Bot",
                                    "time": CurrentDate
                              });

                              if ((command != undefined && command.length > 0) &&
                                    (command.toLowerCase() == CONSTANTS.command.show_top_resolution_and_feedback_form.toLowerCase())) {
                                    var satisfied = 'Yes';
                                    var strYes = "'" + satisfied + "'";
                                    $scope.feedback = "feedback" + $scope.feedbackDivCount;

                                    var test = '<div class="feedback-form" id="' + $scope.feedback + '"><div class="feedback-heading">' + arrResolution[1] + '</div><div class="thumbs-up-div" id="thumbsUp"><i class="fa fa-thumbs-up thumbs-up" aria-hidden="true"></i></div><div class="thumbs-down-div" id="thumbsDown"><i class="fa fa-thumbs-down thumbs-down" aria-hidden="true"></i></div></div>';
                                    //<div style="float: left; margin-right: 20px;"><div style="margin-bottom: 8px;font-weight: 700;">'+arrResolution[1]+'</div><div class="radio radio-success radio-inline">  <input type="radio" id="inlineRadio1" value="yes"      name="radioInline" checked=""> <label                 for="inlineRadio1"> Yes </label>    </div>      <div class="radio radio-success radio-inline" style="margin-left: 20px;">           <input type="radio" id="inlineRadio2" value="no" name="radioInline"> <label for="inlineRadio2"> No </label>  </div></div>      
                                    var arr = [];
                                    arr.push(test);
                                    /*var tempArr = [];
                                    tempArr.push(arrResolution[1]);*/
                                    $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+arrResolution[1].toString().concat("\n"));

                                    $scope.conversation.push({
                                          "from": "watson",
                                          "text": arr,
                                          "liclass": "left",
                                          "small": "pull-right",
                                          "strong": "",
                                          "spanicon": "pull-left",
                                          "chaticon": "botImage",
                                          "agent": "Bot",
                                          "time": CurrentDate
                                    });
                                    //$scope.isFormDisplayed = true;
                              }
                              //var form = data.context.common.form;
                              if ((command != undefined && command.length > 0) &&
                                    (command.toLowerCase() == CONSTANTS.command.show_yes_no_form.toLowerCase())) {
                                    var CurrentDate = new Date();
                                    var arr = [];
                                    arr.push('<div style="float: left; margin-right: 20px;"><div style="margin-bottom: 8px;font-weight: 700;">Please select the option and click on send button</div><div class="radio radio-success radio-inline">  <input type="radio" id="inlineRadio1" value="yes" name="radioInline" checked=""> <label for="inlineRadio1"> Yes </label>      </div>      <div class="radio radio-success radio-inline" style="margin-left: 20px;">         <input type="radio" id="inlineRadio2" value="no" name="radioInline"> <label for="inlineRadio2"> No </label>  </div></div>');
                                    $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Please select the option and click on send button".concat("\n"));

                                    $scope.conversation.push({
                                          "from": "watson",
                                          "text": arr,
                                          "liclass": "left",
                                          "small": "pull-right",
                                          "strong": "",
                                          "spanicon": "pull-left",
                                          "chaticon": "botImage",
                                          "agent": "Bot",
                                          "time": CurrentDate
                                    });
                              }
                        }
                        if ((data.hasOwnProperty('context') &&
                              data.context.hasOwnProperty('common') &&
                              data.context.common.hasOwnProperty('command') &&
                              data.context.common.command.length > 0) && data.context.common.command.toLowerCase() == CONSTANTS.command.rnr_call_not_po.toLowerCase()) {
                              $scope.rnrCallForResolution($scope.customerMessage, function () {
                                    $scope.postMessage();
                              });
                        }
                        /*if ((command != undefined && command.length > 0) && command.toLowerCase() == CONSTANTS.command.rnr_call_for_question.toLowerCase()) {
                                $scope.rnrCallForResolution($scope.customerMessage, function() {
                                      $scope.postMessage();
                                });
                          }*/

                        $scope.customerMessage = "";
                        $scope.conversationContextImpl = $scope.selType == "impl" ? Object.assign({}, data.context) : {};
                        //$scope.contextVars = $scope.selType == "fd" ? data.context : {};
                        console.log($scope.contextVars);
                        $scope.responseContext = data.context;
                        // two context - one to display one to edit
                        $scope.contextVariables = data.context;
                        /*if ($scope.isRecording)
                            $scope.conversationRecord.push($scope.createConversationRecord(tempMessage, tempReqContext, data.output.text, data.context));*/
                        $scope.isTyping = false;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $timeout(function () {
                              $("#userMessage").focus();
                        });
                  }).error(function (error) {
                        console.log(error);
                        $scope.isTyping = false;
                        $(".regression-success-msg").removeClass("alert-success");
                        $(".regression-success-msg").addClass("alert-danger");
                        $(".regression-success-msg").text("Something went wrong");
                        $(".regression-success-msg").slideDown("slow").delay(5000).fadeOut('slow');
                  });
      };

      $scope.validatePONumber = function () {
            //validation logic will added here
            return "true";
      };

      /**
     * Function for calling rnr service
     */
      $scope.rnrCallForResolution = function (question, callback) {
            if ($scope.userSelectedType == "NOT_FOUND") {
                  $scope.userSelectedType = ""
                  $scope.comTypeCount = 0;
                  $scope.customerMessage = "";
                  $scope.contextVars = {};
                  $scope.isTyping = false;
                  $scope.feedbackSelected = '';
                  $scope.isComment = false;
                  $scope.userSelectedType = "";
                  $scope.questionAsked = "";
                  $scope.noAnsFound = false;
                  $scope.isNotFoundMsgShown = false;
                  $scope.answerList = [];
                  $scope.isFormDisplayed = false;
                  var test = '<div style="float: left;"><div style="margin-bottom: 8px;font-weight: 700;float:left; margin-right: 10px;">Is there anything else I can help you with?</div></div>';
                  //<div style="margin-left: -20px;" class="radio radio-success radio-inline" id="'+$scope.radioId1+'">   <input type="radio" id="inlineRadio1" value="continueChat"    name="radioInline" > <label for="inlineRadio1">Yes </label>      </div>      <div class="radio radio-success radio-inline" style="margin-left: -70px;padding-left: 0;" id="'+$scope.radioId2+'">            <input type="radio" id="inlineRadio2" value="endChat" name="radioInline" > <label for="inlineRadio2" > No </label>    </div></div>';

                  $scope.shrinkVal = 200;
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Is there anything else I can help you with?".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": test,
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  $scope.isTyping = false;
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                        $('#yes-no-slider').bootstrapToggle('enable');
                        $(".toggle-handle").css("transform", "rotate(180deg)");
                  });
                  $scope.customerMessage = "";
                  $scope.radioDivCount++;
                  return;
            } else if ($scope.userSelectedType == "IMPROVE" || $scope.userSelectedType == "OTHERS") {
                  $scope.userSelectedType = '';
                  var test = '<div style="float: left;"><div style="margin-bottom: 8px;font-weight: 700;float:left; margin-right: 10px;">Would you like to view the next answer?</div><div style="margin-left: -20px;" class="radio radio-success radio-inline" id="' + $scope.radioId1 + '">     <input type="radio" id="inlineRadio1" value="continueChat"      name="radioInline" > <label for="inlineRadio1">Yes </label> </div>      <div class="radio radio-success radio-inline" style="margin-left: -70px;padding-left: 0;" id="' + $scope.radioId2 + '">           <input type="radio" id="inlineRadio2" value="endChat" name="radioInline" > <label for="inlineRadio2" > No </label>      </div></div>';

                  $scope.shrinkVal = 200;
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Would you like to view the next answer?".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": test,
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  $scope.isTyping = false;
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                        $('#yes-no-slider').bootstrapToggle('enable');
                        $(".toggle-handle").css("transform", "rotate(180deg)");
                  });
                  $scope.customerMessage = "";
                  $scope.radioDivCount++;
                  return;
            }
            // resolution didn't help
            $scope.shrinkVal = 200;

            if (($scope.customerMessage == 'No') && $scope.rnrAnswerIndex < 9 && $scope.rnrNoFeedback < ($scope.resolutionCount - 1)) {
                  $scope.shrinkVal = 200;
                  $scope.rnrAnswerIndex++;
                  $scope.rnrNoFeedback++;
                  //var message = 'I could not find an answer to your question. Try to rephrase your question.' + '<img title="Provide comment" id="userComments" src="./images/train-comments.png" style="cursor:pointer;float: right;margin-top: 0px;height: 39px;width: 42px;border-radius:0;" />';

                  if ($scope.answerList.length <= $scope.rnrAnswerIndex) {
                        if ($scope.isNotFoundMsgShown) {
                              $scope.isNotFoundMsgShown = false;
                        }
                       
                        $scope.answerID = 0;
                        if (($scope.answerList.length == 0 && $scope.userSelectedType == "NO_ANSWER") || $scope.isNotFoundMsgShown) {
                             // message = "Please rephrase your question";
                              $scope.isNotFoundMsgShown = false;
                        }
                        $scope.isNotFoundMsgShown = true;
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+CONSTANTS.constantVariables.REPHRASE_EMAIL.concat("\n"));
                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": CONSTANTS.constantVariables.REPHRASE_CHATBOT,
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        $scope.isTyping = false;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $timeout(function () {
                              $("#userMessage").focus();
                        });
                        $scope.customerMessage = "";
                        return;
                  }
                  $scope.rnr_resolution = $scope.answerList[$scope.rnrAnswerIndex].resolution;//data.answers.resolution;
                  $scope.process = $scope.answerList[$scope.rnrAnswerIndex].process;

                  //     Hiding first domain as per client's requirement
                  var str = $scope.process;
                  str = str.substring(str.indexOf(">") + 1);
                  $scope.process = str;

                  $scope.answerID = $scope.answerList[$scope.rnrAnswerIndex].answerID;
                  $scope.rnr_resolution = $scope.rnr_resolution.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  $scope.convertToLink($scope.rnr_resolution);
                  if ($scope.linkPosition < 201 && $scope.nextSpacePosition == -1) {
                        $scope.shrinkVal = 200;
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n"));

                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": $scope.replacedText,
                              "process": $scope.process,
                              "answerID": $scope.answerID,
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                  } else {
                        if ($scope.linkPosition < 201 && $scope.nextSpacePosition > 200) {
                              $scope.shrinkVal = $scope.linkEndPosition + 4;
                              $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n"));
                              $scope.conversation.push({
                                    "from": "watson",
                                    "noShrinkReq": "false",
                                    "shrinkPosition": $scope.linkEndPosition + 4,
                                    "text": $scope.replacedText,
                                    "process": $scope.process,
                                    "answerID": $scope.answerID,
                                    "liclass": "left",
                                    "small": "pull-right",
                                    "strong": "",
                                    "spanicon": "pull-left",
                                    "chaticon": "botImage",
                                    "agent": "Bot",
                                    "time": new Date()
                              });
                        } else {
                              $scope.shrinkVal = 200;
                              if ($scope.replacedText.length > 200) {
                                    $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n"));
                               $scope.conversation.push({
                                          "from": "watson",
                                          "noShrinkReq": "false",
                                          "shrinkPosition": "false",
                                          "text": $scope.replacedText,
                                          "process": $scope.process,
                                          "answerID": $scope.answerID,
                                          "liclass": "left",
                                          "small": "pull-right",
                                          "strong": "",
                                          "spanicon": "pull-left",
                                          "chaticon": "botImage",
                                          "agent": "Bot",
                                          "time": new Date()
                                    });
                              } else {
                                    $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n"));

                                    $scope.conversation.push({
                                          "from": "watson",
                                          "noShrinkReq": "true",
                                          "shrinkPosition": "false",
                                          "text": $scope.replacedText,
                                          "process": $scope.process,
                                          "answerID": $scope.answerID,
                                          "liclass": "left",
                                          "small": "pull-right",
                                          "strong": "",
                                          "spanicon": "pull-left",
                                          "chaticon": "botImage",
                                          "agent": "Bot",
                                          "time": new Date()
                                    });
                              }

                        }

                  }
                  $scope.feedback = "feedback" + $scope.feedbackDivCount;
                  var test = '<div class="feedback-form" id="' + $scope.feedback + '"><div class="feedback-heading">Did the resolution help you?</div><div class="thumbs-up-div" id="thumbsUp"><i class="fa fa-thumbs-up thumbs-up" aria-hidden="true"></i></div><div class="thumbs-down-div" id="thumbsDown"><i class="fa fa-thumbs-down thumbs-down" aria-hidden="true"></i></div></div>';
                  //var tempArr1 = [];
                  //tempArr1.push(test);
                  var CurrentDate = new Date();
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Did the resolution help you?".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": test,
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": CurrentDate
                  });
                  $scope.isTyping = false;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $scope.tempMessage = $scope.customerMessage;
                  $scope.customerMessage = "";
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.feedbackDivCount++;
                  return;
            } else if ($scope.customerMessage == 'No') {
                  $scope.shrinkVal = 200;
                
                  $scope.answerID = 0;
                  // if ($scope.feedbackDivCount == $scope.resolutionCount && $scope.userSelectedType != undefined && $scope.userSelectedType.length > 0) {
                  //       botMsg = 'Please rephrase your question';
                  // }
                  $scope.shrinkVal = 200;
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+CONSTANTS.constantVariables.REPHRASE_EMAIL.concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": CONSTANTS.constantVariables.REPHRASE_CHATBOT,
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  $scope.isTyping = false;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $scope.customerMessage = "";
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  return;
            }
            $scope.customerMessage = "";
            $scope.isTyping = true;
            $scope.question = question;
            var header = {
                  headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        // 'charset': 'UTF-8',
                        'clientInfo': 'chatbot',
                        //'Authorization': 'Basic bmVvYWRtaW46cGFzc3dvcmQ='
                        //'authorization':"Basic " + btoa(sessionStorage['USER_NAME'] + ":" + sessionStorage['PASSWORD'])
                        //'authorization': "Basic " + btoa('neoadmin' + ":" + 'password')
                  }
            };
            //     console.log("----"+"https://acip-neo.mybluemix.net/rest/askquestion/q/");
            //   $http.get("https://fcl-chatbot.mybluemix.net/converse/" + encodeURIComponent(question),header)
            $http.get($scope.url+'converse/' + encodeURIComponent(question) + '/' + $scope.resetContext, header)
                  .success(function (data) {
                        if (!data.context.hasOwnProperty('action') && data.intents.length > 0 && data.intents[0].confidence >= 0.9) {
                              $scope.isTyping = true;

                              $scope.resetContext = false;

                              $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+data.output.text[0].toString().concat("\n"));

                              $scope.conversation.push({
                                    "from": "watson",
                                    "noShrinkReq": "true",
                                    "shrinkPosition": "false",
                                    "text": data.output.text[0],
                                    "liclass": "left",
                                    "small": "pull-right",
                                    "strong": "",
                                    "spanicon": "pull-left",
                                    "chaticon": "botImage",
                                    "agent": "Bot",
                                    "time": new Date()
                              });
                              $scope.isTyping = false;
                              var chatDiv = $('#inner-chat-window');
                              var height = chatDiv[0].scrollHeight;
                              $('#inner-chat-window').animate({ scrollTop: height + 200 });
                              $timeout(function () {
                                    $("#userMessage").focus();
                              });
                              $scope.customerMessage = "";
                        }

                        else {

                              $scope.resetContext = true;
                              var header = {
                                    headers: {
                                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                          'clientInfo': 'chatbot',
                                          'authorization': "Basic " + btoa('neoadmin' + ":" + 'password')
                                    }
                              };
                              //     $http.get("https://fcl-chatbot.mybluemix.net/askQuestion/" + encodeURIComponent(question),header)
                              $http.post($scope.url+'nlc/' + encodeURIComponent(question), header)
                                    .success(function (nlcData) {
                                          $http.get($scope.url+'askQuestion/' + encodeURIComponent(question), header)
                                                .success(function (wdsData) {
                                                      var data = [];
                                                      if ((nlcData && nlcData.answers)) {
                                                            data = (nlcData.answers).concat(wdsData.answers);
                                                      } else {
                                                            data = wdsData.answers
                                                      }

                                                      var uniqueData = $scope.removeDuplicates(data);
                                                      // var data = {};
                                                      // angular.merge(data, wdsData, nlcData); 
                                                      //      console.log("---MERGED----"+uniqueData);
                                                      var jsonObject = {};
                                                      jsonObject.question = question;
                                                      jsonObject.answers = uniqueData;
                                                      jsonObject.domains = [];
                                                      $scope.fetchResolutions(jsonObject, question);
                                                }).error(function (error) {
                                                      $scope.isTyping = false;
                                                });



                                    }).error(function (error) {
                                          $scope.isTyping = false;
                                    });

                        }
                  });

      };


      $scope.removeDuplicates = function (arr) {
            var uniqueAnswerID = [];
            var uniqueArray = [];
            angular.forEach(arr, function(item, index) {

                  var checkAnswerId = uniqueAnswerID.filter(function(e) {
                        return e === item.answerID;
                  });
                  if (!(checkAnswerId.length > 0)) {
                        uniqueArray.push(item);
                        uniqueAnswerID.push(item.answerID);
                  }
            });
            return uniqueArray;
      }


      $scope.fetchResolutions = function (data, question) {

            $scope.sessionexpire = [];
            $scope.rnrAnswerIndex = 0;
            $scope.rnrNoFeedback = 0;
            $scope.answerList = data.answers;
            $scope.assignedDomains = data.domains;

            $scope.questionAsked = question;


            $scope.shrinkVal = 200;

            var isDomainFilterRequired = 'false';//sessionStorage['isDomainFilterRequired'];
            var roleName = 'Administrator';//sessionStorage['ROLE_NAME'];
            var roleIndex = roleName.toLowerCase().indexOf('admin')

            if (isDomainFilterRequired == "true" && roleIndex < 0 && $scope.assignedDomains.length == 0) {
                  $scope.answerList = [];
            }
            var oldAnswer = [];
            $.each($scope.answerList, function (index, value) {
                  if (isDomainFilterRequired == "true" && oldAnswer.length > 9) {
                        return false;
                  }

                  if (value["resolution"] != undefined) {
                        value["resolution"] = value["resolution"].trim().replace(/ +(?= )/g, '\n');
                  }
                  var selDomain = 0;
                  if (isDomainFilterRequired == "true" && roleIndex < 0) {
                        var tempDomainArr = value["process"].split(" > ");
                        selDomain = $.inArray(tempDomainArr[0].trim(), $scope.assignedDomains);
                  }
                  if (selDomain >= 0) {
                        //store answer for domain dropdown filter
                        oldAnswer.push(value);
                  }
            });
            if (isDomainFilterRequired == "true") {
                  data.answers = [];
                  data.answers = oldAnswer;
                  $scope.answerList = data.answers;
            }
            var tempAnswerList = [];
            if ($scope.answerList.length > 0) {
                  for (var i = 0; i < $scope.answerList.length; i++) {
                        var record = data.answers[i];
                        //     if(record.confidence >= $scope.rankerConfidenceThreshold){
                        tempAnswerList.push(record);
                        //     }           
                  }
                  $scope.answerList = [];
                  $scope.answerList = tempAnswerList;
                  if ($scope.answerList.length == 0) {
                        $scope.noAnsFound = true;
                        $scope.isTyping = true;

                  
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+CONSTANTS.constantVariables.REPHRASE_EMAIL.concat("\n"));
                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": CONSTANTS.constantVariables.REPHRASE_CHATBOT,
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        $scope.isTyping = false;
                        var chatDiv = $('#inner-chat-window');
                        var height = chatDiv[0].scrollHeight;
                        $('#inner-chat-window').animate({ scrollTop: height + 200 });
                        $timeout(function () {
                              $("#userMessage").focus();
                        });
                        $scope.customerMessage = "";
                        return;
                  }

                  /*if (data.answers.hasOwnProperty('resolution') && data.answers.resolution.length > 0) {*/
                  $scope.rnr_resolution = $scope.answerList[$scope.rnrAnswerIndex].resolution;//data.answers.resolution;
                  $scope.process = $scope.answerList[$scope.rnrAnswerIndex].process;

                  //     Hiding first domain as per client's requirement
                  var str = $scope.process;
                  str = str.substring(str.indexOf(">") + 1);
                  $scope.process = str;

                  $scope.answerID = $scope.answerList[$scope.rnrAnswerIndex].answerID;
                  $scope.rnr_resolution = $scope.rnr_resolution.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  //$scope.rnr_resolution = $scope.rnr_resolution +" Hello";
                  $scope.convertToLink($scope.rnr_resolution);

                  if ($scope.linkPosition < 201 && $scope.nextSpacePosition == -1) {
                        $scope.shrinkVal = 200;
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n"));
                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": $scope.replacedText,
                              "process": $scope.process,
                              "answerID": $scope.answerID,
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                  } else {
                        if ($scope.linkPosition < 201 && $scope.nextSpacePosition > 200) {
                              $scope.shrinkVal = $scope.nextSpacePosition;
                              $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n"));
                              $scope.conversation.push({
                                    "from": "watson",
                                    "noShrinkReq": "false",
                                    "shrinkPosition": $scope.nextSpacePosition,
                                    "text": $scope.replacedText,
                                    "process": $scope.process,
                                    "answerID": $scope.answerID,
                                    "liclass": "left",
                                    "small": "pull-right",
                                    "strong": "",
                                    "spanicon": "pull-left",
                                    "chaticon": "botImage",
                                    "agent": "Bot",
                                    "time": new Date()
                              });
                        } else {
                              $scope.shrinkVal = 200;
                              if ($scope.replacedText.length > 200) {
                                    $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n") );
                                    $scope.conversation.push({
                                          "from": "watson",
                                          "noShrinkReq": "false",
                                          "shrinkPosition": "false",
                                          "text": $scope.replacedText,
                                          "process": $scope.process,
                                          "answerID": $scope.answerID,
                                          "liclass": "left",
                                          "small": "pull-right",
                                          "strong": "",
                                          "spanicon": "pull-left",
                                          "chaticon": "botImage",
                                          "agent": "Bot",
                                          "time": new Date()
                                    });
                              } else {
                                    $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.answerID.toString().concat("\n"));
                                    $scope.conversation.push({
                                          "from": "watson",
                                          "noShrinkReq": "true",
                                          "shrinkPosition": "false",
                                          "text": $scope.replacedText,
                                          "process": $scope.process,
                                          "answerID": $scope.answerID,
                                          "liclass": "left",
                                          "small": "pull-right",
                                          "strong": "",
                                          "spanicon": "pull-left",
                                          "chaticon": "botImage",
                                          "agent": "Bot",
                                          "time": new Date()
                                    });
                              }
                        }

                  }
                  $scope.feedback = "feedback" + $scope.feedbackDivCount;

                  var test = '<div class="feedback-form" id="' + $scope.feedback + '"><div class="feedback-heading">Did the resolution help you?</div><div class="thumbs-up-div" id="thumbsUp"><i class="fa fa-thumbs-up thumbs-up" aria-hidden="true"></i></div><div class="thumbs-down-div" id="thumbsDown"><i class="fa fa-thumbs-down thumbs-down" aria-hidden="true"></i></div></div>';
                  //var tempArr1 = [];
                  //tempArr1.push(test);
                  var CurrentDate = new Date();
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Did the resolution help you?".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": test,
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": CurrentDate
                  });
                  //$scope.isFormDisplayed = true;
                  $scope.isTyping = false;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $scope.customerMessage = "";
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.feedbackDivCount++;
                  //  $scope.$apply();
                  //return;
                  //  $scope.conversationContextImpl.specific[CONSTANTS.appConfig.is_answer_found] = "true";
            } else {
                  $scope.isTyping = true;
                
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+CONSTANTS.constantVariables.REPHRASE_EMAIL.concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": CONSTANTS.constantVariables.REPHRASE_CHATBOT,
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  $scope.isTyping = false;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.customerMessage = "";
                  //$scope.conversationContextImpl.specific[CONSTANTS.appConfig.is_answer_found] = "false";
            }

            // callback();

      }

      $scope.sendMessage = function () {
            if ($scope.conversationContextImpl.common.command != undefined
                  && $scope.conversationContextImpl.common.command.length > 0) {
                  //command operation check 
                  var command = $scope.conversationContextImpl.common.command;
                  //var form = $scope.conversationContextImpl.common.form;
                  if (command.toLowerCase() == CONSTANTS.command.validate_po_number.toLowerCase()) {
                        $scope.conversationContextImpl.specific[CONSTANTS.appConfig.is_po_valid] = $scope.validatePONumber();
                        $scope.postMessage();
                  } else if (command.toLowerCase() == CONSTANTS.command.rnr_call_for_question.toLowerCase()) {
                        $scope.rnrCallForResolution($scope.customerMessage, function () {
                              $scope.postMessage();
                        });
                  } else if (command.toLowerCase() == CONSTANTS.command.show_top_resolution_and_feedback_form.toLowerCase()) {
                        var index = $(".chat li:nth-last-child(2)").index();
                        var temp = $scope.conversation[index];
                        var li = temp.text[0];
                        var isRadioLi = li.indexOf("feedback-form");
                        if (isRadioLi != -1) {
                              $scope.conversation.splice(index, 1);
                        }
                        $scope.postMessage();
                  } else if (command.toLowerCase() == CONSTANTS.command.show_yes_no_form.toLowerCase()) {
                        //$(".chat li:nth-last-child(2)").remove();
                        var index = $(".chat li:nth-last-child(2)").index();
                        var temp = $scope.conversation[index];
                        var li = temp.text[0];
                        var isRadioLi = li.indexOf("radioInline");
                        if (isRadioLi != -1) {
                              $scope.conversation.splice(index, 1);
                        }
                        $scope.conversationContextImpl.specific[CONSTANTS.appConfig.is_answer_found] = "false";
                        /*angular.forEach($scope.conversation, function(value, key) {
                              var li = value.text[0];
                              var isRadioLi = li.indexOf("radioInline");
                              if (isRadioLi != -1) {
                                    $scope.conversation.splice(key, 1);
                              }
                              });*/
                        //$scope.conversation.splice($scope.conversation.length-1, 1);
                        $scope.postMessage();
                  }
            } else {
                  $scope.postMessage();
            }
      };

      $scope.speechToText = function (txtId) {
            $("#" + txtId).val('');
            $scope.customerMessage = "";
            var recognizer = new webkitSpeechRecognition();
            recognizer.lang = "en";
            recognizer.onresult = function (event) {
                  if (event.results.length > 0) {
                        var result = event.results[event.results.length - 1];
                        if (result.isFinal) {
                              console.log(result[0].transcript);
                              $('#' + txtId).val(result[0].transcript);
                              $scope.customerMessage = result[0].transcript;
                              $scope.converse();
                        }
                  }
            };
            recognizer.start();
      };
      $scope.logout = function () {
            sessionStorage.clear();
            $scope.noAnsFound = false;
            $scope.isComment = false;
            $scope.userSelectedType = "";
            $scope.questionAsked = "";
            //$scope = undefined;
            $state.go('login');
      };

      $scope.convertToLink = function (inputText) {
            $scope.replacedText = "";
            $scope.linkPosition = 0;
            $scope.linkEndPosition = 0;
            $scope.nextSpacePosition = 0;

            //URLs starting with http://, https://, or ftp://
            var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            $scope.replacedText = inputText.replace(replacePattern1, '<a class="resolutionHyperlink" href="$1" target="_blank">$1</a>');

            //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
            var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            $scope.replacedText = $scope.replacedText.replace(replacePattern2, '$1<a class="resolutionHyperlink" href="http://$2" target="_blank">$2</a>');

            //Change email addresses to mailto:: links.
            var replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
            $scope.replacedText = $scope.replacedText.replace(replacePattern3, '<a class="resolutionHyperlink" href="mailto:$1">$1</a>');

            $scope.linkPosition = $scope.replacedText.indexOf("<a");
            $scope.linkEndPosition = $scope.replacedText.indexOf("</a>");
            if ($scope.linkEndPosition > 0) {
                  $scope.nextSpacePosition = $scope.replacedText.indexOf(" ", $scope.linkEndPosition);
            }
      };

      $scope.commentsType = function () {
            $scope.comTypeCount++;
            if ($scope.noAnsFound == true) {
                  $scope.noAnsFound = false;
                  $scope.isComment = true;
                  $scope.isFormDisplayed = false;
                  $scope.userSelectedType = "NO_ANSWER";
                  $scope.isTyping = true;
                  //$scope.customerMessage = 'Yes';
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Please provide your comments".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Please provide your comments',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.isTyping = false;
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  return;
            }

            var test = '<div style="float: left;"><div style="margin-bottom: 8px;font-weight: 700;">Please select the comment type</div><div style="margin-left: 0px;width:145px;" class="radio radio-success radio-inline" id="improve'
                  + $scope.comTypeCount
                  + '"><input type="radio" id="improve" value="IMPROVE"     name="radioInline" > <label for="improve">Improve answer </label>    </div>      <div class="radio radio-success radio-inline" style="padding-left: 6px; float: left;width: 146px;" id="notFound'
                  + $scope.comTypeCount
                  + '"><input type="radio" id="notFound" value="NOT_FOUND" name="radioInline" > <label for="notFound" > Answer not found </label>     </div><div class="radio radio-success radio-inline" style="padding-left: 6px;float:left" id="others'
                  + $scope.comTypeCount
                  + '"><input type="radio" id="others" value="OTHERS" name="radioInline" > <label for="others" > Others </label>      </div></div>';

            $scope.shrinkVal = 200;

            $scope.conversation.push({
                  "from": "watson",
                  "noShrinkReq": "true",
                  "shrinkPosition": "false",
                  "text": test,
                  "liclass": "left",
                  "small": "pull-right",
                  "strong": "",
                  "spanicon": "pull-left",
                  "chaticon": "botImage",
                  "agent": "Bot",
                  "time": new Date()
            });
            $scope.isTyping = false;
      };

      $scope.captureFeedBack = function (finalVal) {
            var header = {
                  headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'clientInfo': 'chatbot',
                        //'Authorization': 'Basic bmVvYWRtaW46cGFzc3dvcmQ='
                        //'authorization':"Basic " + btoa(sessionStorage['USER_NAME'] + ":" + sessionStorage['PASSWORD'])
                        'authorization': "Basic " + btoa('neoadmin' + ":" + 'password')
                  }
            };
            var data = {
                  "relevance": finalVal,
                  "question": $scope.question,
                  "id": $scope.answerID
            }
            console.log("---feedback" + CONSTANTS.appConfig.globalUrl + CONSTANTS.endPoints.FEEDBACK)
            //     $http.post("https://acip-neo.mybluemix.net/rest/captureFeedback", JSON.stringify(data), header)
            $http.post($scope.url+'captureFeedback/', JSON.stringify(data), header)
                  .success(function (data) {
                        $scope.converse();
                  }).error(function (error) {
                        console.log(error);
                        $scope.isTyping = false;
                        $(".regression-success-msg").removeClass("alert-success");
                        $(".regression-success-msg").addClass("alert-danger");
                        $(".regression-success-msg").text("Something went wrong");
                        $(".regression-success-msg").slideDown("slow").delay(5000).fadeOut('slow');
                  });

            $timeout.cancel(warn);
            $timeout.cancel(expire);
            $scope.isTimeout = false;
            warn = $timeout(function () {
                  $scope.isTyping = true;
                  $scope.sessionexpire.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Your session is about to expire due to inactivity. Please type in a question if you would like to keep the session active.',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  $scope.isTyping = false;
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
            }, CONSTANTS.constantVariables.WARNINGTIME);

            expire = $timeout(function () {
                  $scope.isTyping = true;
                  $scope.sessionexpire.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Your session is expired. Please close the window and reopen via the Virtual Agent link in FI$Cal to re-initiate a new session.',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });

                  $scope.isTyping = false;
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $scope.isTimeout = true;
                  $("#" + $scope.feedback).children(":nth-child(2)").prop('disabled', true).addClass('disableThumbsUp');
                  $("#" + $scope.feedback).children(":nth-child(3)").prop('disabled', true).addClass('disableThumbsDown');
                  $('#yes-no-slider').bootstrapToggle('disable');
            }, CONSTANTS.constantVariables.TIMEOUT);

      };
      $scope.isExpand = false;
      $scope.expandCollapseTitle = "Maximize";
      $scope.showProfile = true;
      $scope.expandCollapse = function () {
            if (!$scope.isExpand) {
                  $scope.isExpand = true;
                  $("#main-chat-container").css("top", "0");
                  $scope.expandCollapseTitle = "Minimize";
                  /*$("#main-chat-container").css("top","0%");*/
                  //        $("#inner-chat-window").css("min-height",(window.visualViewport.height-120)+"px");
                  //        $("#inner-chat-window").css("max-height",(window.visualViewport.height-120)+"px");
                  $("#main-chat-container").css("min-width", (window.visualViewport.width) + "px");
                  $("#main-chat-container").css("max-width", (window.visualViewport.width) + "px");

                  $("#max-min-icon").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                  $scope.showProfile = false;
            } else {
                  $scope.isExpand = false;
                  $("#main-chat-container").css("top", "");
                  $scope.expandCollapseTitle = "Maximize";
                  /*$("#main-chat-container").css("top","15%");*/
                  $("#inner-chat-window").css("min-height", "398px");
                  $("#inner-chat-window").css("max-height", "398px");
                  $("#inner-chat-window").css("min-width", "638px");
                  $("#inner-chat-window").css("max-width", "638px");
                  $("#max-min-icon").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
                  $scope.showProfile = true;
            }
      }


      function refresh() {
            var objDiv = document.getElementById("inner-chat-window");
            objDiv.scrollTop = objDiv.scrollHeight;
            var chatDiv = $('#inner-chat-window');
            var height = chatDiv[0].scrollHeight;
            $('#inner-chat-window').animate({ scrollTop: height + 200 });
            $timeout(function () {
                  $("#userMessage").focus();
            });
            $scope.customerMessage = "";
            $scope.noAnsFound = false;
            $scope.isNotFoundMsgShown = false;
            $scope.$apply();
      }
      angular.element(document).ready(function () {
            $scope.resetContext = false;
            $scope.shrinkVal = 200;
            $timeout(function () {
                  $scope.converse();
            });
            //$('#yes-no-slider').change(function() {
            $(document).on('change', '#yes-no-slider', function () {
                  // $("#userlistCheckAll").prop('checked', false);
                  if ($(this).prop('checked')) {
                        //$("#yes-no-slider").bootstrapToggle('disable');
                        $("#yes-no-slider").bootstrapToggle('destroy')
                        $("#yes-no-slider").remove();
                        $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Yes".concat("\n"));

                        $scope.conversation.push({
                              "from": "customer",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Yes',
                              "liclass": "right",
                              "small": "",
                              "strong": "pull-right",
                              "spanicon": "pull-right",
                              "chaticon": "userImage",
                              "agent": "User",
                              "time": new Date()
                        });
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Please tell me your query.".concat("\n"));

                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Please tell me your query.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        refresh();
                  } else {
                        //inactive users
                        //$("#yes-no-slider").bootstrapToggle('disable');
                        $("#yes-no-slider").bootstrapToggle('destroy');
                        $("#yes-no-slider").remove();
                        $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): No".concat("\n"));

                        $scope.conversation.push({
                              "from": "customer",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'No',
                              "liclass": "right",
                              "small": "",
                              "strong": "pull-right",
                              "spanicon": "pull-right",
                              "chaticon": "userImage",
                              "agent": "User",
                              "time": new Date()
                        });
                        $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Remember I am available to help you 24 hours a day. Thank you for contacting FI$Cal. Goodbye.".concat("\n"));

                        $scope.conversation.push({
                              "from": "watson",
                              "noShrinkReq": "true",
                              "shrinkPosition": "false",
                              "text": 'Remember I am available to help you 24 hours a day. Thank you for contacting FI$Cal. Goodbye.',
                              "liclass": "left",
                              "small": "pull-right",
                              "strong": "",
                              "spanicon": "pull-left",
                              "chaticon": "botImage",
                              "agent": "Bot",
                              "time": new Date()
                        });
                        refresh();
                  }
            });

            $scope.sendEmail = function(){
                  var emailBody = $scope.mailBody + CONSTANTS.constantVariables.EMAIL_FOOTER;
                  $window.open("mailto:"+ $scope.toMail + "?subject=" + $scope.mailSubject+"&body="+encodeURIComponent(emailBody),"_self");

            }

            $(document).on('click', '#userComments', function () {
                  $scope.isTyping = true;
                  $scope.isFormDisplayed = true;
                  this.remove();
                  $("#" + $scope.feedback).children(":nth-child(2)").prop('disabled', true).addClass('disableThumbsUp');
                  $("#" + $scope.feedback).children(":nth-child(3)").prop('disabled', true).addClass('disableThumbsDown');
                  $scope.customerMessage = 'Comments';

                  $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Comments".concat("\n"));

                  $scope.conversation.push({
                        "from": "customer",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": $scope.customerMessage,
                        "liclass": "right",
                        "small": "",
                        "strong": "pull-right",
                        "spanicon": "pull-right",
                        "chaticon": "userImage",
                        "agent": "User",
                        "time": new Date()
                  });
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  //If call is required on selection instead of send button
                  $scope.commentsType();
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.customerMessage = "";
                  //$scope.captureFeedBack(4);
            });

            //$scope.getWorkspaceList();
            // $('[data-toggle="tooltip"]').tooltip({title: "Check this checkbox, for repeating utterances", placement: "right"});
            $('[data-toggle="tooltip"]').tooltip({ title: "FI$Cal Virtual Agent is an AI based question and answer system, designed to resolve procurement queries.", placement: "left" });
            $('[data-toggle="emailtooltip"]').tooltip({ title: "Email FSC", placement: "left" });

            $(document).on('click', '#thumbsUp', function () {
                  $("#" + $scope.feedback).children("img").remove();

                  $scope.isTyping = true;
                  $scope.isComment = false;
                  $scope.customerMessage = 'Yes';
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  //If call is required on selection instead of send button
                  $scope.captureFeedBack(4);
            });
            $(document).on('click', '#thumbsDown', function () {
                  $("#" + $scope.feedback).children("img").remove();

                  $scope.isTyping = true;
                  $scope.isComment = false;
                  $scope.customerMessage = 'No';
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  //If call is required on selection instead of send button
                  $scope.captureFeedBack(0);

            });

            $(document).on('click', '#inlineRadio1', function () {
                  $scope.isComment = false;
                  $("#" + $scope.radioId1).children().prop('disabled', true);
                  $("#" + $scope.radioId2).children().prop('disabled', true);
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): View next answer".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'View next answer',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  //refresh();
                  $scope.customerMessage = 'No';
                  $scope.rnrCallForResolution();

            });
            $(document).on('click', '#inlineRadio2', function () {
                  $scope.isComment = false;
                  $("#" + $scope.radioId1).children().prop('disabled', true);
                  $("#" + $scope.radioId2).children().prop('disabled', true);
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"):Thanks for contacting us. Have a good day.".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Thanks for contacting us. Have a good day.',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  refresh();
            });

            // $("#home-bg-image").css("height", (window.visualViewport.height - 8) + "px");
            // $(window).resize(function () {
            //       $("#home-bg-image").css("height", (window.visualViewport.height - 8) + "px");
            // });

            $(document).on('click', '#notFound', function () {
                  $scope.isComment = true;
                  $scope.isFormDisplayed = false;
                  $scope.userSelectedType = "NOT_FOUND";//$(".chat li:last-child").prev().children().find('input[type="radio"]:checked').val();
                  $(".chat li:last-child").prev().children().find('input[type="radio"]').prop('disabled', true);
                  $("#improve" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#others" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#notFound" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#userMessage").val('');
                  $scope.customerMessage = 'Answer not found';
                  $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+ $scope.customerMessage.toString().concat("\n"));

                  $scope.conversation.push({
                        "from": "customer",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": $scope.customerMessage,
                        "liclass": "right",
                        "small": "",
                        "strong": "pull-right",
                        "spanicon": "pull-right",
                        "chaticon": "userImage",
                        "agent": "User",
                        "time": new Date()
                  });
                  $scope.isTyping = true;
                  //$scope.customerMessage = 'Yes';
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Please provide your comments".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Please provide your comments',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.customerMessage = "";
                  $scope.isTyping = false;
                  //refresh();

            });

            $(document).on('click', '#improve', function () {
                  $scope.isComment = true;
                  $scope.isFormDisplayed = false;
                  $scope.userSelectedType = "IMPROVE";//$(".chat li:last-child").prev().children().find('input[type="radio"]:checked').val();
                  $(".chat li:last-child").prev().children().find('input[type="radio"]').prop('disabled', true);
                  $("#improve" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#others" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#notFound" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#userMessage").val('');
                  $scope.customerMessage = 'Improve answer';
                  $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.customerMessage.toString().concat("\n"));

                  $scope.conversation.push({
                        "from": "customer",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": $scope.customerMessage,
                        "liclass": "right",
                        "small": "",
                        "strong": "pull-right",
                        "spanicon": "pull-right",
                        "chaticon": "userImage",
                        "agent": "User",
                        "time": new Date()
                  });
                  $scope.isTyping = true;
                  //$scope.customerMessage = 'Yes';
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Please provide your comments".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Please provide your comments',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.customerMessage = "";
                  $scope.isTyping = false;
                  //refresh();

            });

            $(document).on('click', '#others', function () {
                  $scope.isComment = true;
                  $scope.isFormDisplayed = false;
                  $scope.userSelectedType = "OTHERS";//$(".chat li:last-child").prev().children().find('input[type="radio"]:checked').val();
                  $(".chat li:last-child").prev().children().find('input[type="radio"]').prop('disabled', true);
                  $("#improve" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#others" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#notFound" + $scope.comTypeCount).children().prop('disabled', true);
                  $("#userMessage").val('');
                  $scope.customerMessage = 'Others';
                  $scope.mailBody =  $scope.mailBody + ("Customer("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): "+$scope.customerMessage.toString().concat("\n") );

                  $scope.conversation.push({
                        "from": "customer",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": $scope.customerMessage,
                        "liclass": "right",
                        "small": "",
                        "strong": "pull-right",
                        "spanicon": "pull-right",
                        "chaticon": "userImage",
                        "agent": "User",
                        "time": new Date()
                  });
                  $scope.isTyping = true;
                  //$scope.customerMessage = 'Yes';
                  $scope.mailBody =  $scope.mailBody + ("Bot("+$filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss')+"): Please provide your comments".concat("\n"));

                  $scope.conversation.push({
                        "from": "watson",
                        "noShrinkReq": "true",
                        "shrinkPosition": "false",
                        "text": 'Please provide your comments',
                        "liclass": "left",
                        "small": "pull-right",
                        "strong": "",
                        "spanicon": "pull-left",
                        "chaticon": "botImage",
                        "agent": "Bot",
                        "time": new Date()
                  });
                  var objDiv = document.getElementById("inner-chat-window");
                  objDiv.scrollTop = objDiv.scrollHeight;
                  var chatDiv = $('#inner-chat-window');
                  var height = chatDiv[0].scrollHeight;
                  $('#inner-chat-window').animate({ scrollTop: height + 200 });
                  $timeout(function () {
                        $("#userMessage").focus();
                  });
                  $scope.customerMessage = "";
                  $scope.isTyping = false;
                  //refresh();

            });

      });
});
