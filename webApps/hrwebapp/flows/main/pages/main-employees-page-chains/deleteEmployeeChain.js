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

  class deleteEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employeeId 
     */
    async run(context, { employeeId }) {
      const { $page, $flow, $application } = context;

      const callRestResult = await Actions.callRest(context, {
        endpoint: 'businessObjects/delete_Employee',
        uriParams: {
          'Employee_Id': employeeId,
        },
      }, { id: 'deleteEmployee' });

      if (!callRestResult.ok) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Delete failed',
          message: `Could not delete data: status ${callRestResult.status}`,
          displayMode: 'persist',
          type: 'error',
        }, { id: 'fireErrorNotification' });

        return;
      }

      // Resets selection variable
      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.oj_table_381946666_1SelectedId',
        ],
      }, { id: 'resetSelection' });

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.employeeListSDP,
        refresh: null,
      }, { id: 'refreshDataProvider' });

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.employeeListSDP2,
        refresh: null,
      });

      await Actions.fireNotificationEvent(context, {
        summary: 'Employee deleted',
        message: `Employee [${employeeId}] successfully deleted`,
        displayMode: 'transient',
        type: 'confirmation',
      }, { id: 'fireSuccessNotification' });
    }
  }

  return deleteEmployeeChain;
});
