import pactum from 'pactum';

describe('Integração ReqRes - POST + GET', () => {
  const BASE_URL = 'https://reqres.in/api';
  const API_KEY = 'pro_39c1afc198808f799930654837d787f2b86f11bb9a8530bf5db68870cd0f41d3';

  test('deve criar usuário e depois validar listagem', async () => {
    const postResponse = await pactum
      .spec()
      .post(`${BASE_URL}/users`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        name: 'Patricia',
        job: 'QA'
      })
      .expectStatus(201);

    expect(postResponse.body.name).toBe('Patricia');
    expect(postResponse.body.job).toBe('QA');
    expect(postResponse.body.id).toBeDefined();

    const getResponse = await pactum
      .spec()
      .get(`${BASE_URL}/users?page=2`)
      .withHeaders('x-api-key', API_KEY)
      .expectStatus(200);

    expect(getResponse.body.page).toBe(2);
    expect(Array.isArray(getResponse.body.data)).toBe(true);
    expect(getResponse.body.data.length).toBeGreaterThan(0);
  });
});