// Declare dependencies
const mongoose = require('mongoose');

// Default mocks
module.exports = [
  {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 1,
      exempt: 1,
      fixedAsset: 1,
      net: 1,
      notBillable: 1,
      period: 1,
      tobaccoCigar: 1,
      tobaccoElaborated: 1,
      tobaccoHavana: 1,
      total: 1,
      withoutCredit: 1,
    },
    business: {
      dv: 'K',
      name: 'Name 01',
      rut: 1,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 01',
      code: 1,
      codeSII: 1,
      containerDeposit: 1,
      foreign: {
        dni: 'Foreign DNI 01',
        nationality: 'Foreign Nationality 01',
      },
      id: 1,
      indicator: {
        freeCharge: 'Indicator Free Charge 01',
        service: 'Indicator Service 01',
      },
      internalSII: 1,
      operation: 'Operation 01',
      passage: {
        international: 1,
        national: 1,
      },
      period: '201901',
      receiver: {
        code: 'Receiver Code 01',
        description: 'Receiver Description 01',
      },
      reference: {
        id: 'Id 01',
        type: 1,
      },
      senderNote: 1,
      specialCredit: 1,
      status: true,
      transaction: {
        description: 'Transaction Description 01',
        type: 1,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 1,
      netAmount: 1,
      rut: 1,
      taxAmount: 1,
    },
    tax: {
      amount: 1,
      amountFixedAsset: 1,
      amountNonRecoverable: 1,
      codeNonRecoverable: 1,
      commonUse: 1,
      notWithheld: 1,
      outOfTime: 1,
      own: 1,
      partialRetention: 1,
      rate: 1,
      thirdParties: 1,
      totalRetention: 1,
      totalTax: 1,
      totalTaxNonRecoverable: 1,
      type: 1,
      vehicles: 1,
    },
    taxs: [],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-1',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 2,
      exempt: 2,
      fixedAsset: 2,
      net: 2,
      notBillable: 2,
      period: 2,
      tobaccoCigar: 2,
      tobaccoElaborated: 2,
      tobaccoHavana: 2,
      total: 2,
      withoutCredit: 2,
    },
    business: {
      dv: 'K',
      name: 'Name 02',
      rut: 2,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 02',
      code: 2,
      codeSII: 2,
      containerDeposit: 2,
      foreign: {
        dni: 'Foreign DNI 02',
        nationality: 'Foreign Nationality 02',
      },
      id: 2,
      indicator: {
        freeCharge: 'Indicator Free Charge 02',
        service: 'Indicator Service 02',
      },
      internalSII: 2,
      operation: 'Operation 02',
      passage: {
        international: 2,
        national: 2,
      },
      period: '201902',
      receiver: {
        code: 'Receiver Code 02',
        description: 'Receiver Description 02',
      },
      reference: {
        id: 'Id 02',
        type: 2,
      },
      senderNote: 2,
      specialCredit: 2,
      status: true,
      transaction: {
        description: 'Transaction Description 02',
        type: 2,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 2,
      netAmount: 2,
      rut: 2,
      taxAmount: 2,
    },
    tax: {
      amount: 2,
      amountFixedAsset: 2,
      amountNonRecoverable: 2,
      codeNonRecoverable: 2,
      commonUse: 2,
      notWithheld: 2,
      outOfTime: 2,
      own: 2,
      partialRetention: 2,
      rate: 2,
      thirdParties: 2,
      totalRetention: 2,
      totalTax: 2,
      totalTaxNonRecoverable: 2,
      type: 2,
      vehicles: 2,
    },
    taxs: [],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-2',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 3,
      exempt: 3,
      fixedAsset: 3,
      net: 3,
      notBillable: 3,
      period: 3,
      tobaccoCigar: 3,
      tobaccoElaborated: 3,
      tobaccoHavana: 3,
      total: 3,
      withoutCredit: 3,
    },
    business: {
      dv: 'K',
      name: 'Name 03',
      rut: 3,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 03',
      code: 3,
      codeSII: 3,
      containerDeposit: 3,
      foreign: {
        dni: 'Foreign DNI 03',
        nationality: 'Foreign Nationality 03',
      },
      id: 3,
      indicator: {
        freeCharge: 'Indicator Free Charge 03',
        service: 'Indicator Service 03',
      },
      internalSII: 3,
      operation: 'Operation 03',
      passage: {
        international: 3,
        national: 3,
      },
      period: '201903',
      receiver: {
        code: 'Receiver Code 03',
        description: 'Receiver Description 03',
      },
      reference: {
        id: 'Id 03',
        type: 3,
      },
      senderNote: 3,
      specialCredit: 3,
      status: true,
      transaction: {
        description: 'Transaction Description 03',
        type: 3,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 3,
      netAmount: 3,
      rut: 3,
      taxAmount: 3,
    },
    tax: {
      amount: 3,
      amountFixedAsset: 3,
      amountNonRecoverable: 3,
      codeNonRecoverable: 3,
      commonUse: 3,
      notWithheld: 3,
      outOfTime: 3,
      own: 3,
      partialRetention: 3,
      rate: 3,
      thirdParties: 3,
      totalRetention: 3,
      totalTax: 3,
      totalTaxNonRecoverable: 3,
      type: 3,
      vehicles: 3,
    },
    taxs: [
      {
        amount: 1,
        code: 1,
        rate: 1,
      },
    ],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-3',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 4,
      exempt: 4,
      fixedAsset: 4,
      net: 4,
      notBillable: 4,
      period: 4,
      tobaccoCigar: 4,
      tobaccoElaborated: 4,
      tobaccoHavana: 4,
      total: 4,
      withoutCredit: 4,
    },
    business: {
      dv: 'K',
      name: 'Name 04',
      rut: 4,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 04',
      code: 4,
      codeSII: 4,
      containerDeposit: 4,
      foreign: {
        dni: 'Foreign DNI 04',
        nationality: 'Foreign Nationality 04',
      },
      id: 4,
      indicator: {
        freeCharge: 'Indicator Free Charge 04',
        service: 'Indicator Service 04',
      },
      internalSII: 4,
      operation: 'Operation 04',
      passage: {
        international: 4,
        national: 4,
      },
      period: '201904',
      receiver: {
        code: 'Receiver Code 04',
        description: 'Receiver Description 04',
      },
      reference: {
        id: 'Id 04',
        type: 4,
      },
      senderNote: 4,
      specialCredit: 4,
      status: true,
      transaction: {
        description: 'Transaction Description 04',
        type: 4,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 4,
      netAmount: 4,
      rut: 4,
      taxAmount: 4,
    },
    tax: {
      amount: 4,
      amountFixedAsset: 4,
      amountNonRecoverable: 4,
      codeNonRecoverable: 4,
      commonUse: 4,
      notWithheld: 4,
      outOfTime: 4,
      own: 4,
      partialRetention: 4,
      rate: 4,
      thirdParties: 4,
      totalRetention: 4,
      totalTax: 4,
      totalTaxNonRecoverable: 4,
      type: 4,
      vehicles: 4,
    },
    taxs: [
      {
        amount: 1,
        code: 1,
        rate: 1,
      }, {
        amount: 2,
        code: 2,
        rate: 2,
      },
    ],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-4',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 5,
      exempt: 5,
      fixedAsset: 5,
      net: 5,
      notBillable: 5,
      period: 5,
      tobaccoCigar: 5,
      tobaccoElaborated: 5,
      tobaccoHavana: 5,
      total: 5,
      withoutCredit: 5,
    },
    business: {
      dv: 'K',
      name: 'Name 05',
      rut: 5,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 05',
      code: 5,
      codeSII: 5,
      containerDeposit: 5,
      foreign: {
        dni: 'Foreign DNI 05',
        nationality: 'Foreign Nationality 05',
      },
      id: 5,
      indicator: {
        freeCharge: 'Indicator Free Charge 05',
        service: 'Indicator Service 05',
      },
      internalSII: 5,
      operation: 'Operation 05',
      passage: {
        international: 5,
        national: 5,
      },
      period: '201905',
      receiver: {
        code: 'Receiver Code 05',
        description: 'Receiver Description 05',
      },
      reference: {
        id: 'Id 05',
        type: 5,
      },
      senderNote: 5,
      specialCredit: 5,
      status: true,
      transaction: {
        description: 'Transaction Description 05',
        type: 5,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 5,
      netAmount: 5,
      rut: 5,
      taxAmount: 5,
    },
    tax: {
      amount: 5,
      amountFixedAsset: 5,
      amountNonRecoverable: 5,
      codeNonRecoverable: 5,
      commonUse: 5,
      notWithheld: 5,
      outOfTime: 5,
      own: 5,
      partialRetention: 5,
      rate: 5,
      thirdParties: 5,
      totalRetention: 5,
      totalTax: 5,
      totalTaxNonRecoverable: 5,
      type: 5,
      vehicles: 5,
    },
    taxs: [
      {
        amount: 1,
        code: 1,
        rate: 1,
      }, {
        amount: 2,
        code: 2,
        rate: 2,
      }, {
        amount: 3,
        code: 3,
        rate: 3,
      }, {
        amount: 4,
        code: 4,
        rate: 4,
      },
    ],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-5',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 6,
      exempt: 6,
      fixedAsset: 6,
      net: 6,
      notBillable: 6,
      period: 6,
      tobaccoCigar: 6,
      tobaccoElaborated: 6,
      tobaccoHavana: 6,
      total: 6,
      withoutCredit: 6,
    },
    business: {
      dv: 'K',
      name: 'Name 06',
      rut: 6,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 06',
      code: 6,
      codeSII: 6,
      containerDeposit: 6,
      foreign: {
        dni: 'Foreign DNI 06',
        nationality: 'Foreign Nationality 06',
      },
      id: 6,
      indicator: {
        freeCharge: 'Indicator Free Charge 06',
        service: 'Indicator Service 06',
      },
      internalSII: 6,
      operation: 'Operation 06',
      passage: {
        international: 6,
        national: 6,
      },
      period: '201906',
      receiver: {
        code: 'Receiver Code 06',
        description: 'Receiver Description 06',
      },
      reference: {
        id: 'Id 06',
        type: 6,
      },
      senderNote: 6,
      specialCredit: 6,
      status: true,
      transaction: {
        description: 'Transaction Description 06',
        type: 6,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 6,
      netAmount: 6,
      rut: 6,
      taxAmount: 6,
    },
    tax: {
      amount: 6,
      amountFixedAsset: 6,
      amountNonRecoverable: 6,
      codeNonRecoverable: 6,
      commonUse: 6,
      notWithheld: 6,
      outOfTime: 6,
      own: 6,
      partialRetention: 6,
      rate: 6,
      thirdParties: 6,
      totalRetention: 6,
      totalTax: 6,
      totalTaxNonRecoverable: 6,
      type: 6,
      vehicles: 6,
    },
    taxs: [],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-6',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 7,
      exempt: 7,
      fixedAsset: 7,
      net: 7,
      notBillable: 7,
      period: 7,
      tobaccoCigar: 7,
      tobaccoElaborated: 7,
      tobaccoHavana: 7,
      total: 7,
      withoutCredit: 7,
    },
    business: {
      dv: 'K',
      name: 'Name 07',
      rut: 7,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 07',
      code: 7,
      codeSII: 7,
      containerDeposit: 7,
      foreign: {
        dni: 'Foreign DNI 07',
        nationality: 'Foreign Nationality 07',
      },
      id: null,
      indicator: {
        freeCharge: 'Indicator Free Charge 07',
        service: 'Indicator Service 07',
      },
      internalSII: 7,
      operation: 'Operation 07',
      passage: {
        international: 7,
        national: 7,
      },
      period: '201907',
      receiver: {
        code: 'Receiver Code 07',
        description: 'Receiver Description 07',
      },
      reference: {
        id: 'Id 07',
        type: 7,
      },
      senderNote: 7,
      specialCredit: 7,
      status: true,
      transaction: {
        description: 'Transaction Description 07',
        type: 7,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 7,
      netAmount: 7,
      rut: 7,
      taxAmount: 7,
    },
    tax: {
      amount: 7,
      amountFixedAsset: 7,
      amountNonRecoverable: 7,
      codeNonRecoverable: 7,
      commonUse: 7,
      notWithheld: 7,
      outOfTime: 7,
      own: 7,
      partialRetention: 7,
      rate: 7,
      thirdParties: 7,
      totalRetention: 7,
      totalTax: 7,
      totalTaxNonRecoverable: 7,
      type: 7,
      vehicles: 7,
    },
    taxs: [],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-7',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 8,
      exempt: 8,
      fixedAsset: 8,
      net: 8,
      notBillable: 8,
      period: 8,
      tobaccoCigar: 8,
      tobaccoElaborated: 8,
      tobaccoHavana: 8,
      total: 8,
      withoutCredit: 8,
    },
    business: {
      dv: 'K',
      name: 'Name 08',
      rut: 8,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 08',
      code: null,
      codeSII: 8,
      containerDeposit: 8,
      foreign: {
        dni: 'Foreign DNI 08',
        nationality: 'Foreign Nationality 08',
      },
      id: 8,
      indicator: {
        freeCharge: 'Indicator Free Charge 08',
        service: 'Indicator Service 08',
      },
      internalSII: 8,
      operation: 'Operation 08',
      passage: {
        international: 8,
        national: 8,
      },
      period: '201908',
      receiver: {
        code: 'Receiver Code 08',
        description: 'Receiver Description 08',
      },
      reference: {
        id: 'Id 08',
        type: 8,
      },
      senderNote: 8,
      specialCredit: 8,
      status: true,
      transaction: {
        description: 'Transaction Description 08',
        type: 8,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 8,
      netAmount: 8,
      rut: 8,
      taxAmount: 8,
    },
    tax: {
      amount: 8,
      amountFixedAsset: 8,
      amountNonRecoverable: 8,
      codeNonRecoverable: 8,
      commonUse: 8,
      notWithheld: 8,
      outOfTime: 8,
      own: 8,
      partialRetention: 8,
      rate: 8,
      thirdParties: 8,
      totalRetention: 8,
      totalTax: 8,
      totalTaxNonRecoverable: 8,
      type: 8,
      vehicles: 8,
    },
    taxs: [],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-8',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 9,
      exempt: 9,
      fixedAsset: 9,
      net: 9,
      notBillable: 9,
      period: 9,
      tobaccoCigar: 9,
      tobaccoElaborated: 9,
      tobaccoHavana: 9,
      total: 9,
      withoutCredit: 9,
    },
    business: {
      dv: 'K',
      name: 'Name 09',
      rut: null,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 09',
      code: 9,
      codeSII: 9,
      containerDeposit: 9,
      foreign: {
        dni: 'Foreign DNI 09',
        nationality: 'Foreign Nationality 09',
      },
      id: 9,
      indicator: {
        freeCharge: 'Indicator Free Charge 09',
        service: 'Indicator Service 09',
      },
      internalSII: 9,
      operation: 'Operation 09',
      passage: {
        international: 9,
        national: 9,
      },
      period: '201909',
      receiver: {
        code: 'Receiver Code 09',
        description: 'Receiver Description 09',
      },
      reference: {
        id: 'Id 09',
        type: 9,
      },
      senderNote: 9,
      specialCredit: 9,
      status: true,
      transaction: {
        description: 'Transaction Description 09',
        type: 9,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 9,
      netAmount: 9,
      rut: 9,
      taxAmount: 9,
    },
    tax: {
      amount: 9,
      amountFixedAsset: 9,
      amountNonRecoverable: 9,
      codeNonRecoverable: 9,
      commonUse: 9,
      notWithheld: 9,
      outOfTime: 9,
      own: 9,
      partialRetention: 9,
      rate: 9,
      thirdParties: 9,
      totalRetention: 9,
      totalTax: 9,
      totalTaxNonRecoverable: 9,
      type: 9,
      vehicles: 9,
    },
    taxs: [],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-9',
    },
  }, {
    _id: mongoose.Types.ObjectId(),
    active: true,
    amount: {
      changeLaw18211: 10,
      exempt: 10,
      fixedAsset: 10,
      net: 10,
      notBillable: 10,
      period: 10,
      tobaccoCigar: 10,
      tobaccoElaborated: 10,
      tobaccoHavana: 10,
      total: 10,
      withoutCredit: 10,
    },
    business: {
      dv: null,
      name: null,
      rut: null,
    },
    date: {
      accuse: '2019-05-31T21:30:30.000Z',
      document: '2019-05-31T21:30:30.000Z',
      reception: '2019-05-31T21:30:30.000Z',
      reclaimed: '2019-05-31T21:30:30.000Z',
    },
    document: {
      accountingStatement: 'State 010',
      code: 10,
      codeSII: 10,
      containerDeposit: 10,
      foreign: {
        dni: 'Foreign DNI 010',
        nationality: 'Foreign Nationality 010',
      },
      id: 10,
      indicator: {
        freeCharge: 'Indicator Free Charge 010',
        service: 'Indicator Service 010',
      },
      internalSII: 10,
      operation: 'Operation 010',
      passage: {
        international: 10,
        national: 10,
      },
      period: '2019010',
      receiver: {
        code: 'Receiver Code 010',
        description: 'Receiver Description 010',
      },
      reference: {
        id: 'Id 010',
        type: 10,
      },
      senderNote: 10,
      specialCredit: 10,
      status: true,
      transaction: {
        description: 'Transaction Description 010',
        type: 10,
      },
    },
    execute: {
      details: true,
      xml: true,
    },
    logs: {
      isDeleted: false,
      test: true,
    },
    paying: {
      dv: 'K',
      exemptAmount: 10,
      netAmount: 10,
      rut: 10,
      taxAmount: 10,
    },
    tax: {
      amount: 10,
      amountFixedAsset: 10,
      amountNonRecoverable: 10,
      codeNonRecoverable: 10,
      commonUse: 10,
      notWithheld: 10,
      outOfTime: 10,
      own: 10,
      partialRetention: 10,
      rate: 10,
      thirdParties: 10,
      totalRetention: 10,
      totalTax: 10,
      totalTaxNonRecoverable: 10,
      type: 10,
      vehicles: 10,
    },
    taxs: [],
    transaction: {
      queue: mongoose.Types.ObjectId(),
      user: '1-10',
    },
  },
];
