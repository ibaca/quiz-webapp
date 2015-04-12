(function() {

  angular
      .module('quiz')
      .controller('QuizController', [
        'quizService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
        QuizController
      ]);

  function QuizController(quizService, $mdSidenav, $mdBottomSheet, $log, $q) {
    var self = this;

    self.selected = null;
    self.quizzes = [];
    self.selectQuiz = selectQuiz;
    self.toggleList = toggleQuizzesList;
    self.share = share;

    quizService.loadAllQuizzes().then(function(data) {
      self.quizzes = [].concat(data);
      self.selected = data[0];
    });

    function toggleQuizzesList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function() {
        $mdSidenav('left').toggle();
      });
    }

    function selectQuiz(quiz) {
      self.selected = angular.isNumber(quiz) ? $scope.quizzes[quiz] : quiz;
      self.toggleList();
    }

    function share($event) {
      var quiz = self.selected;

      $mdBottomSheet.show({
        parent: angular.element(document.getElementById('content')),
        templateUrl: 'src/quiz/view/contactSheet.html',
        controller: ['$mdBottomSheet', QuizSheetController],
        controllerAs: "vm",
        bindToController: true,
        targetEvent: $event
      }).then(function(clickedItem) {
        clickedItem && $log.debug(clickedItem.name + ' clicked!');
      });

      function QuizSheetController($mdBottomSheet) {
        this.quiz = quiz;
        this.items = [
          {name: 'Phone', icon: 'phone', icon_url: 'assets/svg/phone.svg'},
          {name: 'Twitter', icon: 'twitter', icon_url: 'assets/svg/twitter.svg'},
          {name: 'Google+', icon: 'google_plus', icon_url: 'assets/svg/google_plus.svg'},
          {name: 'Hangout', icon: 'hangouts', icon_url: 'assets/svg/hangouts.svg'}
        ];
        this.performAction = function(action) {
          $mdBottomSheet.hide(action);
        };
      }
    }

  }

})();
