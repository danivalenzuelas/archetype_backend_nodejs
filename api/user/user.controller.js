// Declare dependencies
const mongoose = require('mongoose');
const settings = require('./../../config/settings');
const { errorResponse } = require('./../../utils/errors');
const { errorTraceRaven, responseValue } = require('./../../utils/general');

// Declare model
const User = mongoose.model('User');

/*  Method Create
 *  URI: /user
 *  Method: POST
 */
exports.create = (req, res) => {
  const newUser = new User(req.body);
  newUser.save()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      errorTraceRaven(error);
      res.status(400).json(errorResponse('create').response);
    });
};

/*  Method List
 *  URI: /user
 *  Method: GET
 */
exports.list = (req, res) => {
  // Settings filters
  const filters = {};
  filters.isDeleted = false;
  filters.limit = req.query.limit && req.query.limit ?
    (parseInt(req.query.limit, 10) < 1 || parseInt(req.query.limit, 10) > settings.endpoint.limit)
      ? settings.endpoint.limit
      : parseInt(req.query.limit, 10)
    : settings.endpoint.limit;
  filters.page = req.query.page && req.query.page ?
    parseInt(req.query.page, 10) < 1
      ? 0
      : filters.limit * (parseInt(req.query.page, 10) - 1)
    : 0;
  filters.query = Object.prototype.hasOwnProperty.call(req.query, 'short')
    ? '_id code name'
    : '';
  filters.sort = req.query.order && req.query.order === 'desc'
    ? -1
    : 1;
  filters.test = false;
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
  User.count({
    'logs.isDeleted': filters.isDeleted,
    'logs.test': filters.test,
  })
    .then((responseCount) => {
      return User.find({
        'logs.isDeleted': filters.isDeleted,
        'logs.test': filters.test,
      }, filters.query, {
        limit: filters.limit,
        skip: filters.page,
        sort: {
          name: filters.sort,
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
 *  URI: /user/:id
 *  Method: DELETE
 */
exports.remove = (req, res) => {
  User.findById(req.params.id)
    .then((responseFind) => {
      if (!responseFind) {
        throw new Error();
      }
      const body = responseFind;
      body.logs.isDeleted = true;
      body.logs.updatedAt = new Date();
      return User.findOneAndUpdate({
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

/*  Method Search
 *  URI: /user/search
 *  Method: GET
 */
exports.search = (req, res) => {
  // Settings filters
  const filters = {};
  filters.isDeleted = false;
  filters.limit = req.query.limit && req.query.limit ?
    (parseInt(req.query.limit, 10) < 1 || parseInt(req.query.limit, 10) > settings.endpoint.limit)
      ? settings.endpoint.limit
      : parseInt(req.query.limit, 10)
    : settings.endpoint.limit;
  filters.page = req.query.page && req.query.page ?
    parseInt(req.query.page, 10) < 1
      ? 0
      : filters.limit * (parseInt(req.query.page, 10) - 1)
    : 0;
  filters.test = false;
  filters.text = Object.prototype.hasOwnProperty.call(req.query, 'text')
    ? req.query.text
    : '';
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
          break;
      }
    });
  }
  User.count({
    'logs.isDeleted': filters.isDeleted,
    'logs.test': filters.test,
    $text: {
      $search: filters.text,
    },
  })
    .then((responseCount) => {
      return User.find({
        'logs.isDeleted': filters.isDeleted,
        'logs.test': filters.test,
        $text: {
          $search: filters.text,
        },
      }, {
        score: {
          $meta: 'textScore',
        },
      })
        .limit(filters.limit)
        .skip(filters.page)
        .sort({
          score: {
            $meta: 'textScore',
          },
        })
        .then((responseSearch) => {
          if (filters.catch) {
            throw new Error();
          } else {
            res.status(200).json({
              paging: {
                count: responseSearch.length,
                limit: filters.limit,
                page: (filters.page / filters.limit) + 1,
                total: responseValue(0, responseCount, 0),
              },
              results: responseSearch,
            });
          }
        })
        .catch((errorSearch) => {
          errorTraceRaven(errorSearch);
          res.status(404).json(errorResponse('list').response);
        });
    });
};

/*  Method Update
 *  URI: /user/:id
 *  Method: PUT
 */
exports.update = (req, res) => {
  User.findById(req.params.id)
    .then((responseFind) => {
      if (!responseFind) {
        throw new Error();
      }
      const { body } = req;
      body.logs = responseFind.logs;
      body.logs.updatedAt = new Date();
      return User.findOneAndUpdate({
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
 *  URI: /user/:id
 *  Method: GET
 */
exports.view = (req, res) => {
  User.findById(req.params.id)
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
