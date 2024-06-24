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

  class loadDepartmentChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const callRestResult = await Actions.callRest(context, {
        endpoint: 'businessObjects/get_Department',
        responseType: 'getDepartmentResponse',
        uriParams: {
          'Department_Id': $page.variables.departmentId,
        },
      }, { id: 'loadDepartment' });

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

      $page.variables.fetchedDepartment = callRestResult.body;
      $page.variables.department = $page.variables.fetchedDepartment;
      $page.variables.departmentETag = callRestResult.headers.get('ETag');
    }
  }

  return loadDepartmentChain;
});
