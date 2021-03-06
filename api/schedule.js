// Declaracion de dependencias
const cryptr = require('cryptr');
const executionTime = require('execution-time')();
const nodeSchedule = require('node-schedule');
const request = require('request');
const requestPromise = require('request-promise');
const settings = require('./../config/settings');
const {
  daemon, documents, limitSynchronization, synchronization, tokenExpires,
} = require('./../config/sii');
const { errorTraceRaven } = require('./../utils/general');
const {
  getCredentials, getDTE, getDocuments, getSummary, mapperDocument,
} = require('./../utils/sii');
const Cryptr = new cryptr(settings.endpoint.crypt);

// Configuracion de la URL del entorno de la API
const apiUrl = `http://localhost:${settings.port}`;

// Se inicializan los demonios
exports.init = () => {
  // Se realiza ejecucion del demonio [cada 10 segundos]
  nodeSchedule.scheduleJob('*/10 * * * * *', () => {
    // Se procede a realizar la llamada para obtener las colas pendientes de notificacion para sincronizacion finalizada
    if (daemon.queue) {
      getQueue('', limitSynchronization.queue, true)
        .then((responseGetQueue) => {
          responseGetQueue.results.forEach((queue) => {
            // Se procede a realizar la llamada para obtener los documentos pendientes de sincronizacion
            getDocument(1, queue.user)
              .then((responseGetDocument) => {
                // Se procede a notificar que se acaba de sincronizar todos los documentos del cliente
                if (responseGetDocument.paging.count === 0) {
                  connectAPIFacturaQueue(queue._id, queue.user);
                }
              })
              // Se procede a notificar en caso de que se presente algun error al obtener las colas pendientes de notificacion para la sincronizacion finalizada
              .catch((errorGetDocument) => {
                errorTraceRaven(errorGetDocument);
                errorGetDocument = null;
              });
          });
        })
        // Se procede a notificar en caso de que se presente algun error al obtener las colas pendientes de notificacion para la sincronizacion finalizada
        .catch((errorGetQueue) => {
          errorTraceRaven(errorGetQueue);
          errorGetQueue = null;
        });
    }
    // Se procede a realizar la llamada para obtener los documentos pendientes de sincronizacion
    if (daemon.document) {
      getDocument()
        .then(async (responseGetDocument) => {
          const listPending = [];
          // Se envia una solicitud de sincronizacion del documento
          await responseGetDocument.results.forEach((document) => {
            listPending.push(document._id);
          });
          if (listPending.length > 0) {
            await documentPending(listPending);
          }
          responseGetDocument.results.forEach((document) => {
            connectAPIFacturaDocument(document, 'POST');
          });
        })
        // Se procede a notificar en caso de que se presente algun error al obtener los documentos pendientes de sincronizacion
        .catch((errorGetDocument) => {
          errorTraceRaven(errorGetDocument);
          errorGetDocument = null;
        });
    }
    // Se procede a realizar la llamada para obtener los documentos pendientes de sincronizacion
    if (daemon.dte) {
      getDocument(limitSynchronization.dte, null, false)
        .then((responseGetDocument) => {
          // Se envia una solicitud de sincronizacion del documento
          responseGetDocument.results.forEach((document) => {
            // Se procede a realizar la llamada para obtener las credenciales del acceso al SII
            getCredential(document.transaction.user)
              // Se procede en caso de obtener las credenciales
              .then((responseCredential) => {
                if (responseCredential.paging.count > 0) {
                  // Se procede a generar la estructura con los datos para el procesamiento
                  let transaction = {
                    certificate: responseCredential.results[0].certificate,
                    id: responseCredential.results[0]._id,
                    password: responseCredential.results[0].password,
                    session: responseCredential.results[0].session,
                    user: document.transaction.user,
                  };
                  // Se procede a verificar si se posee el token del SII
                  if (transaction.session.token && new Date(transaction.session.expires) > new Date()) {
                    getDTE(transaction, document);
                    document = transaction = null;
                  } else {
                    getCredentials(transaction.user, transaction.password, true)
                      // Se procede a verificar si se realizo correctamente el ingreso al SII
                      .then((responseSession) => {
                        if (Object.keys(responseSession).length > 0) {
                          transaction.session.expires = new Date(Date.now() + tokenExpires);
                          transaction.session.token = responseSession.TOKEN;
                          // Se procede a actualizar el token del SII
                          tokenUpdate(transaction)
                            // Se procede a obtener los documentos del periodo tributario correspondiente
                            .then(() => {
                              getDTE(transaction, document);
                              document = transaction = null;
                            })
                            // Se procede a notificar en caso de que se presente algun error al actualizar el token
                            .catch((errorUpdateToken) => {
                              errorTraceRaven(errorUpdateToken);
                              errorUpdateToken = null;
                            });
                        }
                        responseSession = null;
                      })
                      // Se procede a notificar en caso de que se presente algun error al obtener el token
                      .catch((errorSession) => {
                        errorTraceRaven(errorSession);
                        errorSession = null;
                      });
                  }
                }
                responseCredential = null;
              })
              // Se procede a notificar en caso de que se presente algun error al obtener las credenciales
              .catch((errorCredential) => {
                errorTraceRaven(errorCredential);
                errorCredential = null;
              });
          });
        })
        // Se procede a notificar en caso de que se presente algun error al obtener los documentos pendientes de sincronizacion
        .catch((errorGetDocument) => {
          errorTraceRaven(errorGetDocument);
          errorGetDocument = null;
        });
    }
    // Se procede a realizar la llamada para obtener las colas Prioritarias que se deben ejecutar
    if (daemon.synchronization) {
      getQueue('Priority', 5)
        // Se procede en caso de obtener las colas
        .then((responseQueue) => {
          // Se procede a ejecutar cada cola del listado
          responseQueue.results.forEach((queue) => {
            // Se procede a realizar la llamada para obtener las credenciales del acceso al SII
            getCredential(queue.user)
              // Se procede en caso de obtener las credenciales
              .then((responseCredential) => {
                if (responseCredential.paging.count > 0) {
                  // Se procede a generar la estructura con los datos para el procesamiento
                  let transaction = {
                    certificate: responseCredential.results[0].certificate,
                    id: responseCredential.results[0]._id,
                    password: responseCredential.results[0].password,
                    queue: queue._id,
                    session: responseCredential.results[0].session,
                    synchronize: queue.synchronize,
                    user: queue.user,
                  };
                  // Se procede a verificar si se posee el token del SII
                  if (transaction.session.token && new Date(transaction.session.expires) > new Date()) {
                    getService(transaction);
                    transaction = null;
                  } else {
                    executionTime.start('getCredentials');
                    getCredentials(transaction.user, transaction.password, true)
                      // Se procede a verificar si se realizo correctamente el ingreso al SII
                      .then((responseSession) => {
                        auditCreate(transaction.user, 'Credential', executionTime.stop('getCredentials').time);
                        if (Object.keys(responseSession).length > 0) {
                          transaction.session.expires = new Date(Date.now() + tokenExpires);
                          transaction.session.token = responseSession.TOKEN;
                          // Se procede a actualizar el token del SII
                          tokenUpdate(transaction)
                            // Se procede a obtener los documentos del periodo tributario correspondiente
                            .then(() => {
                              getService(transaction);
                              transaction = null;
                            })
                            // Se procede a notificar en caso de que se presente algun error al actualizar el token
                            .catch((errorUpdateToken) => {
                              errorTraceRaven(errorUpdateToken);
                              errorUpdateToken = null;
                            });
                        }
                        responseSession = null;
                      })
                      // Se procede a notificar en caso de que se presente algun error al obtener el token
                      .catch((errorSession) => {
                        auditCreate(transaction.user, 'Credential', executionTime.stop('getCredentials').time);
                        errorTraceRaven(errorSession);
                        errorSession = null;
                      });
                  }
                }
                responseCredential = null;
              })
              // Se procede a notificar en caso de que se presente algun error al obtener las credenciales
              .catch((errorCredential) => {
                errorTraceRaven(errorCredential);
                errorCredential = null;
              });
          });
        })
        // Se procede a notificar en caso de que se presente algun error al obtener las colas
        .catch((errorQueue) => {
          errorTraceRaven(errorQueue);
          errorQueue = null;
        });
    }
  });
  // Se realiza ejecucion del demonio [cada 2 minutos y 30 segundos]
  nodeSchedule.scheduleJob('30 */2 * * * *', () => {
    if (daemon.synchronization) {
      // Se procede a realizar la llamada para obtener las colas Automaticas que se deben ejecutar
      getQueue('Automatic', 50)
        // Se procede en caso de obtener las colas
        .then((responseQueue) => {
          // Se procede a ejecutar cada cola del listado
          responseQueue.results.forEach((queue) => {
            // Se procede a realizar la llamada para obtener las credenciales del acceso al SII
            getCredential(queue.user)
              // Se procede en caso de obtener las credenciales
              .then((responseCredential) => {
                if (responseCredential.paging.count > 0) {
                  // Se procede a generar la estructura con los datos para el procesamiento
                  let transaction = {
                    certificate: responseCredential.results[0].certificate,
                    id: responseCredential.results[0]._id,
                    password: responseCredential.results[0].password,
                    queue: queue._id,
                    session: responseCredential.results[0].session,
                    synchronize: queue.synchronize,
                    user: queue.user,
                  };
                  // Se procede a verificar si se posee el token del SII
                  if (transaction.session.token && new Date(transaction.session.expires) > new Date()) {
                    getService(transaction);
                    transaction = null;
                  } else {
                    executionTime.start('getCredentials');
                    getCredentials(transaction.user, transaction.password, true)
                      // Se procede a verificar si se realizo correctamente el ingreso al SII
                      .then((responseSession) => {
                        auditCreate(transaction.user, 'Credential', executionTime.stop('getCredentials').time);
                        if (Object.keys(responseSession).length > 0) {
                          transaction.session.expires = new Date(Date.now() + tokenExpires);
                          transaction.session.token = responseSession.TOKEN;
                          // Se procede a actualizar el token del SII
                          tokenUpdate(transaction)
                            // Se procede a obtener los documentos del periodo tributario correspondiente
                            .then(() => {
                              getService(transaction);
                              transaction = null;
                            })
                            // Se procede a notificar en caso de que se presente algun error al actualizar el token
                            .catch((errorUpdateToken) => {
                              errorTraceRaven(errorUpdateToken);
                              errorUpdateToken = null;
                            });
                        } else {
                          // Se procede a detener la cola de ejecucion
                          queueStop(transaction.queue)
                            // Se procede a notificar la detencion de la cola de ejecucion
                            .then(() => {
                              connectAPIFacturaCredential(transaction.queue, transaction.user);
                              transaction = null;
                            })
                            // Se procede a notificar en caso de que se presente algun error al notificar la detencion de la cola de ejecucion
                            .catch((errorQueueStop) => {
                              errorTraceRaven(errorQueueStop);
                              errorQueueStop = null;
                            });
                        }
                        responseSession = null;
                      })
                      // Se procede a notificar en caso de que se presente algun error al obtener el token
                      .catch((errorSession) => {
                        auditCreate(transaction.user, 'Credential', executionTime.stop('getCredentials').time);
                        errorTraceRaven(errorSession);
                        errorSession = null;
                      });
                  }
                }
                responseCredential = null;
              })
              // Se procede a notificar en caso de que se presente algun error al obtener las credenciales
              .catch((errorCredential) => {
                errorTraceRaven(errorCredential);
                errorCredential = null;
              });
          });
        })
        // Se procede a notificar en caso de que se presente algun error al obtener las colas
        .catch((errorQueue) => {
          errorTraceRaven(errorQueue);
          errorQueue = null;
        });
    }
  });
};

/**
 * Function auditCreate
 * Parametros de entrada
 * period (opcional) => Año y mes del periodo a consultar
 * time (requerido) => Tiempo de ejecucion en milisegundos de la consulta en el SII
 * type (requerido) => Tipo de consulta a realizar en el SII
 * user (requerido) => Usuario con el cual se consultan los datos en el SII
 */
function auditCreate(user, type, time, period = null) {
  // Configuramos la peticion de la llamada de creacion de una auditoria
  const options = {
    body: {
      period,
      time,
      type,
      user,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method: 'POST',
    resolveWithFullResponse: true,
    uri: `${apiUrl}/sii/audit`,
  };
  request(options, (error) => {
    if (error) {
      // Se procede a notificar en caso de que se presente algun error al crear una auditoria
      errorTraceRaven(error);
      auditCreate(user, type, time, period);
      error = null;
    } else {
      // Se eliminan las variables que ya no se ocupan en el metodo
      period = time = type = user = null;
    }
  });
}

/**
 * Function connectAPIFacturaCredential
 * Parametros de entrada
 * queue => Identificador de la cola
 * user => Identificador del usuario
 */
function connectAPIFacturaCredential(queue, user) {
  // Configuramos la peticion de la llamada de sincronizacion de colas
  let options = {
    body: {
      queue,
      user,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method: 'POST',
    resolveWithFullResponse: true,
    uri: synchronization.credential,
  };
  requestPromise(options)
    // Se procede a enviar la respuesta de la sincronizacion de la cola
    .then(() => {})
    // Se procede a notificar en caso de que se presente algun error al sincronizar los colas
    .catch((error) => {
      errorTraceRaven(error);
      error = null;
    })
    // Se procede a eliminar las variables temporales de la ejecucion
    .finally(() => {
      options = queue = null;
    });
}

/**
 * Function connectAPIFacturaDocument
 * Parametros de entrada
 * document => Documento a guardar en la base de datos
 * method => ['POST', 'PUT']
 */
function connectAPIFacturaDocument(document, method) {
  // Configuramos la peticion de la llamada de sincronizacion de documentos
  let options = {
    body: document,
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method,
    resolveWithFullResponse: true,
    uri: synchronization.document,
  };
  requestPromise(options)
    // Se procede a enviar la respuesta de la sincronizacion del documento
    .then(() => {
      documentSend(document._id, {
        execute: true,
        error: {
          code: null,
          message: null,
        },
        pending: false,
      });
    })
    // Se procede a notificar en caso de que se presente algun error al sincronizar los documentos
    .catch((error) => {
      documentSend(document._id, {
        execute: true,
        error: {
          code: error.status || 0,
          message: error.type || 'Generic Response Error',
        },
        pending: false,
      });
      errorTraceRaven(error);
      error = null;
    })
    // Se procede a eliminar las variables temporales de la ejecucion
    .finally(() => {
      document = method = options = null;
    });
}

/**
 * Function connectAPIFacturaQueue
 * Parametros de entrada
 * queue => Identificador de la cola
 * user => Identificador del usuario
 */
function connectAPIFacturaQueue(queue, user) {
  // Configuramos la peticion de la llamada de sincronizacion de colas
  let options = {
    body: {
      transaction: {
        queue,
        user,
      },
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method: 'POST',
    resolveWithFullResponse: true,
    uri: synchronization.queue,
  };
  requestPromise(options)
    // Se procede a actualizar el registro de la cola
    .then(() => {
      synchronizeUpdate({ queue }, null, null, null, true);
    })
    // Se procede a notificar en caso de que se presente algun error al sincronizar los colas
    .catch((error) => {
      errorTraceRaven(error);
      error = null;
    })
    // Se procede a eliminar las variables temporales de la ejecucion
    .finally(() => {
      options = queue = null;
    });
}

/**
 * Function documentCreate
 * Parametros de entrada
 * document => Documento a guardar en la base de datos
 */
function documentCreate(listDocuments) {
  // Configuramos la peticion de la llamada de creacion de un documento
  let options = {
    body: listDocuments,
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method: 'POST',
    resolveWithFullResponse: true,
    uri: `${apiUrl}/sii/document/multiple`,
  };
  request(options, (error) => {
    if (error) {
      // Se procede a notificar en caso de que se presente algun error al crear un documento
      errorTraceRaven(error);
      documentCreate(listDocuments);
    } else {
      // Se eliminan las variables que ya no se ocupan en el metodo
      error = listDocuments = options = null;
    }
  });
}

/**
 * Function documentPending
 * Parametros de entrada
 * listPending => Listado de identificadores de documentos
 */
function documentPending(listPending) {
  // Configuramos la peticion de la llamada de actualizacion de un documento
  let options = {
    body: {
      listPending,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method: 'PUT',
    resolveWithFullResponse: true,
    uri: `${apiUrl}/sii/document/pending`,
  };
  request(options, (error) => {
    if (error) {
      // Se procede a notificar en caso de que se presente algun error al actualizar los documentos
      errorTraceRaven(error);
      documentPending(listPending);
    } else {
      // Se eliminan las variables que ya no se ocupan en el metodo
      error = listPending = options = null;
    }
  });
}

/**
 * Function documentSend
 * Parametros de entrada
 * documentId => Identificador del documento
 * send => Objecto con la estructura de notificacion del envio de sincronizacion
 */
function documentSend(documentId, send) {
  // Configuramos la peticion de la llamada de actualizacion de un documento
  let options = {
    body: {
      send,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method: 'PUT',
    resolveWithFullResponse: true,
    uri: `${apiUrl}/sii/document/${documentId}`,
  };
  request(options, (error) => {
    if (error) {
      // Se procede a notificar en caso de que se presente algun error al actualizar un documento
      errorTraceRaven(error);
      documentSend(documentId, send);
    } else {
      // Se eliminan las variables que ya no se ocupan en el metodo
      documentId = error = options = send = null;
    }
  });
}

/**
 * Function getCredential
 * Parametros de entrada
 * user => RUT formato 12.345.678-9
 */
function getCredential(user) {
  return new Promise((resolve, reject) => {
    // Configuramos la peticion de la llamada de obtencion de una credencial
    const options = {
      body: {},
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'GET',
      resolveWithFullResponse: true,
      uri: `${apiUrl}/sii/credential?user=${user}`,
    };
    requestPromise(options)
      // Se procede a enviar la respuesta de la obtencion de la credencial
      .then((response) => {
        resolve(response.body);
      })
      // Se procede a notificar en caso de que se presente algun error al obtener la credencial
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Function getDocument
 * Parametros de entrada
 * limit => Limite de busqueda de documentos pendientes de sincronizacion
 * user => Usuario del documento
 */
function getDocument(limit, user = null, send = true) {
  return new Promise((resolve, reject) => {
    // Configuramos la peticion de la llamada de obtencion de una credencial
    const options = {
      body: {},
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'GET',
      resolveWithFullResponse: true,
      uri: `${apiUrl}/sii/document?page=1&order=asc`,
    };
    if (limit) {
      options.uri += limit ? `&limit=${limit}` : '&sync&pending';
    }
    if (send) {
      options.uri += send ? '&send' : '';
    }
    if (user) {
      options.uri += `&user=${user.replace(/\./g, '')}`;
    }
    requestPromise(options)
      // Se procede a enviar la respuesta de la obtencion de los documentos pendientes de sincronizacion
      .then((response) => {
        resolve(response.body);
      })
      // Se procede a notificar en caso de que se presente algun error al obtener el listado de documentos pendientes de sincronizacion
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Function getQueue
 * Parametros de entrada
 * type => ['Priority', 'Manual']
 * limit => [1 ... 500]
 */
function getQueue(type, limit, send = false) {
  return new Promise((resolve, reject) => {
    // Obtenemos el listado de la cola a procesar segun el tipo
    let options = {
      body: {},
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'GET',
      resolveWithFullResponse: true,
      uri: `${apiUrl}/sii/queue?limit=${limit}&page=1&order=asc`,
    };
    // Se verifica si se necesita aplicar el filtro de solo los pendientes de notificacion de sincronizacion
    if (type) {
      options.uri += type ? `&type=${type}` : '';
    }
    if (send) {
      options.uri += '&send';
    }
    requestPromise(options)
      // Se procede a enviar la respuesta de la obtencion de la cola
      .then((response) => {
        resolve(response.body);
        response = null;
      })
      // Se procede a notificar en caso de que se presente algun error al obtener la cola
      .catch((error) => {
        reject(error);
        error = null;
      })
      // Se procede a eliminar las variables temporales de la ejecucion
      .finally(() => {
        options = limit = type = null;
      });
  });
}

/**
 * Function getService
 * Parametros de entrada
 * type => ['Priority', 'Manual']
 * limit => [1 ... 500]
 */
function getService(transaction) {
  const now = new Date();
  let month;
  let period;
  let typeSync = 'Automatic';
  let year;
  // Se procede a verificar que tipo de procesamiento corresponde la cola
  if (transaction.synchronize.period) {
    ({ period } = transaction.synchronize);
    month = parseInt(period.substr(4, 5), 10);
    year = parseInt(period.substr(0, 4), 10);
    typeSync = now.getFullYear() > year || (now.getFullYear() === year && now.getMonth() + 1) > month ? 'Priority' : 'Automatic';
  } else {
    month = now.getMonth() + 1;
    year = now.getFullYear();
  }
  // Se procede a actualizar la cola en caso de cambiar la prioridad
  synchronizeUpdate(transaction, month < 12 ? year : year + 1, month < 12 ? month + 1 : 1, typeSync)
    // Se procede a recorrer los tipos de documentos de Compra y Venta que se necesitan
    .then(() => {
      const executions = [];
      documents.forEach((document) => {
        document.list.forEach(async (row) => {
          const execution = {
            code: `${document.key}.${row}`,
            period: `${year}${month < 10 ? `0${month}` : month}`,
            types: [],
          };
          // Se procede a obtener la cantidad de documentos de un tipo de operacion
          executionTime.start('getSummary');
          await getSummary(transaction, {
            operation: document.key,
            state: row,
            url: document.url,
          }, year, month < 10 ? `${0}${month}` : month)
            .then((responseGetSummary) => {
              auditCreate(transaction.user, 'Summary', executionTime.stop('getSummary').time, execution.period);
              // Se obtienen la cantidad de documentos por cada una de las categorias consultadas
              if (Array.isArray(responseGetSummary) && responseGetSummary.length > 0) {
                responseGetSummary.forEach((aux) => {
                  if (aux.rsmnTotDoc && aux.rsmnTotDoc > 0) {
                    execution.types.push({
                      code: aux.rsmnTipoDocInteger,
                      count: aux.rsmnTotDoc,
                    });
                  }
                });
              }
              responseGetSummary.forEach((type) => {
                // Se procede a obtener los documentos de un tipo de operacion
                executionTime.start('getDocuments');
                getDocuments(transaction, {
                  document: String(type.rsmnTipoDocInteger),
                  operation: document.key,
                  state: row,
                  url: document.url,
                }, year, month < 10 ? `${0}${month}` : month)
                  .then(async (responseGetDocuments) => {
                    auditCreate(transaction.user, 'Documents', executionTime.stop('getDocuments').time, execution.period);
                    if (Array.isArray(responseGetDocuments)) {
                      const list = await responseGetDocuments.map((rowDocument) => {
                        // Se procede a procesar el documento obtenido
                        return mapperDocument(rowDocument, type.rsmnTipoDocInteger, document.key, transaction.user, transaction.queue);
                      });
                      const limit = limitSynchronization.saveMany;
                      const counter = list.length;
                      for (let i = 0; i * limit < counter; i += 1) {
                        documentCreate(list.slice(i * limit, i * limit + limit));
                      }
                    }
                  })
                  // Se procede a notificar en caso de que se presente algun error al obtener los documentos del periodo tributario
                  .catch((errorGetDocuments) => {
                    auditCreate(transaction.user, 'Documents', executionTime.stop('getDocuments').time);
                    errorTraceRaven(errorGetDocuments);
                  });
              });
            })
            // Se procede a notificar en caso de que se presente algun error al obtener el resumen del periodo tributario
            .catch((errorGetSummary) => {
              auditCreate(transaction.user, 'Summary', executionTime.stop('getSummary').time);
              errorTraceRaven(errorGetSummary);
            });
          await executions.push(execution);
          if (executions.length === 5) {
            await queueExecutions(transaction.queue, executions);
          }
        });
      });
    })
    // Se procede a notificar en caso de que se presente algun error al actualizar la sincronizacion
    .catch((errorSynchronizeUpdate) => {
      errorTraceRaven(errorSynchronizeUpdate);
    });
}

/**
 * Function queueExecutions
 * Parametros de entrada
 * queue => Identificador de la cola
 * executions => Arreglo de objetos con los datos del periodo tributario
 */
function queueExecutions(queue, executions) {
  // Configuramos la peticion de la llamada para obtener una cola
  let options = {
    body: {},
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    method: 'GET',
    resolveWithFullResponse: true,
    uri: `${apiUrl}/sii/queue/${queue}`,
  };
  requestPromise(options)
    // Se procede a actualizar la cola
    .then(async (response) => {
      await response.body.executions.forEach(async (row, key) => {
        await executions.forEach(async (execution) => {
          if (row.period === execution.period && row.code === execution.code) {
            response.body.executions[key].types = execution.types;
          }
        });
      });
      await executions.forEach(async (execution) => {
        let exist = false;
        await response.body.executions.forEach(async (row) => {
          if (row.period === execution.period && row.code === execution.code) {
            exist = true;
          }
        });
        if (!exist) {
          response.body.executions.push(execution);
        }
      });
      // Configuramos la peticion de la llamada para obtener una cola
      options = {
        body: response.body,
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        method: 'PUT',
        resolveWithFullResponse: true,
        uri: `${apiUrl}/sii/queue/${queue}`,
      };
      requestPromise(options)
        // Se procede a actualizar la cola
        .then(() => {})
        // Se procede a notificar en caso de que se presente algun error al obtener una cola
        .catch((errorUpdate) => {
          errorTraceRaven(errorUpdate);
          errorUpdate = null;
        });
    })
    // Se procede a notificar en caso de que se presente algun error al obtener una cola
    .catch((error) => {
      errorTraceRaven(error);
      error = null;
    })
    // Se procede a eliminar las variables temporales de la ejecucion
    .finally(() => {
      executions = options = queue = null;
    });
}

/**
 * Function synchronizeUpdate
 * Parametros de entrada
 * transaction => Objeto completo del servicio API /queue/:id
 * year => yyyy
 * month => mm
 * type => ['Automatic', 'Priority']
 */
function queueStop(queueId) {
  return new Promise((resolve, reject) => {
    // Actualizamos la cola de sincronizacion
    let options = {
      body: {
        active: false,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'PUT',
      resolveWithFullResponse: true,
      uri: `${apiUrl}/sii/queue/${queueId}`,
    };
    requestPromise(options)
      // Se procede a enviar la respuesta de la actualizacion de la sincronizacion
      .then(() => {
        resolve();
      })
      // Se procede a notificar en caso de que se presente algun error al actualizar la sincronizacion
      .catch((error) => {
        reject(error);
        error = null;
      })
      // Se procede a eliminar las variables temporales de la ejecucion
      .finally(() => {
        options = queueId = null;
      });
  });
}

/**
 * Function synchronizeUpdate
 * Parametros de entrada
 * transaction => Objeto completo del servicio API /queue/:id
 * year => yyyy
 * month => mm
 * type => ['Automatic', 'Priority']
 */
function synchronizeUpdate(transaction, year, month, type = 'Automatic', sync = false) {
  return new Promise((resolve, reject) => {
    // Actualizamos la cola de sincronizacion
    let options = {
      body: {
        synchronize: {
          date: new Date(),
          period: sync ? null : type !== 'Automatic' ? `${year}${month < 10 ? `${0}${month}` : month}` : null,
          status: sync,
          type: sync ? 'Automatic' : type,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'PUT',
      resolveWithFullResponse: true,
      uri: `${apiUrl}/sii/queue/${transaction.queue}`,
    };
    requestPromise(options)
      // Se procede a enviar la respuesta de la actualizacion de la sincronizacion
      .then(() => {
        resolve();
      })
      // Se procede a notificar en caso de que se presente algun error al actualizar la sincronizacion
      .catch((error) => {
        reject(error);
        error = null;
      })
      // Se procede a eliminar las variables temporales de la ejecucion
      .finally(() => {
        month = options = transaction = type = year = null;
      });
  });
}

/**
 * Function tokenUpdate
 * Parametros de entrada
 * credential => Objeto completo del servicio API /credential
 */
function tokenUpdate(credential) {
  return new Promise((resolve, reject) => {
    // Se desencripta la clave protegida
    credential.password = Cryptr.decrypt(credential.password);
    // Actualizamos el token de la credencial obtenida
    let options = {
      body: credential,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'PUT',
      resolveWithFullResponse: true,
      uri: `${apiUrl}/sii/credential/${credential.id}`,
    };
    requestPromise(options)
      // Se procede a enviar la respuesta de la actualizacion del token
      .then((response) => {
        resolve(response.body);
        response = null;
      })
      // Se procede a notificar en caso de que se presente algun error al actualizar el token
      .catch((error) => {
        reject(error);
        error = null;
      })
      // Se procede a eliminar las variables temporales de la ejecucion
      .finally(() => {
        credential = options = null;
      });
  });
}
