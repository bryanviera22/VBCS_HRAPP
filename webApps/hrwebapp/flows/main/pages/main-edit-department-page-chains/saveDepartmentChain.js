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

  class saveDepartmentChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      // Sets the progress variable to true
      $page.variables.saveDepartmentChainInProgress = true;

      try {
        // Validates Department form
        const validateFormResult = await Actions.callChain(context, {
          chain: 'flow:validateFormChain',
          params: {
            validationGroupId: 'validation-group',
          },
        });

        if (!validateFormResult) {
          return;
        }

        const payload = await this.preparePatchPayload(context, {
          updatedRecord: $page.variables.department,
          fetchedRecord: $page.variables.fetchedDepartment,
        });

        if (payload === undefined) {
          // Return from the action chain when there are no changes to save
          return;
        }

        const callRestResult = await Actions.callRest(context, {
          endpoint: 'businessObjects/update_Department',
          body: payload,
          uriParams: {
            'Department_Id': $page.variables.departmentId,
          },
        }, { id: 'saveDepartment' });

        if (!callRestResult.ok) {
          // Create error message
          const errorMessage = callRestResult.body?.detail || callRestResult.body?.['o:errorDetails']?.[0]?.detail || `Could not update Department: status ${callRestResult.status}`;
          // Fires a notification event about failed save
          await Actions.fireNotificationEvent(context, {
            summary: 'Save failed',
            message: errorMessage,
          }, { id: 'fireErrorNotification' });

          return;
        }

        await Actions.fireNotificationEvent(context, {
          summary: 'Department saved',
          message: 'Department record successfully updated',
          displayMode: 'transient',
          type: 'confirmation',
        }, { id: 'fireSuccessNotification' });

        await Actions.navigateBack(context, {}, { id: 'navigateBack' });
      } finally {
        // Sets the progress variable to false
        $page.variables.saveDepartmentChainInProgress = false;
      }
    }

    /**
     * Prepares PATCH endpoint payload, calculates changed fields.
     * @param {any} updatedRecord
     * @param {any} fetchedRecord
     * @return {any} calculated payload
     */
    async preparePatchPayload(context, { updatedRecord, fetchedRecord }) {
      let payload = updatedRecord;
      let hasChanges = true;
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        // filter the object to only those top-level fields that differ from the original fetched record
        payload = Object.fromEntries(Object.entries(payload).filter(([field, value]) =>
          JSON.stringify(value) !== JSON.stringify(fetchedRecord?.[field])
        ));
        hasChanges = Object.keys(payload).length > 0;
      }

      if (!hasChanges) {
        payload = undefined;
      }

      return payload;
    }

  }

  return saveDepartmentChain;
});
