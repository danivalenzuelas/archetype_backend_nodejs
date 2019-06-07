// Declare dependencies
const mongoose = require('mongoose');
const settings = require('./../../../config/settings');
const { errorResponse } = require('./../../../utils/errors');
const { errorTraceRaven, responseValue } = require('./../../../utils/general');

// Declare model
const SiiQueue = mongoose.model('SiiQueue');

/*  Method Create
 *  URI: /sii/queue
 *  Method: POST
 */
exports.create = (req, res) => {
  const newSiiQueue = new SiiQueue(req.body);
  newSiiQueue.save()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      errorTraceRaven(error);
      res.status(400).json(errorResponse('create').response);
    });
};

/*  Method List
 *  URI: /sii/queue
 *  Method: GET
 */
exports.list = (req, res) => {
  // Settings filters
  const filters = {};
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
    ? '_id synchronize user'
    : '';
  filters.sort = req.query.order && req.query.order === 'desc'
    ? -1
    : 1;
  filters.test = false;
  if (['Automatic', 'Priority'].indexOf(req.query.type) !== -1) {
    filters.type = req.query.type;
  }
  // Verify import logs
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
  const query = {
    'logs.isDeleted': filters.isDeleted,
    'logs.test': filters.test,
  };
  if (filters.type) {
    query['synchronize.type'] = filters.type;
  }
  SiiQueue.countDocuments(query)
    .then((responseCount) => {
      return SiiQueue.find(query, filters.query, {
        limit: filters.limit,
        skip: filters.page,
        sort: {
          user: filters.sort,
        },
      })
        .then((responseList) => {
          if (filters.catch) {
            throw new Error();
          } else {
            res.status(200).json({
              paging: {
                count: responseList.length,
                limit: filters.limit,
                order: filters.sort === 1 ? 'asc' : 'desc',
                page: (filters.page / filters.limit) + 1,
                total: responseValue(0, responseCount, 0),
              },
              results: responseList,
            });
          }
        })
        .catch((errorList) => {
          errorTraceRaven(errorList);
          res.status(404).json(errorResponse('list').response);
        });
    });
};

/*  Method Remove
 *  URI: /sii/queue/:id
 *  Method: DELETE
 */
exports.remove = (req, res) => {
  SiiQueue.findById(req.params.id)
    .then((responseFind) => {
      if (!responseFind) {
        throw new Error();
      }
      const body = responseFind;
      body.logs.isDeleted = true;
      body.logs.updatedAt = new Date();
      return SiiQueue.findOneAndUpdate({
        _id: req.params.id,
      }, body, {
        new: true,
      })
        .then((responseRemove) => {
          res.status(200).json(responseRemove);
        });
    })
    .catch((errorFind) => {
      errorTraceRaven(errorFind);
      res.status(404).send(errorResponse('remove').response);
    });
};

/*  Method Sync
 *  URI: /sii/queue/sync
 *  Method: GET
 */
exports.sync = (req, res) => {
  if (!!req.query.user) {
    // Settings filters
    const filters = {};
    filters.isDeleted = false;
    filters.test = false;
    // Verify import logs
    if (req.query.logs) {
      req.query.logs.split(',').forEach((log) => {
        switch (log) {
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
    const query = {
      'logs.isDeleted': filters.isDeleted,
      'logs.test': filters.test,
    };
    query.user = req.query.user;
    SiiQueue.find(query, '_id synchronize.date user')
      .then((responseFind) => {
        if (!responseFind || !Array.isArray(responseFind) || responseFind.length === 0) {
          throw new Error();
        }
        res.status(200).json(responseFind[0]);
      })
      .catch((errorFind) => {
        errorTraceRaven(errorFind);
        res.status(404).send(errorResponse('view').response);
      });
  } else {
    res.status(404).send(errorResponse('view').response);
  }
};

/*  Method Update
 *  URI: /sii/queue/:id
 *  Method: PUT
 */
exports.update = (req, res) => {
  SiiQueue.findById(req.params.id)
    .then((responseFind) => {
      if (!responseFind) {
        throw new Error();
      }
      const { body } = req;
      body.logs.updatedAt = new Date();
      return SiiQueue.findOneAndUpdate({
        _id: req.params.id,
      }, body, {
        new: true,
      })
        .then((responseUpdate) => {
          res.status(200).json(responseUpdate);
        });
    })
    .catch((errorFind) => {
      errorTraceRaven(errorFind);
      res.status(404).send(errorResponse('update').response);
    });
};

/*  Method View
 *  URI: /sii/queue/:id
 *  Method: GET
 */
exports.view = (req, res) => {
  SiiQueue.findById(req.params.id)
    .then((responseFind) => {
      if (!responseFind) {
        throw new Error();
      }
      res.status(200).json(responseFind);
    })
    .catch((errorFind) => {
      errorTraceRaven(errorFind);
      res.status(404).send(errorResponse('view').response);
    });
};
