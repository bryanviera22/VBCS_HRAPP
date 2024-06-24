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

  class InputTextValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application } = context;

      const callRestCountriesGetAlphaCodeResult = await Actions.callRest(context, {
        endpoint: 'Countries/getAlphaCode',
        uriParams: {
          code: $page.variables.employee.country,
        },
      });

      $page.variables.countryTypeVar = callRestCountriesGetAlphaCodeResult.body;
    }
  }

  return InputTextValueChangeChain;
});
