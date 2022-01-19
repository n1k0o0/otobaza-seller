import i18n from '@/lang'
const first_name = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('validator.first_name.required')))
  } else {
    callback()
  }
}
const last_name = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('validator.last_name.required')))
  } else {
    callback()
  }
}

const phone = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('validator.phone.required')))
  } else {
    callback()
  }
}
const password = (rule, value, callback) => {
  if (value.length < 8) {
    callback(new Error(i18n.t('validator.password.min')))
  } else {
    callback()
  }
}

const gender = (rule, value, callback) => {
  if (value === null) {
    callback(new Error(i18n.t('register.select_gender')))
  } else {
    callback()
  }
}

const country = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('register.select_country')))
  } else {
    callback()
  }
}

const currency = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('register.select_currency')))
  } else {
    callback()
  }
}

const city       = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('register.select_city')))
  } else {
    callback()
  }
}
const store_name = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('validator.store_name.required')))
  } else {
    callback()
  }
}
const address    = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('validator.address.required')))
  } else {
    callback()
  }
}

const agreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18n.t('validator.agreement.required')))
  } else {
    callback()
  }
}

export default () => {
  return {
    first_name,
    last_name,
    phone,
    password,
    gender,
    country,
    currency,
    city,
    store_name,
    address,
    agreement
  }
}
