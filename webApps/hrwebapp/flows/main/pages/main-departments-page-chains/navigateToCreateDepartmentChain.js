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

  class navigateToCreateDepartmentChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;
      const navigateToPageMainCreateDepartmentResult = await Actions.navigateToPage(context, {
        page: 'main-create-department',
        params: {},
      });
    }
  }

  return navigateToCreateDepartmentChain;
});
