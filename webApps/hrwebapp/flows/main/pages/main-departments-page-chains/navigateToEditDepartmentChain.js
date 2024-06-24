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

  class navigateToEditDepartmentChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.departmentId
     */
    async run(context, { departmentId }) {
      const { $page, $flow, $application } = context;
      const navigateToPageMainEditDepartmentResult = await Actions.navigateToPage(context, {
        page: 'main-edit-department',
        params: {
          departmentId: departmentId,
        },
      });
    }
  }

  return navigateToEditDepartmentChain;
});
