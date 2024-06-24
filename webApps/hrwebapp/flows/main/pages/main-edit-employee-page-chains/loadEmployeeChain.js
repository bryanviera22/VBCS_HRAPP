define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class loadEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const callRestResult = await Actions.callRest(context, {
        endpoint: 'businessObjects/get_Employee',
        responseType: 'getEmployeeResponse',
        uriParams: {
          'Employee_Id': $page.variables.employeeId,
        },
      }, { id: 'loadEmployee' });

      if (!callRestResult.ok) {
        // Create error message
        const errorMessage = callRestResult.body?.detail || callRestResult.body?.['o:errorDetails']?.[0]?.detail || `Could not load data: status ${callRestResult.status}`;
        // Fires a notification event about failed load
        await Actions.fireNotificationEvent(context, {
          summary: 'Could not load data',
          message: errorMessage,
        }, { id: 'fireErrorNotification' });

        return;
      }

      $page.variables.fetchedEmployee = callRestResult.body;
      $page.variables.employee = $page.variables.fetchedEmployee;
      $page.variables.employeeETag = callRestResult.headers.get('ETag');
    }
  }

  return loadEmployeeChain;
});
