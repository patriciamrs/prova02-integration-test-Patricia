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

  test('deve buscar usuário existente por ID', async () => {
    const response = await pactum
      .spec()
      .get(`${BASE_URL}/users/2`)
      .withHeaders('x-api-key', API_KEY)
      .expectStatus(200);

    expect(response.body.data.id).toBe(2);
    expect(response.body.data.email).toBeDefined();
    expect(response.body.data.first_name).toBeDefined();
  });

  test('deve retornar 404 ao buscar usuário inexistente', async () => {
    await pactum
      .spec()
      .get(`${BASE_URL}/users/999`)
      .withHeaders('x-api-key', API_KEY)
      .expectStatus(404);
  });

  test('deve listar recursos desconhecidos', async () => {
    const response = await pactum
      .spec()
      .get(`${BASE_URL}/unknown`)
      .withHeaders('x-api-key', API_KEY)
      .expectStatus(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('deve buscar recurso desconhecido existente por ID', async () => {
    const response = await pactum
      .spec()
      .get(`${BASE_URL}/unknown/2`)
      .withHeaders('x-api-key', API_KEY)
      .expectStatus(200);

    expect(response.body.data.id).toBe(2);
    expect(response.body.data.name).toBeDefined();
    expect(response.body.data.color).toBeDefined();
  });

  test('deve retornar 404 ao buscar recurso desconhecido inexistente', async () => {
    await pactum
      .spec()
      .get(`${BASE_URL}/unknown/999`)
      .withHeaders('x-api-key', API_KEY)
      .expectStatus(404);
  });

  test('deve criar usuário com outro cargo válido', async () => {
    const response = await pactum
      .spec()
      .post(`${BASE_URL}/users`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        name: 'Patricia',
        job: 'Tester'
      })
      .expectStatus(201);

    expect(response.body.name).toBe('Patricia');
    expect(response.body.job).toBe('Tester');
    expect(response.body.createdAt).toBeDefined();
  });

  test('deve atualizar usuário com PUT', async () => {
    const response = await pactum
      .spec()
      .put(`${BASE_URL}/users/2`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        name: 'Patricia',
        job: 'Senior QA'
      })
      .expectStatus(200);

    expect(response.body.name).toBe('Patricia');
    expect(response.body.job).toBe('Senior QA');
    expect(response.body.updatedAt).toBeDefined();
  });

  test('deve atualizar parcialmente usuário com PATCH', async () => {
    const response = await pactum
      .spec()
      .patch(`${BASE_URL}/users/2`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        job: 'Analista de Testes'
      })
      .expectStatus(200);

    expect(response.body.job).toBe('Analista de Testes');
    expect(response.body.updatedAt).toBeDefined();
  });

  test('deve excluir usuário', async () => {
    await pactum
      .spec()
      .delete(`${BASE_URL}/users/2`)
      .withHeaders('x-api-key', API_KEY)
      .expectStatus(204);
  });

  test('deve realizar login com credenciais válidas', async () => {
    const response = await pactum
      .spec()
      .post(`${BASE_URL}/login`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      })
      .expectStatus(200);

    expect(response.body.token).toBeDefined();
  });

  test('deve retornar erro ao realizar login sem senha', async () => {
    const response = await pactum
      .spec()
      .post(`${BASE_URL}/login`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        email: 'ptricia@gmail'
      })
      .expectStatus(400);

    expect(response.body.error).toBeDefined();
  });

  test('deve registrar usuário com sucesso', async () => {
    const response = await pactum
      .spec()
      .post(`${BASE_URL}/register`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        email: 'eve.holt@reqres.in',
        password: 'pistol'
      })
      .expectStatus(200);

    expect(response.body.id).toBeDefined();
    expect(response.body.token).toBeDefined();
  });

  test('deve retornar erro ao registrar usuário sem senha', async () => {
    const response = await pactum
      .spec()
      .post(`${BASE_URL}/register`)
      .withHeaders('x-api-key', API_KEY)
      .withJson({
        email: 'patricia@gmail'
      })
      .expectStatus(400);

    expect(response.body.error).toBeDefined();
  });

  test('deve listar usuários com delay', async () => {
    const response = await pactum
      .spec()
      .get(`${BASE_URL}/users?delay=3`)
      .withHeaders('x-api-key', API_KEY)
      .withRequestTimeout(10000)
      .expectStatus(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});