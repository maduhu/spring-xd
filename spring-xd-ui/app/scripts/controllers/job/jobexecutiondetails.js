/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Definition of the Job Execution Details controller
 *
 * @author Gunnar Hillert
 */
define([], function () {
  'use strict';
  return ['$scope', 'JobExecutions', 'XDCommon', '$state', '$stateParams',
    function ($scope, jobExecutions, xdCommon, $state, $stateParams) {
      $scope.$apply(function () {
        $scope.moduleName = $stateParams.moduleName;
        $scope.optionsPredicate = 'name';

        var singleJobExecutionPromise = jobExecutions.getSingleJobExecution($stateParams.executionId).$promise;
        xdCommon.addBusyPromise(singleJobExecutionPromise);

        singleJobExecutionPromise.then(
            function (result) {
                xdCommon.$log.error(result);
                $scope.jobExecutionDetails = result;
              }, function (error) {
                if (error.status === 404) {
                  $scope.jobExecutionDetailsNotFound = true;
                  $scope.executionId = $stateParams.executionId;
                }
                else {
                  xdCommon.$log.error('Error fetching data. Is the XD server running?');
                  xdCommon.$log.error(error);
                  xdCommon.growl.addErrorMessage(error);
                }
              }
            );
      });
      $scope.closeJobExecutionDetails = function () {
          xdCommon.$log.info('Closing Job Execution Details Window');
          $state.go('home.jobs.tabs.executions');
        };
      $scope.viewStepExecutionDetails = function (jobExecution, stepExecution) {
          xdCommon.$log.info('Showing Step Execution details for Job Execution with Id: ' + jobExecution.executionId);
          $state.go('home.jobs.stepexecutiondetails', {
            executionId: jobExecution.executionId,
            stepExecutionId: stepExecution.id
          });
        };
    }];
});
