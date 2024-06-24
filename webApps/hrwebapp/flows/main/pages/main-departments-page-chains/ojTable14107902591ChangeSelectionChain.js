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

  class ojTable14107902591ChangeSelectionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.departmentId
     */
    async run(context, { departmentId }) {
      const { $page, $flow, $application } = context;
      $page.variables.oj_table_1410790259_1SelectedId = departmentId;
    }
  }

  return ojTable14107902591ChangeSelectionChain;
});
