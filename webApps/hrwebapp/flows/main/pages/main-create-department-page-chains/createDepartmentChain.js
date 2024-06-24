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

  class createDepartmentChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      // Sets the progress variable to true
      $page.variables.createDepartmentChainInProgress = true;

      try {
        // Validates Department form
        const validateFormResult = await Actions.callChain(context, {
          chain: 'flow:validateFormChain',
          params: {
            validationGroupId: 'validation-group',
          },
        }, { id: 'validateDepartment' });

        if (!validateFormResult) {
          return;
        }

        const callRestResult = await Actions.callRest(context, {
          endpoint: 'businessObjects/create_Department',
          body: $page.variables.department,
        }, { id: 'createDepartment' });

        if (!callRestResult.ok) {
          // Create error message
          const errorMessage = callRestResult.body?.detail || callRestResult.body?.['o:errorDetails']?.[0]?.detail || `Could not create new Department: status ${callRestResult.status}`;
          // Fires a notification event about failed save
          await Actions.fireNotificationEvent(context, {
              summary: 'Save failed',
              message: errorMessage,
          }, { id: 'fireErrorNotification' });

          return;
        }

        await Actions.fireNotificationEvent(context, {
          summary: 'Department saved',
          message: 'Department record successfully created',
          displayMode: 'transient',
          type: 'confirmation',
        }, { id: 'fireSuccessNotification' });

        await Actions.navigateBack(context, {}, { id: 'navigateBack' });
      } finally {
        // Sets the progress variable to false
        $page.variables.createDepartmentChainInProgress = false;
      }
    }
  }

  return createDepartmentChain;
});
