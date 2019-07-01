// Declaracion de dependencias
const cryptr = require('cryptr');
const settings = require('./../config/settings');
const {
  getCredentials, getDocuments, getSummary, mapperDocument,
} = require('./sii');
const { users } = require('./../config/sii');

// Declaracion de mocks de pruebas
const { inputMapperDocument, outputMapperDocument } = require('./sii.mocks');

// Declaracion de variables auxiliares
const Cryptr = new cryptr(settings.endpoint.crypt);

// Configuracion del contador
let counter = 0;
function getCounter() {
  counter += 1;
  return counter < 10 ? `0${counter}` : counter;
}

/**
 * Pruebas del metodo getCredentials()
 */
test(`Prueba ${getCounter()} - Metodo getCredentials()`, () => {
  counter += 1;
  getCredentials(Cryptr.decrypt(users[0].user), users[0].password, true)
    .then((response) => {
      expect(Object.keys(response).length).toBeGreaterThan(0);
    })
    .catch((error) => {
      expect(error).toEqual(null);
    });
}, 10000);
test(`Prueba ${getCounter()} - Metodo getCredentials()`, () => {
  counter += 1;
  getCredentials(Cryptr.decrypt(users[1].user), users[1].password, true)
    .then((response) => {
      expect(Object.keys(response).length).toBeGreaterThan(0);
    })
    .catch((error) => {
      expect(error).toEqual(null);
    });
}, 10000);
test(`Prueba ${getCounter()} - Metodo getCredentials()`, () => {
  counter += 1;
  getCredentials(Cryptr.decrypt(users[2].user), users[2].password, true)
    .then((response) => {
      expect(Object.keys(response).length).toBeGreaterThan(0);
    })
    .catch((error) => {
      expect(error).toEqual(null);
    });
}, 10000);
test(`Prueba ${getCounter()} - Metodo getCredentials()`, () => {
  counter += 1;
  getCredentials(Cryptr.decrypt(users[1].user), users[0].password, true)
    .then((response) => {
      expect(Object.keys(response).length > 0).toEqual(false);
    })
    .catch((error) => {
      expect(error).toEqual(null);
    });
}, 10000);
test(`Prueba ${getCounter()} - Metodo getCredentials()`, () => {
  counter += 1;
  getCredentials(Cryptr.decrypt(users[1].user), users[0].password, true)
    .then((response) => {
      expect(Object.keys(response).length > 0).toEqual(false);
    })
    .catch((error) => {
      expect(error).toEqual(null);
    });
}, 10000);

/**
 * Pruebas del metodo getDocuments()
 */
test(`Prueba ${getCounter()} - Metodo getDocuments()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[0].user), users[0].password, true);
  const response = await getDocuments({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    document: '33',
    operation: 'COMPRA',
    state: 'REGISTRO',
    url: 'getDetalleCompra',
  }, '2019', '03');
  expect(response.length).toEqual(0);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getDocuments()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[1].user), users[1].password, true);
  const response = await getDocuments({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    document: '33',
    operation: 'COMPRA',
    state: 'REGISTRO',
    url: 'getDetalleCompra',
  }, '2019', '03');
  expect(response.length).toEqual(13);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getDocuments()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[2].user), users[2].password, true);
  const response = await getDocuments({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    document: '33',
    operation: 'COMPRA',
    state: 'REGISTRO',
    url: 'getDetalleCompra',
  }, '2019', '03');
  expect(response.length).toEqual(87);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getDocuments()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[1].user), users[1].password, true);
  const response = await getDocuments({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    document: '33',
    operation: 'VENTA',
    state: 'REGISTRO',
    url: 'getDetalleVenta',
  }, '2019', '03');
  expect(response.length).toEqual(1);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getDocuments()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[1].user), users[1].password, true);
  const response = await getDocuments({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-K`,
  }, {
    document: '33',
    operation: 'VENTA',
    state: 'REGISTRO',
    url: 'getDetalleVenta',
  }, '2019', '03');
  expect(response.length).toEqual(0);
}, 10000);

/**
 * Pruebas del metodo getSummary()
 */
test(`Prueba ${getCounter()} - Metodo getSummary()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[0].user), users[0].password, true);
  const response = await getSummary({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    operation: 'COMPRA',
    state: 'REGISTRO',
  }, '2019', '03');
  expect(response.length).toEqual(0);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getSummary()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[1].user), users[1].password, true);
  const response = await getSummary({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    operation: 'COMPRA',
    state: 'REGISTRO',
  }, '2019', '03');
  expect(response.length).toEqual(2);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getSummary()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[2].user), users[2].password, true);
  const response = await getSummary({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    operation: 'COMPRA',
    state: 'REGISTRO',
  }, '2019', '03');
  expect(response.length).toEqual(3);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getSummary()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[2].user), users[2].password, true);
  const response = await getSummary({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-${credentials.DV_NS}`,
  }, {
    operation: 'VENTA',
    state: 'REGISTRO',
  }, '2019', '03');
  expect(response.length).toEqual(2);
}, 10000);
test(`Prueba ${getCounter()} - Metodo getSummary()`, async () => {
  counter += 1;
  const credentials = await getCredentials(Cryptr.decrypt(users[1].user), users[1].password, true);
  const response = await getSummary({
    session: {
      token: credentials.TOKEN,
    },
    user: `${credentials.RUT_NS}-K`,
  }, {
    operation: 'COMPRA',
    state: 'REGISTRO',
  }, '2019', '03');
  expect(response.length).toEqual(0);
}, 10000);

/**
 * Pruebas del metodo mapperDocument()
 */
test(`Prueba ${getCounter()} - Metodo mapperDocument()`, async () => {
  counter += 1;
  const response = await mapperDocument(inputMapperDocument[0], 1, 'COMPRA', null, null);
  expect(response).toEqual(outputMapperDocument[0]);
}, 10000);
test(`Prueba ${getCounter()} - Metodo mapperDocument()`, async () => {
  counter += 1;
  const response = await mapperDocument(inputMapperDocument[1], 2, 'VENTA', null, null);
  expect(response).toEqual(outputMapperDocument[1]);
}, 10000);
test(`Prueba ${getCounter()} - Metodo mapperDocument()`, async () => {
  counter += 1;
  const response = await mapperDocument(inputMapperDocument[2], null);
  expect(response).toEqual(outputMapperDocument[2]);
}, 10000);
test(`Prueba ${getCounter()} - Metodo mapperDocument()`, async () => {
  counter += 1;
  const response = await mapperDocument(inputMapperDocument[3], 1, 'COMPRA', '1-1', '1234567890');
  expect(response).toEqual(outputMapperDocument[3]);
}, 10000);
test(`Prueba ${getCounter()} - Metodo mapperDocument()`, async () => {
  counter += 1;
  const response = await mapperDocument();
  expect(response).toEqual({});
}, 10000);
