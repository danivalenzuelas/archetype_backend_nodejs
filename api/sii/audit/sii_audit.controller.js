// Declaracion de dependencias
const mongoose = require('mongoose');
const settings = require('../../../config/settings');
const { errorResponse } = require('../../../utils/errors');
const { errorTraceRaven } = require('../../../utils/general');

// Declaracion del esquema
const SiiAudit = mongoose.model('SiiAudit');

/**
 * Metodo Create
 * URI: /sii/audit
 * Method: POST
 */
exports.create = (req, res) => {
  // Se genera una instancia del esquema
  const newSiiAudit = new SiiAudit(req.body);
  // Se procede a almacenar el documento en la coleccion
  newSiiAudit.save()
    .then((response) => {
      // Se retorna la respuesta del documento almacenado
      res.status(201).json(response);
    })
    .catch((errorCreate) => {
      // Se retorna la respuesta con problemas
      errorTraceRaven(errorCreate);
      res.status(400).json({
        error: errorResponse('create').response,
        errorTrace: errorCreate,
      });
    });
};

/**
 * Metodo List
 * URI: /sii/audit
 * Method: GET
 */
exports.list = (req, res) => {
  // Se configuran los filtros que se aplicaran al listado
  const filters = {};
  filters.active = !Object.prototype.hasOwnProperty.call(req.query, 'notActive');
  filters.isDeleted = false;
  filters.limit = req.query.limit && Number.isInteger(parseInt(req.query.limit, 10)) ?
    (parseInt(req.query.limit, 10) < 1 || parseInt(req.query.limit, 10) > settings.endpoint.limit)
      ? settings.endpoint.limit
      : parseInt(req.query.limit, 10)
    : settings.endpoint.limit;
  filters.page = req.query.page && Number.isInteger(parseInt(req.query.page, 10)) ?
    parseInt(req.query.page, 10) < 1
      ? 0
      : filters.limit * (parseInt(req.query.page, 10) - 1)
    : 0;
  filters.query = Object.prototype.hasOwnProperty.call(req.query, 'short')
    ? '_id period time type user'
    : '';
  filters.sort = req.query.order && req.query.order === 'desc'
    ? -1
    : 1;
  filters.test = false;
  // Se aplican los filtros de logeo para el listado
  if (req.query.logs) {
    req.query.logs.split(',').forEach((log) => {
      switch (log) {
        case 'c':
          filters.catch = true;
          break;
        case 'd':
          filters.isDeleted = true;
          break;
        case 't':
          filters.test = true;
          break;
        default:
      }
    });
  }
  // Se genera la estructura de filtros para el esquema
  const query = {
    active: filters.active,
    'logs.isDeleted': filters.isDeleted,
    'logs.test': filters.test,
  };
  // Se obtiene la cantidad de documentos en la coleccion que coinciden con los filtros aplicados
  SiiAudit.countDocuments(query)
    .then((responseCount) => {
      // Se obtienen los documentos de la coleccion que coinciden con los filtros aplicados
      SiiAudit.find(query, filters.query, {
        limit: filters.limit,
        skip: filters.page,
        sort: {
          user: filters.sort,
        },
      })
        .then((responseList) => {
          // Se simula un error en la obtencion de documentos de la coleccion
          if (filters.catch) {
            throw new Error();
          } else {
            // Se retorna la respuesta de los documentos obtenidos
            res.status(200).json({
              paging: {
                count: responseList.length,
                limit: filters.limit,
                order: filters.sort === 1 ? 'asc' : 'desc',
                page: (filters.page / filters.limit) + 1,
                total: responseCount,
              },
              results: responseList,
            });
          }
        })
        .catch((errorList) => {
          // Se retorna la respuesta con problemas
          errorTraceRaven(errorList);
          res.status(404).json({
            error: errorResponse('list').response,
            errorTrace: errorList,
          });
        });
    });
};

/**
 * Metodo Remove
 * URI: /sii/audit/:id
 * Method: DELETE
 */
exports.remove = (req, res) => {
  // Se verifica que exista el documento en la coleccion
  SiiAudit.findById(req.params.id)
    .then((responseFind) => {
      // Se verifica que el documento no presente fallas, en caso de contar con fallas se retorna un error
      if (!responseFind) {
        throw new Error();
      }
      // Se genera el documento actualizado para ser actualizado
      const body = responseFind;
      body.logs.isDeleted = true;
      body.logs.updatedAt = new Date();
      // Se procede a actualizar el documento en la coleccion
      SiiAudit.findOneAndUpdate({
        _id: req.params.id,
      }, body, {
        new: true,
      })
        .then((responseRemove) => {
          // Se retorna la respuesta del documento actualizado
          res.status(200).json(responseRemove);
        });
    })
    .catch((errorFind) => {
      // Se retorna la respuesta con problemas
      errorTraceRaven(errorFind);
      res.status(404).send({
        error: errorResponse('remove').response,
        errorTrace: errorFind,
      });
    });
};

/**
 * Metodo Update
 * URI: /sii/audit/:id
 * Method: PUT
 */
exports.update = (req, res) => {
  // Se verifica que exista el documento en la coleccion
  SiiAudit.findById(req.params.id)
    .then((responseFind) => {
      // Se verifica que el documento no presente fallas, en caso de contar con fallas se retorna un error
      if (!responseFind) {
        throw new Error();
      }
      // Se genera el documento actualizado para ser actualizado
      const body = Object.assign(responseFind, req.body);
      body.logs.updatedAt = new Date();
      // Se procede a actualizar el documento en la coleccion
      SiiAudit.findOneAndUpdate({
        _id: req.params.id,
      }, body, {
        new: true,
      })
        .then((responseUpdate) => {
          // Se retorna la respuesta del documento actualizado
          res.status(200).json(responseUpdate);
        });
    })
    .catch((errorFind) => {
      // Se retorna la respuesta con problemas
      errorTraceRaven(errorFind);
      res.status(404).send({
        error: errorResponse('update').response,
        errorTrace: errorFind,
      });
    });
};

/**
 * Metodo View
 * URI: /sii/audit/:id
 * Method: GET
 */
exports.view = (req, res) => {
  // Se verifica que exista el documento en la coleccion
  SiiAudit.findById(req.params.id)
    .then((responseFind) => {
      // Se verifica que el documento no presente fallas, en caso de contar con fallas se retorna un error
      if (!responseFind) {
        throw new Error();
      }
      // Se retorna la respuesta del documento encontrado
      res.status(200).json(responseFind);
    })
    .catch((errorFind) => {
      // Se retorna la respuesta con problemas
      errorTraceRaven(errorFind);
      res.status(404).send({
        error: errorResponse('view').response,
        errorTrace: errorFind,
      });
    });
};
