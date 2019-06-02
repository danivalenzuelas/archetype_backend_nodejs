// Declare dependencies
const mongoose = require('mongoose');

// Setting model
const SiiDocumentSchema = new mongoose.Schema({
  active: {
    default: true,
    index: true,
    required: true,
    type: Boolean,
  },
  amount: {
    changeLaw18211: {
      default: null,
      type: Number,
    },
    exempt: {
      default: null,
      type: Number,
    },
    fixedAsset: {
      default: null,
      type: Number,
    },
    net: {
      default: null,
      type: Number,
    },
    notBillable: {
      default: null,
      type: Number,
    },
    period: {
      default: null,
      type: Number,
    },
    tobaccoCigar: {
      default: null,
      type: Number,
    },
    tobaccoElaborated: {
      default: null,
      type: Number,
    },
    tobaccoHavana: {
      default: null,
      type: Number,
    },
    total: {
      default: null,
      type: Number,
    },
    withoutCredit: {
      default: null,
      type: Number,
    },
  },
  business: {
    dv: {
      default: null,
      index: true,
      required: true,
      trim: true,
      type: String,
    },
    name: {
      default: null,
      index: true,
      required: true,
      trim: true,
      type: String,
    },
    rut: {
      default: null,
      index: true,
      required: true,
      type: Number,
    },
  },
  date: {
    accuse: {
      default: null,
      type: Date,
    },
    document: {
      default: null,
      type: Date,
    },
    reception: {
      default: null,
      type: Date,
    },
    reclaimed: {
      default: null,
      type: Date,
    },
  },
  document: {
    accountingStatement: {
      default: null,
      trim: true,
      type: String,
    },
    code: {
      default: null,
      index: true,
      required: true,
      type: Number,
    },
    codeSII: {
      default: null,
      type: Number,
    },
    containerDeposit: {
      default: null,
      type: Number,
    },
    foreign: {
      dni: {
        default: null,
        trim: true,
        type: String,
      },
      nationality: {
        default: null,
        trim: true,
        type: String,
      },
    },
    id: {
      default: null,
      index: true,
      required: true,
      type: Number,
    },
    indicator: {
      freeCharge: {
        default: null,
        trim: true,
        type: String,
      },
      service: {
        default: null,
        trim: true,
        type: String,
      },
    },
    internalSII: {
      default: null,
      type: Number,
    },
    operation: {
      default: null,
      trim: true,
      type: String,
    },
    passage: {
      international: {
        default: null,
        type: Number,
      },
      national: {
        default: null,
        type: Number,
      },
    },
    period: {
      default: null,
      index: true,
      required: true,
      trim: true,
      type: String,
    },
    receiver: {
      code: {
        default: null,
        trim: true,
        type: String,
      },
      description: {
        default: null,
        trim: true,
        type: String,
      },
    },
    reference: {
      id: {
        default: null,
        trim: true,
        type: String,
      },
      type: {
        default: null,
        type: Number,
      },
    },
    senderNote: {
      default: null,
      type: Number,
    },
    specialCredit: {
      default: null,
      type: Number,
    },
    status: {
      default: false,
      type: Boolean,
    },
    transaction: {
      description: {
        default: null,
        trim: true,
        type: String,
      },
      type: {
        default: null,
        type: Number,
      },
    },
  },
  execute: {
    details: {
      default: false,
      index: true,
      required: true,
      type: Boolean,
    },
    xml: {
      default: false,
      index: true,
      required: true,
      type: Boolean,
    },
  },
  logs: {
    createdAt: {
      default: new Date(),
      required: true,
      type: Date,
    },
    isDeleted: {
      default: false,
      index: true,
      required: true,
      type: Boolean,
    },
    test: {
      default: false,
      index: true,
      required: true,
      type: Boolean,
    },
    updatedAt: {
      default: null,
      required: false,
      type: Date,
    },
  },
  paying: {
    dv: {
      default: null,
      trim: true,
      type: String,
    },
    exemptAmount: {
      default: null,
      type: Number,
    },
    netAmount: {
      default: null,
      type: Number,
    },
    rut: {
      default: null,
      type: Number,
    },
    taxAmount: {
      default: null,
      type: Number,
    },
  },
  tax: {
    amount: {
      default: null,
      type: Number,
    },
    amountFixedAsset: {
      default: null,
      type: Number,
    },
    amountNonRecoverable: {
      default: null,
      type: Number,
    },
    codeNonRecoverable: {
      default: null,
      type: Number,
    },
    commonUse: {
      default: null,
      type: Number,
    },
    notWithheld: {
      default: null,
      type: Number,
    },
    outOfTime: {
      default: null,
      type: Number,
    },
    own: {
      default: null,
      type: Number,
    },
    partialRetention: {
      default: null,
      type: Number,
    },
    rate: {
      default: null,
      type: Number,
    },
    thirdParties: {
      default: null,
      type: Number,
    },
    totalRetention: {
      default: null,
      type: Number,
    },
    type: {
      default: null,
      type: Number,
    },
    vehicles: {
      default: null,
      type: Number,
    },
  },
});

// Export model SiiDocument
module.exports = mongoose.model('SiiDocument', SiiDocumentSchema);
