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

  class ojTable3819466661ChangeSelectionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employeeId
     */
    async run(context, { employeeId }) {
      const { $page, $flow, $application } = context;
      $page.variables.oj_table_381946666_1SelectedId = employeeId;
    }
  }

  return ojTable3819466661ChangeSelectionChain;
});
