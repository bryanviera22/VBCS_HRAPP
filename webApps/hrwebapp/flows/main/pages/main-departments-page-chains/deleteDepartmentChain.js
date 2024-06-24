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

  class deleteDepartmentChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.departmentId 
     */
    async run(context, { departmentId }) {
      const { $page, $flow, $application } = context;

      const callRestResult = await Actions.callRest(context, {
        endpoint: 'businessObjects/delete_Department',
        uriParams: {
          'Department_Id': departmentId,
        },
      }, { id: 'deleteDepartment' });

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
          '$page.variables.oj_table_1410790259_1SelectedId',
        ],
      }, { id: 'resetSelection' });

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.departmentListSDP,
        refresh: null,
      }, { id: 'refreshDataProvider' });

      await Actions.fireNotificationEvent(context, {
        summary: 'Department deleted',
        message: `Department [${departmentId}] successfully deleted`,
        displayMode: 'transient',
        type: 'confirmation',
      }, { id: 'fireSuccessNotification' });
    }
  }

  return deleteDepartmentChain;
});
