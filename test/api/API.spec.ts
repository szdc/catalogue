import { assert } from 'chai';
import { AxiosResponse } from 'axios';

import API from '../../src/api';

describe('API', () => {
  describe('#parseResponseAsJSON()', () => {
    it('should turn a JSONP response into JSON', () => {
      const saleFinderResponse = { data: '({"content":"<div></div>"})' } as AxiosResponse;
      const jsonResponse = API.parseResponseAsJSON(saleFinderResponse);
      assert.deepEqual(jsonResponse, {
        content: '<div></div>',
      });
    });
  });
});
